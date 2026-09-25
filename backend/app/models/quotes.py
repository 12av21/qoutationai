"""Database models - Quotes."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    String, Text, Integer, Boolean, DateTime, ForeignKey, Enum, Numeric,
    UniqueConstraint, Index, JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin, SoftDeleteMixin
from app.models.enums import (
    QuoteStatus, CurrencyCode, TaxTreatment, Incoterm, PaymentMethod,
    FXRateSource,
)


class Quote(Base, TimestampMixin, SoftDeleteMixin):
    """Quotation."""
    __tablename__ = "quotes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )
    rfq_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=True, index=True
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, index=True
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    quote_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    status: Mapped[QuoteStatus] = mapped_column(
        Enum(QuoteStatus), default=QuoteStatus.DRAFT, nullable=False, index=True
    )

    base_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    quote_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    exchange_rate: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 8), nullable=True)
    exchange_rate_source: Mapped[Optional[FXRateSource]] = mapped_column(Enum(FXRateSource), nullable=True)
    exchange_rate_locked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    quote_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    validity_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    valid_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    incoterm: Mapped[Optional[Incoterm]] = mapped_column(Enum(Incoterm), nullable=True)
    payment_terms: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    payment_method: Mapped[Optional[PaymentMethod]] = mapped_column(Enum(PaymentMethod), nullable=True)

    tax_treatment: Mapped[TaxTreatment] = mapped_column(
        Enum(TaxTreatment), default=TaxTreatment.GST_INTRASATE, nullable=False
    )
    tax_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("18"), nullable=False)

    subtotal: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)
    taxable_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)
    grand_total: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)

    base_subtotal: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)
    base_grand_total: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)

    requires_technical_approval: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    requires_commercial_approval: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    requires_finance_approval: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assumptions: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    exceptions: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)

    __table_args__ = (
        UniqueConstraint("organization_id", "quote_number", "version", name="uq_org_quote_version"),
        Index("ix_quote_org_status", "organization_id", "status"),
    )