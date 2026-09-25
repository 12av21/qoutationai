"""Database models - RFQ and related entities."""
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
    RFQStatus, RFQStage, ExtractionStatus, ClarificationStatus,
    MatchStatus, ApprovalStatus, ApprovalRole, QuoteStatus,
    ExceptionStatus, CurrencyCode, TaxTreatment, Incoterm, PaymentMethod,
)


class RFQDocument(Base, TimestampMixin):
    """RFQ uploaded documents."""
    __tablename__ = "rfq_documents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    rfq_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=False, index=True
    )
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    page_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    parsed_content: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    parsing_status: Mapped[str] = mapped_column(String(50), default="pending")
    parsing_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    rfq: Mapped["RFQ"] = relationship(back_populates="documents", lazy="selectin")


class RFQ(Base, TimestampMixin, SoftDeleteMixin):
    """Request for Quotation - main workflow entity."""
    __tablename__ = "rfqs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    assignee_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True
    )
    customer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customers.id"), nullable=True, index=True
    )

    rfq_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    rfq_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    customer_rfq_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    customer_rfq_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    status: Mapped[RFQStatus] = mapped_column(
        Enum(RFQStatus), default=RFQStatus.DRAFT, nullable=False, index=True
    )
    current_stage: Mapped[RFQStage] = mapped_column(
        Enum(RFQStage), default=RFQStage.STAGE_1_INTAKE, nullable=False
    )
    stage_completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    customer_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    customer_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    destination: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    incoterm: Mapped[Optional[Incoterm]] = mapped_column(Enum(Incoterm), nullable=True)
    payment_terms: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    payment_method: Mapped[Optional[PaymentMethod]] = mapped_column(Enum(PaymentMethod), nullable=True)
    validity_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )

    special_conditions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    attachments: Mapped[List[dict]] = mapped_column(JSON, default=list, nullable=False)

    source: Mapped[str] = mapped_column(String(50), default="manual")
    confidence_score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    organization: Mapped["Organization"] = relationship(back_populates="rfqs", lazy="selectin")
    owner: Mapped["User"] = relationship(
        back_populates="owned_rfqs", foreign_keys=[owner_id], lazy="selectin"
    )
    assignee: Mapped[Optional["User"]] = relationship(
        back_populates="assigned_rfqs", foreign_keys=[assignee_id], lazy="selectin"
    )
    customer: Mapped[Optional["Customer"]] = relationship(lazy="selectin")
    documents: Mapped[List["RFQDocument"]] = relationship(back_populates="rfq", lazy="selectin")
    requirements: Mapped[List["RFQRequirement"]] = relationship(back_populates="rfq", lazy="selectin")
    normalized_requirements: Mapped[List["NormalizedRequirement"]] = relationship(back_populates="rfq", lazy="selectin")
    clarifications: Mapped[List["Clarification"]] = relationship(back_populates="rfq", lazy="selectin")
    product_matches: Mapped[List["ProductMatch"]] = relationship(back_populates="rfq", lazy="selectin")
    quotes: Mapped[List["Quote"]] = relationship(back_populates="rfq", lazy="selectin")
    audit_events: Mapped[List["AuditEvent"]] = relationship(back_populates="rfq", lazy="selectin")

    __table_args__ = (
        UniqueConstraint("organization_id", "rfq_number", name="uq_org_rfq_number"),
        Index("ix_rfq_org_status", "organization_id", "status"),
        Index("ix_rfq_assignee_status", "assignee_id", "status"),
    )


class RFQRequirement(Base, TimestampMixin):
    """Extracted requirements from RFQ."""
    __tablename__ = "rfq_requirements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    rfq_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=False, index=True
    )

    category: Mapped[str] = mapped_column(String(100), nullable=False)
    field_name: Mapped[str] = mapped_column(String(100), nullable=False)
    field_label: Mapped[str] = mapped_column(String(255), nullable=False)

    value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    source: Mapped[str] = mapped_column(String(50), nullable=False)
    source_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    confidence: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)

    extraction_status: Mapped[ExtractionStatus] = mapped_column(
        Enum(ExtractionStatus), default=ExtractionStatus.EXTRACTED, nullable=False
    )
    is_mandatory: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ai_explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    rfq: Mapped["RFQ"] = relationship(back_populates="requirements", lazy="selectin")
    normalized: Mapped[Optional["NormalizedRequirement"]] = relationship(
        back_populates="requirement", uselist=False, lazy="selectin"
    )


class NormalizedRequirement(Base, TimestampMixin):
    """Normalized/governed requirements after verification."""
    __tablename__ = "normalized_requirements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    rfq_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=False, index=True
    )
    requirement_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfq_requirements.id"), nullable=False, unique=True
    )

    normalized_value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    normalized_unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    normalization_rule: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    status: Mapped[ExtractionStatus] = mapped_column(
        Enum(ExtractionStatus), default=ExtractionStatus.EXTRACTED, nullable=False
    )
    confidence: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    ai_explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    is_assumption: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    assumption_justification: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assumed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    assumed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    verified_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    rfq: Mapped["RFQ"] = relationship(back_populates="normalized_requirements", lazy="selectin")
    requirement: Mapped["RFQRequirement"] = relationship(back_populates="normalized", lazy="selectin")


class Clarification(Base, TimestampMixin):
    """Clarification requests for missing/ambiguous specs."""
    __tablename__ = "clarifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    rfq_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=False, index=True
    )
    requirement_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfq_requirements.id"), nullable=True
    )

    field_name: Mapped[str] = mapped_column(String(100), nullable=False)
    field_label: Mapped[str] = mapped_column(String(255), nullable=False)
    why_required: Mapped[str] = mapped_column(Text, nullable=False)
    customer_question: Mapped[str] = mapped_column(Text, nullable=False)
    suggested_message: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[ClarificationStatus] = mapped_column(
        Enum(ClarificationStatus), default=ClarificationStatus.PENDING, nullable=False
    )
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    responded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Override tracking
    is_override: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    override_justification: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    override_assumption: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    override_policy_ref: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    overridden_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    overridden_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Response
    customer_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_source: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    rfq: Mapped["RFQ"] = relationship(back_populates="clarifications", lazy="selectin")
    requirement: Mapped[Optional["RFQRequirement"]] = relationship(lazy="selectin")