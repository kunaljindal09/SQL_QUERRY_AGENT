import httpx
import json
from typing import Optional, List, Dict, Any
from app.core.config import settings
import re
from google.genai import Client
from google.genai.types import GenerateContentConfig


class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.base_url = settings.LLAMA_BASE_URL
        self.model = settings.LLAMA_MODEL
        self.verify_ssl = settings.LLAMA_VERIFY_SSL
        self.google_client = Client(api_key=settings.GOOGLE_API_KEY)

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
            print(f"[LLMService] Primary LLM failed: {e}")

        # --- FALLBACK: Google GenAI ---
        try:
            raw = await self._call_google_llm(prompt)
            parsed = self._parse_json_response(raw)
            if parsed.get("sql"):
                return {"sql": parsed["sql"], "explanation": parsed.get("explanation", "")}
        except Exception as e:
            print(f"[LLMService] Google fallback failed: {e}")

        # --- BOTH FAILED ---
        return {"sql": "", "explanation": "", "error": "Both primary and fallback LLMs failed."}

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
        response = self.google_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=GenerateContentConfig(
                temperature=0,
                top_p=0.9
            )
        )

        raw_text = response.text
        if not raw_text:
            raise Exception("Empty response from Google GenAI")

        return raw_text

    # ------------------------------------------------
    # SHARED: PARSE JSON FROM LLM OUTPUT
    # ------------------------------------------------
    def _parse_json_response(self, raw: str) -> Dict[str, Any]:
        """
        Safely parse JSON from LLM output.
        Handles markdown fences like ```json ... ``` and extracts
        the first JSON object found in the string.
        """
        # Strip markdown code fences if present
        cleaned = re.sub(r"```(?:json)?\s*", "", raw).replace("```", "").strip()

        # Try direct parse first
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Fallback: extract first {...} block from the string
        match = re.search(r"\{.*?\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

        raise ValueError(f"Could not parse JSON from LLM response: {cleaned[:200]}")

    # ------------------------------------------------
    # SHARED: BUILD PROMPT
    # ------------------------------------------------
    def _build_prompt(self, question: str, schema_text: str) -> str:
        return f"""
You are an expert SQL query generator. Based on the database schema and user question below, generate a valid SQL query.

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