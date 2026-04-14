from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional

from app.core.database import get_app_db
from app.core.security import decode_token, get_current_user
from app.models.user import User
from app.models.query_history import QueryHistory
from app.schemas.user import QueryHistoryResponse

router = APIRouter(prefix="/api/history", tags=["History"])


async def get_optional_user(request: Request) -> Optional[int]:
    """Extract user_id from Bearer token in Authorization header, return None if not provided or invalid."""
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    return payload.get("sub") if payload else None


@router.get("/", response_model=List[QueryHistoryResponse])
async def get_history(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    bookmarked_only: bool = Query(False),
    db: AsyncSession = Depends(get_app_db)
):
    """Get query history for current user (or all if unauthenticated for testing)."""
    user_id = await get_optional_user(request)
    query = select(QueryHistory).order_by(desc(QueryHistory.created_at))
    
    if user_id:
        query = query.where(QueryHistory.user_id == user_id)
    
    if bookmarked_only:
        query = query.where(QueryHistory.is_bookmarked == True)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    history = result.scalars().all()
    return history


@router.get("/{history_id}", response_model=QueryHistoryResponse)
async def get_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_app_db)
):
    """Get a specific history item"""
    result = await db.execute(
        select(QueryHistory).where(
            QueryHistory.id == history_id,
            QueryHistory.user_id == current_user.id
        )
    )
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=404, detail="History item not found")
    
    return history


@router.post("/{history_id}/bookmark")
async def toggle_bookmark(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_app_db)
):
    """Toggle bookmark status for a history item"""
    result = await db.execute(
        select(QueryHistory).where(
            QueryHistory.id == history_id,
            QueryHistory.user_id == current_user.id
        )
    )
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=404, detail="History item not found")
    
    history.is_bookmarked = not history.is_bookmarked
    await db.commit()
    
    return {"bookmarked": history.is_bookmarked}


@router.delete("/{history_id}")
async def delete_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_app_db)
):
    """Delete a history item"""
    result = await db.execute(
        select(QueryHistory).where(
            QueryHistory.id == history_id,
            QueryHistory.user_id == current_user.id
        )
    )
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=404, detail="History item not found")
    
    await db.delete(history)
    await db.commit()
    
    return {"message": "History item deleted"}
