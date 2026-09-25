"""FX / Exchange Rate API endpoints."""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, get_current_org
from app.models.fx_pricing import ExchangeRate
from app.models.enums import CurrencyCode, FXRateSource
from app.schemas.fx import (
    ExchangeRateCreate,
    ExchangeRateRead,
    ExchangeRateUpdate,
    ConvertRequest,
    ConvertResponse,
    LockRateRequest,
    LockRateResponse,
)
from app.services.fx_service import FXService

router = APIRouter(prefix="/exchange-rates", tags=["FX"])


@router.post("", response_model=ExchangeRateRead, status_code=status.HTTP_201_CREATED)
async def create_exchange_rate(
    payload: ExchangeRateCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
    org=Depends(get_current_org),
):
    """Create a new exchange rate (org‑specific or platform‑wide)."""
    # Only ORG_ADMIN or SUPER_ADMIN may create rates
    if current_user.role not in ("ORG_ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    data = payload.dict()
    data["organization_id"] = org.id if payload.organization_id is None else UUID(payload.organization_id)
    fx = FXService(db)
    rate = await fx.create_rate(data)
    return rate


@router.get("", response_model=List[ExchangeRateRead])
async def list_exchange_rates(
    base_currency: Optional[CurrencyCode] = None,
    quote_currency: Optional[CurrencyCode] = None,
    organization_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List exchange rates with optional filters."""
    stmt = select(ExchangeRate)
    if base_currency:
        stmt = stmt.where(ExchangeRate.base_currency == base_currency)
    if quote_currency:
        stmt = stmt.where(ExchangeRate.quote_currency == quote_currency)
    if organization_id:
        stmt = stmt.where(ExchangeRate.organization_id == organization_id)
    else:
        # default to platform‑wide + user's org
        stmt = stmt.where(
            (ExchangeRate.organization_id.is_(None)) | (ExchangeRate.organization_id == current_user.organization_id)
        )
    stmt = stmt.order_by(ExchangeRate.effective_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/latest", response_model=ExchangeRateRead)
async def get_latest_rate(
    base_currency: CurrencyCode = Query(...),
    quote_currency: CurrencyCode = Query(...),
    organization_id: Optional[UUID] = None,
    as_of: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Fetch the most recent applicable rate."""
    fx = FXService(db)
    org_id = organization_id or current_user.organization_id
    rate = await fx.get_latest_rate(base_currency, quote_currency, org_id, as_of)
    if not rate:
        raise HTTPException(status_code=404, detail="No exchange rate found")
    return rate


@router.post("/convert", response_model=ConvertResponse)
async def convert_currency(
    payload: ConvertRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Convert an amount from one currency to another using the latest rate."""
    fx = FXService(db)
    # If organization_id not supplied, default to user's org
    if not payload.organization_id:
        payload.organization_id = str(current_user.organization_id)
    try:
        return await fx.convert(payload)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/lock", response_model=LockRateResponse)
async def lock_rate_for_quote(
    payload: LockRateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Lock an FX rate for a specific quote version (called from quote creation)."""
    if current_user.role not in ("SALES_USER", "SALES_MANAGER", "ORG_ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    fx = FXService(db)
    return await fx.lock_rate_for_quote(payload)


@router.patch("/{rate_id}", response_model=ExchangeRateRead)
async def update_exchange_rate(
    rate_id: UUID,
    payload: ExchangeRateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update an existing exchange rate (admin only)."""
    if current_user.role not in ("ORG_ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    stmt = select(ExchangeRate).where(ExchangeRate.id == rate_id)
    result = await db.execute(stmt)
    rate = result.scalar_one_or_none()
    if not rate:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(rate, field, value)
    await db.flush()
    return rate