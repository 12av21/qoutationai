"""Database models - Product Matching."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    String, Text, Integer, Boolean, DateTime, ForeignKey, Enum, Numeric,
    JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin
from app.models.enums import (
    MatchStatus,
)


class ProductMatch(Base, TimestampMixin):
    """Product matching results for RFQ."""
    __tablename__ = "product_matches"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    rfq_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=False, index=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True
    )

    technical_fit_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    matching_attributes: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    non_matching_attributes: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    evidence: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    stock_available: Mapped[int] = mapped_column(Integer, nullable=False)
    lead_time_days: Mapped[int] = mapped_column(Integer, nullable=False)

    status: Mapped[MatchStatus] = mapped_column(
        Enum(MatchStatus), default=MatchStatus.RECOMMENDED, nullable=False
    )
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    selected_for_quote: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)