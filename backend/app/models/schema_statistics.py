from sqlalchemy import Column, Integer, String, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.core.database import Base


class SchemaStatistics(Base):
    __tablename__ = "schema_statistics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    connection_string = Column(String(500), nullable=False, unique=True, index=True)
    database_name = Column(String(255), nullable=False)
    
    # Statistics data
    table_sizes = Column(JSON, nullable=False)  # [{table_name, row_count}, ...]
    column_types = Column(JSON, nullable=False)  # {type: count}
    nullable_stats = Column(JSON, nullable=False)  # [{table_name, nullable_count, not_null_count}, ...]
    relationship_stats = Column(JSON, nullable=False)  # [{from_table, to_table, type}, ...]
    primary_keys_info = Column(JSON, nullable=False)  # [{table_name, pk_column}, ...]
    
    # TTL and metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def is_expired(self, ttl_hours: int = 24) -> bool:
        """Check if the cached data has expired"""
        from datetime import datetime, timedelta
        now = datetime.now(self.updated_at.tzinfo)
        expiry_time = self.updated_at + timedelta(hours=ttl_hours)
        return now > expiry_time
