"""FastAPI dependency injections."""
from typing import Optional
from uuid import UUID
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.core import User, Organization
from app.services.auth_service_ext import AuthServiceExtended


async def get_db() -> AsyncSession:
    async for session in get_session():
        yield session


async def get_auth_ext(db: AsyncSession = Depends(get_db)) -> AuthServiceExtended:
    return AuthServiceExtended(db)


async def get_current_user(
    authorization: str = Header(None),
    auth_ext: AuthServiceExtended = Depends(get_auth_ext),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    try:
        return await auth_ext.get_current_user(token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


async def get_current_org(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Organization:
    org = await db.get(Organization, current_user.organization_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org