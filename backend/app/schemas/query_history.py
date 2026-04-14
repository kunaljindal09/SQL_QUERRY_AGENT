from pydantic import BaseModel
from typing import Optional, Any, List
from datetime import datetime


class QueryHistoryBase(BaseModel):
    natural_question: str


class QueryHistoryCreate(QueryHistoryBase):
    generated_sql: str
    execution_result: Optional[Any] = None
    explanation: str


class QueryHistoryResponse(QueryHistoryBase):
    id: int
    user_id: int
    generated_sql: str
    explanation: str
    execution_result: Optional[Any] = None
    is_bookmarked: bool
    created_at: datetime

    class Config:
        from_attributes = True


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    sql: str
    explanation: str
    result: Optional[List[dict]] = None
