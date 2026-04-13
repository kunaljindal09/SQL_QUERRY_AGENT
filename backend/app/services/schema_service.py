from typing import List, Dict, Any
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class SchemaService:
    """Service for introspecting database schema"""
    
    @staticmethod
    async def get_database_schema(db: AsyncSession, database_name: str = "sql_agent_db") -> Dict[str, Any]:
        """
        Get complete database schema including tables, columns, and relationships
        """
        # Get all tables
        tables_query = text("""
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = :db_name 
            AND TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        """)
        
        result = await db.execute(tables_query, {"db_name": database_name})
        tables = [row[0] for row in result.fetchall()]
        
        schema = {"tables": []}
        
        for table_name in tables:
            table_schema = await SchemaService._get_table_schema(db, database_name, table_name)
            schema["tables"].append(table_schema)
        
        return schema
    
    @staticmethod
    async def _get_table_schema(
        db: AsyncSession, 
        database_name: str, 
        table_name: str
    ) -> Dict[str, Any]:
        """Get schema for a single table"""
        columns_query = text("""
            SELECT 
                COLUMN_NAME,
                DATA_TYPE,
                IS_NULLABLE,
                COLUMN_KEY,
                EXTRA
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = :db_name 
            AND TABLE_NAME = :table_name
            ORDER BY ORDINAL_POSITION
        """)
        
        result = await db.execute(
            columns_query, 
            {"db_name": database_name, "table_name": table_name}
        )
        
        columns = []
        primary_key = None
        
        for row in result.fetchall():
            col_name, data_type, is_nullable, column_key, extra = row
            columns.append({
                "column_name": col_name,
                "data_type": data_type,
                "is_nullable": is_nullable,
                "is_primary_key": column_key == "PRI",
                "is_auto_increment": "auto_increment" in (extra or "").lower()
            })
            
            if column_key == "PRI":
                primary_key = col_name
        
        # Get foreign keys
        fk_query = text("""
            SELECT 
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = :db_name 
            AND TABLE_NAME = :table_name
            AND REFERENCED_TABLE_NAME IS NOT NULL
        """)
        
        result = await db.execute(
            fk_query, 
            {"db_name": database_name, "table_name": table_name}
        )
        
        foreign_keys = []
        for row in result.fetchall():
            foreign_keys.append({
                "column": row[0],
                "references_table": row[1],
                "references_column": row[2]
            })
        
        return {
            "table_name": table_name,
            "columns": columns,
            "primary_key": primary_key,
            "foreign_keys": foreign_keys
        }

    @staticmethod
    async def compute_schema_statistics(
        db: AsyncSession, 
        database_name: str,
        schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Compute schema statistics for chart visualization"""
        
        # 1. Get table sizes (row counts)
        table_sizes = []
        for table in schema["tables"]:
            count_query = text(f"SELECT COUNT(*) FROM `{table['table_name']}`")
            result = await db.execute(count_query)
            row_count = result.scalar() or 0
            table_sizes.append({
                "table_name": table["table_name"],
                "row_count": row_count
            })
        
        # 2. Analyze column types distribution
        column_types = {}
        for table in schema["tables"]:
            for column in table["columns"]:
                col_type = column["data_type"].upper()
                column_types[col_type] = column_types.get(col_type, 0) + 1
        
        # 3. Get nullable statistics
        nullable_stats = []
        for table in schema["tables"]:
            nullable_count = sum(1 for col in table["columns"] if col["is_nullable"] == "YES")
            not_null_count = len(table["columns"]) - nullable_count
            nullable_stats.append({
                "table_name": table["table_name"],
                "nullable_count": nullable_count,
                "not_null_count": not_null_count
            })
        
        # 4. Relationship statistics
        relationship_stats = []
        for table in schema["tables"]:
            for fk in table["foreign_keys"]:
                relationship_stats.append({
                    "from_table": table["table_name"],
                    "from_column": fk["column"],
                    "to_table": fk["references_table"],
                    "to_column": fk["references_column"],
                    "type": "1:N"
                })
        
        # 5. Primary keys info
        primary_keys_info = []
        for table in schema["tables"]:
            pk = table.get("primary_key")
            if pk:
                primary_keys_info.append({
                    "table_name": table["table_name"],
                    "pk_column": pk
                })
        
        return {
            "table_sizes": table_sizes,
            "column_types": column_types,
            "nullable_stats": nullable_stats,
            "relationship_stats": relationship_stats,
            "primary_keys_info": primary_keys_info
        }


schema_service = SchemaService()
