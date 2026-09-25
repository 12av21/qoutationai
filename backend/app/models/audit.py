"""Database models - Audit Events and Notifications."""
import uuid
from datetime import datetime
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
    AuditEventType, NotificationType,
)


class AuditEvent(Base, TimestampMixin):
    """Immutable audit trail events."""
    __tablename__ = "audit_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )

    # Event identification
    event_type: Mapped[AuditEventType] = mapped_column(
        Enum(AuditEventType), nullable=False, index=True
    )
    event_category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # Actor
    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True
    )
    actor_role: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    actor_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Related entities
    rfq_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=True, index=True
    )
    quote_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quotes.id"), nullable=True, index=True
    )
    quote_version: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Event details
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Evidence and data
    evidence: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    before_state: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    after_state: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Metadata
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    correlation_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)

    # Relationships (not loaded by default for performance)
    organization: Mapped["Organization"] = relationship(lazy="raise")
    actor: Mapped[Optional["User"]] = relationship(lazy="raise")
    rfq: Mapped[Optional["RFQ"]] = relationship(lazy="raise")
    quote: Mapped[Optional["Quote"]] = relationship(lazy="raise")

    __table_args__ = (
        Index("ix_audit_org_event_time", "organization_id", "event_type", "created_at"),
        Index("ix_audit_rfq_time", "rfq_id", "created_at"),
        Index("ix_audit_quote_time", "quote_id", "created_at"),
    )


class AuditEvidence(Base, TimestampMixin):
    """Supporting evidence for audit events."""
    __tablename__ = "audit_evidence"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    audit_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("audit_events.id"), nullable=False, index=True
    )

    evidence_type: Mapped[str] = mapped_column(String(50), nullable=False)  # document, screenshot, calculation, email
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    content_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)


class Notification(Base, TimestampMixin):
    """User notifications."""
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )

    type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    # Related entities
    rfq_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=True
    )
    quote_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quotes.id"), nullable=True
    )

    # Status
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_dismissed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Metadata
    priority: Mapped[str] = mapped_column(String(20), default="normal")  # low, normal, high, urgent
    action_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    user: Mapped["User"] = relationship(lazy="selectin")

    __table_args__ = (
        Index("ix_notification_user_read", "user_id", "is_read", "created_at"),
        Index("ix_notification_org_type", "organization_id", "type", "created_at"),
    )