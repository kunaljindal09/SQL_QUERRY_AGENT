import re
from typing import List, Dict, Any
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings


class QueryService:
    """Service for executing SQL queries safely"""
    
    DANGEROUS_KEYWORDS = [
        "DROP", "DELETE", "TRUNCATE", "ALTER", "INSERT", "UPDATE", 
        "CREATE", "GRANT", "REVOKE", "EXEC", "EXECUTE", "SHOW", "DESCRIBE"
    ]
    
    @staticmethod
    def validate_sql(query: str) -> tuple[bool, str]:
        """
        Validate SQL query safely.
        - Only SELECT queries allowed
        - No dangerous keywords
        - No multiple statements
        - Allows 1 trailing semicolon
        """
        original = query.strip()
        no_semicolon = original.rstrip(";").strip()

        # Normalize for keyword checking
        upper = no_semicolon.upper()

        # 1. Must start with SELECT
        if not upper.startswith("SELECT"):
            return False, "Only SELECT queries are allowed."

        # 2. Multiple statements check
        # More than one semicolon is not allowed
        if original.count(";") > 1:
            return False, "Multiple statements are not allowed."

        # If a semicolon exists, it must be at the end
        if ";" in original[:-1]:
            return False, "Semicolon allowed only at the end."

        # 3. Dangerous keyword check (whole words)
        for keyword in QueryService.DANGEROUS_KEYWORDS:
            pattern = rf"\b{keyword}\b"
            if re.search(pattern, upper):
                return False, f"Query contains forbidden keyword: {keyword}"

        return True, ""
    
    @staticmethod
    async def execute_query(
        db: AsyncSession, 
        query: str,
        max_rows: int = None
    ) -> Dict[str, Any]:
        """
        Execute a SELECT query and return JSON-safe results.
        Converts datetime, date, decimal → JSON-safe values.
        """
    
        from datetime import datetime, date
        from decimal import Decimal
    
        if max_rows is None:
            max_rows = settings.MAX_QUERY_ROWS
    
        # Clean query
        q = query.strip().rstrip(";")
    
        # Add LIMIT only if not present
        if not re.search(r"\bLIMIT\b\s*\d+", q, re.IGNORECASE):
            q = f"{q} LIMIT {max_rows}"
    
        # Now ALWAYS add a semicolon at the end
        q = q + ";"
    
        # Serializer for JSON-safe values
        def serialize_value(value):
            if isinstance(value, (datetime, date)):
                return value.isoformat()
            if isinstance(value, Decimal):
                return float(value)
            return value
    
        try:
            print(f"Executing SQL Query: {q}")
    
            result = await db.execute(text(q))
            rows = result.fetchall()
            columns = list(result.keys())
            print(f"Query executed successfully. Columns: {columns}, Row count: {rows}")
            # Convert rows → JSON safe dicts
            data = []
            for row in rows:
                row_dict = {}
                for col, val in zip(columns, row):
                    row_dict[col] = serialize_value(val)
                data.append(row_dict)
    
            return {
                "success": True,
                "columns": columns,
                "rows": data,
                "row_count": len(data)
            }
    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "columns": [],
                "rows": [],
                "row_count": 0
            }

query_service = QueryService()
