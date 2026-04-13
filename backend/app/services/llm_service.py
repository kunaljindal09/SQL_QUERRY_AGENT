import asyncio
import httpx
import json
import re
from typing import Optional, List, Dict, Any

from app.core.config import settings
from google.genai import Client
from google.genai.types import GenerateContentConfig


REQUIRED_ANALYSIS_KEYS = {"summary", "insights", "anomalies", "trends"}


class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.base_url = settings.LLAMA_BASE_URL
        self.model = settings.LLAMA_MODEL
        self.verify_ssl = settings.LLAMA_VERIFY_SSL
        self.google_client = Client(api_key=settings.GEMINI_API_KEY)

    # ------------------------------------------------
    # PUBLIC: GENERATE SQL
    # ------------------------------------------------
    async def generate_sql(
        self,
        question: str,
        schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate SQL with fallback to Google GenAI if primary LLM fails.
        Returns: { sql, explanation } or { sql: "", explanation: "", error: "..." }
        """
        schema_text = self._format_schema(schema)
        prompt = self._build_prompt(question, schema_text)

        # --- PRIMARY: Ollama/Llama ---
        try:
            raw = await self._call_llm(prompt)
            parsed = self._parse_json_response(raw)
            if parsed.get("sql"):
                return {"sql": parsed["sql"], "explanation": parsed.get("explanation", "")}
        except Exception as e:
            print(f"[LLMService] Primary LLM failed (generate_sql): {e}")

        # --- FALLBACK: Google GenAI ---
        try:
            raw = await self._call_google_llm(prompt)
            parsed = self._parse_json_response(raw)
            if parsed.get("sql"):
                return {"sql": parsed["sql"], "explanation": parsed.get("explanation", "")}
        except Exception as e:
            print(f"[LLMService] Google fallback failed (generate_sql): {e}")

        # --- BOTH FAILED ---
        return {"sql": "", "explanation": "", "error": "Both primary and fallback LLMs failed."}

    # ------------------------------------------------
    # PUBLIC: ANALYZE QUERY RESULTS
    # ------------------------------------------------
    async def analyze_query_results(
        self,
        question: str,
        results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze SQL query results and return insights.
        Returns: { summary, insights, anomalies, trends } or error dict.
        """
        if not results:
            return {
                "summary": "No data returned.",
                "insights": [],
                "anomalies": [],
                "trends": []
            }

        data_json = self._prepare_data_for_llm(results)
        prompt = self._build_analysis_prompt(question, data_json)

        # --- PRIMARY: Ollama/Llama ---
        try:
            raw = await self._call_llm(prompt)
            parsed = self._safe_parse_json(raw)
            if parsed and REQUIRED_ANALYSIS_KEYS.issubset(parsed.keys()):
                return parsed
            else:
                print(f"[LLMService] Primary LLM returned incomplete analysis: {raw[:300]}")
        except Exception as e:
            print(f"[LLMService] Primary LLM failed (analyze_query_results): {e}")

        # --- FALLBACK: Google GenAI ---
        try:
            raw = await self._call_google_llm(prompt)
            parsed = self._safe_parse_json(raw)
            if parsed and REQUIRED_ANALYSIS_KEYS.issubset(parsed.keys()):
                return parsed
            else:
                print(f"[LLMService] Google LLM returned incomplete analysis: {raw[:300]}")
        except Exception as e:
            print(f"[LLMService] Google fallback failed (analyze_query_results): {e}")

        # --- BOTH FAILED ---
        return {
            "summary": "",
            "insights": [],
            "anomalies": [],
            "trends": [],
            "error": "Both LLMs failed to produce a valid analysis."
        }

    # ------------------------------------------------
    # PRIMARY: OLLAMA CALL
    # ------------------------------------------------
    async def _call_llm(self, prompt: str) -> str:
        async with httpx.AsyncClient(verify=self.verify_ssl, timeout=120.0) as client:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1,
                    "top_p": 0.9,
                    "num_predict": 2048
                }
            }

            response = await client.post(
                f"{self.base_url}/generate",
                json=payload
            )

            if response.status_code != 200:
                raise Exception(f"Ollama API error: {response.status_code} - {response.text}")

            result = response.json()
            raw_text = result.get("response", "")

            if not raw_text:
                raise Exception("Empty response from Ollama")

            return raw_text

    # ------------------------------------------------
    # FALLBACK: GOOGLE GENAI CALL
    # ------------------------------------------------
    async def _call_google_llm(self, prompt: str) -> str:
        """
        Runs the synchronous Google GenAI client in a thread pool
        to avoid blocking the async event loop.
        """
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.google_client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt,
                config=GenerateContentConfig(
                    temperature=0,
                    top_p=0.9
                )
            )
        )

        raw_text = response.text
        if not raw_text:
            raise Exception("Empty response from Google GenAI")

        return raw_text

    # ------------------------------------------------
    # SHARED: PARSE JSON (for SQL generation)
    # ------------------------------------------------
    def _parse_json_response(self, raw: str) -> Dict[str, Any]:
        """
        Safely parse JSON from LLM output.
        Strips markdown fences and extracts first JSON object found.
        """
        cleaned = re.sub(r"```(?:json)?\s*", "", raw).replace("```", "").strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Fallback: extract first {...} block
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

        raise ValueError(f"Could not parse JSON from LLM response: {cleaned[:200]}")

    # ------------------------------------------------
    # SHARED: SAFE PARSE JSON (for analysis)
    # ------------------------------------------------
    def _safe_parse_json(self, raw: str) -> Dict[str, Any] | None:
        """
        Safely parse JSON from LLM output, returns None on failure.
        Strips markdown fences before parsing.
        """
        cleaned = re.sub(r"```(?:json)?\s*|\s*```", "", raw.strip())

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError:
                    return None

        return None

    # ------------------------------------------------
    # SHARED: BUILD SQL PROMPT
    # ------------------------------------------------
    def _build_prompt(self, question: str, schema_text: str) -> str:
        return f"""You are an expert SQL query generator. Based on the database schema and user question below, generate a valid SQL query.

DATABASE SCHEMA:
{schema_text}

USER QUESTION: {question}

RULES:
1. Only generate SELECT queries (no INSERT, UPDATE, DELETE, DROP, or ALTER).
2. Use proper JOINs where needed.
3. The query must be efficient and well-formatted.
4. Explain WHY this query answers the question — mention tables, filters, and joins used.
5. Do not include conversational behaviour or apologies. Just provide the SQL and explanation.
6. If names of the columns are same then give them alias name and the names should be meaningful.

Respond ONLY with a valid JSON object. No markdown, no extra text:
{{
    "sql": "<your SQL query here>",
    "explanation": "<why this query answers the question>"
}}"""

    # ------------------------------------------------
    # SHARED: BUILD ANALYSIS PROMPT
    # ------------------------------------------------
    def _build_analysis_prompt(self, user_query: str, data_json: str) -> str:
        return f"""
SYSTEM: You are a meticulous Senior Data Analyst. Your goal is to provide a factual, evidence-based analysis of the provided dataset.

CONTEXT:
User Question: {user_query}
Dataset (JSON Format): {data_json}


1. INSTRUCTIONS:
- You are looking at a SAMPLE of the query results (up to 50 rows).
- Treat this sample as representative.
- Provide insights based ONLY on the rows provided. 
- If you see an employee with a salary > 50,000 in these 20 rows, report it.
- DO NOT complain about truncated data; simply analyze the available rows..
2. ANALYSIS DEPTH: 
   - 'summary': Directly answer the user's question using specific metrics (sums, averages, or counts) found in the data.
   - 'insights': Identify correlations or specific high/low performing segments.
   - 'anomalies': Look for outliers, null values, or unexpected zero-values.
   - 'trends': Identify patterns (e.g., chronological growth, frequent categories).

STRICT OUTPUT RULES:
- Return ONLY a single valid JSON object.
- NO markdown code fences (e.g., do not use ```json).
- NO preamble or conversational text.
- If a section has no findings, return an empty array [].
- All numeric claims must be derived directly from the DATA provided.

JSON STRUCTURE:
{{
  "summary": "string",
  "insights": ["string"],
  "anomalies": ["string"],
  "trends": ["string"]
}}
"""

    # ------------------------------------------------
    # SHARED: PREPARE DATA FOR LLM
    # ------------------------------------------------
    def _prepare_data_for_llm(self, results: List[Dict[str, Any]], max_rows: int = 50) -> str:
        """
        Trims results to max_rows and wraps with metadata
        so the LLM knows if data was truncated.
        """
        trimmed = results[:max_rows]
        meta = {
            "total_rows": len(results),
            "rows_analyzed": len(trimmed),
            "truncated": len(results) > max_rows,
            "data": trimmed
        }
        return json.dumps(meta, indent=2, default=str)

    # ------------------------------------------------
    # SHARED: FORMAT SCHEMA
    # ------------------------------------------------
    def _format_schema(self, schema: Dict[str, Any]) -> str:
        lines = []
        for table in schema.get("tables", []):
            table_name = table.get("table_name")
            columns = table.get("columns", [])
            lines.append(f"\nTable: {table_name}")
            for col in columns:
                nullable = "NULL" if col.get("is_nullable") == "YES" else "NOT NULL"
                lines.append(f"  - {col.get('column_name')}: {col.get('data_type')} ({nullable})")
        return "\n".join(lines)


llm_service = LLMService()