"""
LLM Agent Service
This module handles the integration with Groq/Ollama API for SQL generation.
"""
from typing import Optional
from app.core.config import settings


class LLMAgent:
    """
    LLM Agent that converts natural language questions to SQL queries.

    In production, this integrates with Ollama (primary) or Groq (fallback).
    For now, it uses a simple rule-based approach.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = None):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model = model or settings.LLAMA_MODEL

    def generate_sql(self, question: str, schema: str) -> dict:
        """
        Convert a natural language question to SQL.

        Args:
            question: The natural language question
            schema: The database schema description

        Returns:
            dict with 'sql' and 'explanation' keys
        """
        # Placeholder implementation - in production, call Ollama or Groq API
        return {
            "sql": "-- LLM integration pending. Configure GROQ_API_KEY or Ollama in .env",
            "explanation": "Configure your Groq API key or Ollama to enable LLM-based SQL generation."
        }
    
    def validate_and_fix_sql(self, sql: str, schema: str) -> dict:
        """
        Validate and potentially fix SQL queries.
        
        Args:
            sql: The SQL query to validate
            schema: The database schema description
            
        Returns:
            dict with 'sql', 'is_valid', and 'error' keys
        """
        # Placeholder validation
        sql_upper = sql.strip().upper()
        
        if not sql_upper.startswith("SELECT"):
            return {
                "sql": sql,
                "is_valid": False,
                "error": "Only SELECT queries are allowed"
            }
        
        dangerous_keywords = ["DROP", "DELETE", "TRUNCATE", "ALTER", "INSERT", "UPDATE", "CREATE"]
        for keyword in dangerous_keywords:
            if keyword in sql_upper:
                return {
                    "sql": sql,
                    "is_valid": False,
                    "error": f"Dangerous operation '{keyword}' is prohibited"
                }
        
        return {
            "sql": sql,
            "is_valid": True,
            "error": None
        }


# Singleton instance
llm_agent = LLMAgent()
