from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text,JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class QueryHistory(Base):
    __tablename__ = "query_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    natural_question = Column(Text, nullable=False)
    generated_sql = Column(Text, nullable=False)
    execution_result = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    is_bookmarked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    explanation = Column(Text, nullable=True)
    analysis = Column(JSON, nullable=True,default=None)

    user = relationship("User", back_populates="query_history")
