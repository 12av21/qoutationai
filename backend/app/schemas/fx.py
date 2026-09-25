"""Pydantic schemas for FX / Exchange Rate operations."""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, validator

from app.models.enums import CurrencyCode, FXRateSource


class ExchangeRateBase(BaseModel):
    base_currency: CurrencyCode
    quote_currency: CurrencyCode
    rate: Decimal = Field(..., gt=0, description="Exchange rate (quote per base)")
    source: FXRateSource = FXRateSource.MANUAL
    markup_percent: Decimal = Field(Decimal("0"), ge=0, le=100)
    effective_at: datetime
    expires_at: Optional[datetime] = None


class ExchangeRateCreate(ExchangeRateBase):
    organization_id: Optional[str] = None  # UUID string, optional for platform-wide rates


class ExchangeRateUpdate(BaseModel):
    rate: Optional[Decimal] = Field(None, gt=0)
    markup_percent: Optional[Decimal] = Field(None, ge=0, le=100)
    expires_at: Optional[datetime] = None
    source: Optional[FXRateSource] = None


class ExchangeRateRead(ExchangeRateBase):
    id: str
    organization_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConvertRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    from_currency: CurrencyCode
    to_currency: CurrencyCode
    organization_id: Optional[str] = None
    as_of: Optional[datetime] = None  # defaults to now


class ConvertResponse(BaseModel):
    converted_amount: Decimal
    rate_used: Decimal
    rate_source: FXRateSource
    rate_timestamp: datetime
    base_currency: CurrencyCode
    quote_currency: CurrencyCode


class LockRateRequest(BaseModel):
    quote_id: str
    base_currency: CurrencyCode
    quote_currency: CurrencyCode
    rate: Decimal = Field(..., gt=0)
    source: FXRateSource
    markup_percent: Decimal = Field(Decimal("0"), ge=0, le=100)


class LockRateResponse(BaseModel):
    success: bool
    locked_rate: Decimal
    locked_at: datetime
    message: str = "FX rate locked for quote version"