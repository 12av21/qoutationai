"""Database models - Core entities (Organization, User)."""
import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    String, Text, Integer, Boolean, DateTime, ForeignKey, Enum, JSON,
    func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin, SoftDeleteMixin
from app.models.enums import (
    UserRole, UserStatus, OrganizationStatus, CurrencyCode,
    TaxTreatment, Incoterm,
)


class Organization(Base, TimestampMixin, SoftDeleteMixin):
    """Organization/Tenant model."""
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    legal_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    default_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    default_tax_treatment: Mapped[Optional[TaxTreatment]] = mapped_column(
        Enum(TaxTreatment), nullable=True
    )
    invoice_prefix: Mapped[str] = mapped_column(String(20), default="INV")
    quotation_prefix: Mapped[str] = mapped_column(String(20), default="QT")
    financial_year_start: Mapped[int] = mapped_column(Integer, default=4)
    default_payment_terms: Mapped[str] = mapped_column(String(50), default="Net 15")
    default_incoterm: Mapped[Incoterm] = mapped_column(
        Enum(Incoterm), default=Incoterm.DAP, nullable=False
    )
    status: Mapped[OrganizationStatus] = mapped_column(
        Enum(OrganizationStatus), default=OrganizationStatus.ACTIVE, nullable=False
    )
    settings: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    # Relationships
    users: Mapped[List["User"]] = relationship(back_populates="organization", lazy="selectin")
    customers: Mapped[List["Customer"]] = relationship(back_populates="organization", lazy="selectin")
    products: Mapped[List["Product"]] = relationship(back_populates="organization", lazy="selectin")
    rfqs: Mapped[List["RFQ"]] = relationship(back_populates="organization", lazy="selectin")
    quotes: Mapped[List["Quote"]] = relationship(back_populates="organization", lazy="selectin")
    pricing_rules: Mapped[List["PricingRule"]] = relationship(back_populates="organization", lazy="selectin")
    exchange_rates: Mapped[List["ExchangeRate"]] = relationship(back_populates="organization", lazy="selectin")
    audit_events: Mapped[List["AuditEvent"]] = relationship(back_populates="organization", lazy="selectin")


class User(Base, TimestampMixin, SoftDeleteMixin):
    """User model with RBAC."""
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.SALES_USER, nullable=False
    )
    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus), default=UserStatus.PENDING_VERIFICATION, nullable=False
    )
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    preferred_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    language: Mapped[str] = mapped_column(String(10), default="en")
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    password_changed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    settings: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="users", lazy="selectin")
    sessions: Mapped[List["UserSession"]] = relationship(back_populates="user", lazy="selectin")
    owned_rfqs: Mapped[List["RFQ"]] = relationship(
        back_populates="owner", foreign_keys="RFQ.owner_id", lazy="selectin"
    )
    assigned_rfqs: Mapped[List["RFQ"]] = relationship(
        back_populates="assignee", foreign_keys="RFQ.assignee_id", lazy="selectin"
    )
    approvals: Mapped[List["Approval"]] = relationship(back_populates="approver", lazy="selectin")
    audit_events: Mapped[List["AuditEvent"]] = relationship(back_populates="actor", lazy="selectin")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user", lazy="selectin")


class UserSession(Base, TimestampMixin):
    """User session for authentication."""
    __tablename__ = "user_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    refresh_token_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    device_info: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    browser: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    last_activity_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="sessions", lazy="selectin")


class PasswordResetToken(Base, TimestampMixin):
    """Password reset tokens."""
    __tablename__ = "password_reset_tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(lazy="selectin")


class EmailVerificationToken(Base, TimestampMixin):
    """Email verification tokens."""
    __tablename__ = "email_verification_tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(lazy="selectin")