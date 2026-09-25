"""Database models - FX/Exchange Rates and Pricing Rules."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    String, Text, Integer, Boolean, DateTime, ForeignKey, Enum, Numeric,
    UniqueConstraint, Index, JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin
from app.models.enums import (
    CurrencyCode, FXRateSource,
)


class ExchangeRate(Base, TimestampMixin):
    """Exchange rate history."""
    __tablename__ = "exchange_rates"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True, index=True
    )

    base_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), nullable=False, index=True
    )
    quote_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), nullable=False, index=True
    )

    rate: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False)
    source: Mapped[FXRateSource] = mapped_column(
        Enum(FXRateSource), default=FXRateSource.MANUAL, nullable=False
    )
    markup_percent: Mapped[Decimal] = mapped_column(Numeric(5, 4), default=Decimal("0"), nullable=False)

    effective_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True, index=True)

    __table_args__ = (
        UniqueConstraint("organization_id", "base_currency", "quote_currency", "effective_at", name="uq_org_fx_rate"),
        Index("ix_fx_rate_lookup", "base_currency", "quote_currency", "effective_at"),
    )


class PricingRule(Base, TimestampMixin):
    """Pricing and discount rules."""
    __tablename__ = "pricing_rules"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    min_quantity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_quantity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    customer_segments: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    product_categories: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)

    discount_type: Mapped[str] = mapped_column(String(50), nullable=False)
    discount_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    auto_approve_threshold: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    requires_approval_above: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)

    min_margin_percent: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)