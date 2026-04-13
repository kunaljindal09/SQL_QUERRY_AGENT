from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.schema_statistics import SchemaStatistics
from app.services.schema_service import schema_service


class StatisticsService:
    """Service for managing cached schema statistics with TTL"""
    
    @staticmethod
    async def get_or_compute_statistics(
        app_db: AsyncSession,
        target_db: AsyncSession,
        connection_string: Optional[str],
        database_name: str,
        schema: Dict[str, Any],
        ttl_hours: int = 24,
        force_refresh: bool = False
    ) -> Dict[str, Any]:
        """
        Get cached statistics or compute fresh ones if expired.
        
        Args:
            app_db: Application database session for caching
            target_db: Target database session for schema introspection
            connection_string: Database connection string (None for default DB)
            database_name: Name of the database
            schema: Current schema information
            ttl_hours: Time to live in hours (default 24)
            force_refresh: Force recomputation even if cache is valid
            
        Returns:
            Statistics data
        """
        # Use "DEFAULT" as sentinel value for default database
        cache_key = connection_string or "DEFAULT"
        
        # Try to get existing cached statistics
        stmt = select(SchemaStatistics).where(
            SchemaStatistics.connection_string == cache_key
        )
        result = await app_db.execute(stmt)
        cached = result.scalar_one_or_none()
        
        # Check if cache is valid
        if cached and not force_refresh and not cached.is_expired(ttl_hours):
            return {
                "table_sizes": cached.table_sizes,
                "column_types": cached.column_types,
                "nullable_stats": cached.nullable_stats,
                "relationship_stats": cached.relationship_stats,
                "primary_keys_info": cached.primary_keys_info,
                "cached_at": cached.updated_at.isoformat(),
                "expires_at": (cached.updated_at + timedelta(hours=ttl_hours)).isoformat()
            }
        
        # Compute fresh statistics
        statistics = await schema_service.compute_schema_statistics(
            target_db, database_name, schema
        )
        
        # Update or create cache entry
        if cached:
            # Update existing entry
            stmt = (
                update(SchemaStatistics)
                .where(SchemaStatistics.connection_string == cache_key)
                .values(
                    table_sizes=statistics["table_sizes"],
                    column_types=statistics["column_types"],
                    nullable_stats=statistics["nullable_stats"],
                    relationship_stats=statistics["relationship_stats"],
                    primary_keys_info=statistics["primary_keys_info"],
                    updated_at=datetime.now(cached.updated_at.tzinfo)
                )
            )
            await app_db.execute(stmt)
        else:
            # Create new entry
            new_cache = SchemaStatistics(
                connection_string=cache_key,
                database_name=database_name,
                table_sizes=statistics["table_sizes"],
                column_types=statistics["column_types"],
                nullable_stats=statistics["nullable_stats"],
                relationship_stats=statistics["relationship_stats"],
                primary_keys_info=statistics["primary_keys_info"]
            )
            app_db.add(new_cache)
        
        await app_db.commit()
        
        now = datetime.now()
        return {
            **statistics,
            "cached_at": now.isoformat(),
            "expires_at": (now + timedelta(hours=ttl_hours)).isoformat()
        }
    
    @staticmethod
    async def invalidate_cache(app_db: AsyncSession, connection_string: Optional[str]) -> bool:
        """Manually invalidate cache for a connection"""
        # Use "DEFAULT" as sentinel value for default database
        cache_key = connection_string or "DEFAULT"
        
        stmt = select(SchemaStatistics).where(
            SchemaStatistics.connection_string == cache_key
        )
        result = await app_db.execute(stmt)
        cached = result.scalar_one_or_none()
        
        if cached:
            await app_db.delete(cached)
            await app_db.commit()
            return True
        return False


statistics_service = StatisticsService()
