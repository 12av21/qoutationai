"""Database models - Approvals and Commercial Exceptions."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import (
    String, Text, Integer, Boolean, DateTime, ForeignKey, Enum, Numeric,
    JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin
from app.models.enums import (
    ApprovalStatus, ApprovalRole, ExceptionStatus,
)


class Approval(Base, TimestampMixin):
    """Approval workflow."""
    __tablename__ = "approvals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    quote_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quotes.id"), nullable=False, index=True
    )
    approver_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    role: Mapped[ApprovalRole] = mapped_column(Enum(ApprovalRole), nullable=False)
    sequence: Mapped[int] = mapped_column(Integer, nullable=False)

    status: Mapped[ApprovalStatus] = mapped_column(
        Enum(ApprovalStatus), default=ApprovalStatus.PENDING, nullable=False
    )

    requested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    responded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class CommercialException(Base, TimestampMixin):
    """Commercial margin exceptions."""
    __tablename__ = "commercial_exceptions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    quote_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quotes.id"), nullable=False, index=True
    )
    exception_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)

    requested_margin: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    policy_floor_margin: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    actual_margin: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)

    justification: Mapped[str] = mapped_column(Text, nullable=False)
    customer_context: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    status: Mapped[ExceptionStatus] = mapped_column(
        Enum(ExceptionStatus), default=ExceptionStatus.PENDING, nullable=False
    )

    requested_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    requested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    approval_comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)