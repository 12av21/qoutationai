"""Database models - Products and Inventory."""
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
    CurrencyCode, TaxTreatment, Incoterm, PaymentMethod,
)


class Customer(Base, TimestampMixin, SoftDeleteMixin):
    """Customer model."""
    __tablename__ = "customers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    legal_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    billing_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    shipping_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    preferred_quote_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )

    default_payment_terms: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    default_incoterm: Mapped[Optional[Incoterm]] = mapped_column(Enum(Incoterm), nullable=True)
    credit_limit: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)

    organization: Mapped["Organization"] = relationship(back_populates="customers", lazy="selectin")
    contacts: Mapped[List["CustomerContact"]] = relationship(back_populates="customer", lazy="selectin")


class CustomerContact(Base, TimestampMixin):
    """Customer contact persons."""
    __tablename__ = "customer_contacts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    role: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    customer: Mapped["Customer"] = relationship(back_populates="contacts", lazy="selectin")


class Product(Base, TimestampMixin, SoftDeleteMixin):
    """Product catalog."""
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    specifications: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    base_price: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    base_currency: Mapped[CurrencyCode] = mapped_column(
        Enum(CurrencyCode), default=CurrencyCode.INR, nullable=False
    )
    cost_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)

    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reorder_point: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    tax_treatment: Mapped[TaxTreatment] = mapped_column(
        Enum(TaxTreatment), default=TaxTreatment.GST_INTRASATE, nullable=False
    )
    hs_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_service: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    organization: Mapped["Organization"] = relationship(back_populates="products", lazy="selectin")

    __table_args__ = (
        UniqueConstraint("organization_id", "sku", name="uq_org_product_sku"),
    )


class Inventory(Base, TimestampMixin):
    """Inventory tracking."""
    __tablename__ = "inventory"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    movement_type: Mapped[str] = mapped_column(String(50), nullable=False)
    reference_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    reference_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    product: Mapped["Product"] = relationship(lazy="selectin")