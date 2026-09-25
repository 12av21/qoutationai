"""Database models - Quote Items and Versions."""
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
    CurrencyCode,
)


class QuoteItem(Base, TimestampMixin):
    """Quote line items."""
    __tablename__ = "quote_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    quote_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quotes.id"), nullable=False, index=True
    )
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id"), nullable=True
    )

    line_number: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    unit: Mapped[str] = mapped_column(String(50), default="pcs", nullable=False)

    unit_price: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    discount_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0"), nullable=False)
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)
    tax_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("18"), nullable=False)
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0"), nullable=False)
    line_total: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)

    base_unit_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)
    base_line_total: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)

    cost_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)
    margin_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)
    margin_percent: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)


class QuoteVersion(Base, TimestampMixin):
    """Quote version history for audit trail."""
    __tablename__ = "quote_versions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    quote_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quotes.id"), nullable=False, index=True
    )
    version: Mapped[int] = mapped_column(Integer, nullable=False)

    snapshot: Mapped[dict] = mapped_column(JSON, nullable=False)
    changed_fields: Mapped[List[dict]] = mapped_column(JSON, default=list, nullable=False)
    change_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    changed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("quote_id", "version", name="uq_quote_version"),
    )