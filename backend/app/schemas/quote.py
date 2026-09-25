"""Pydantic schemas for Quote operations."""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field
from uuid import UUID

from app.models.enums import QuoteStatus, CurrencyCode, TaxTreatment, Incoterm, PaymentMethod


class QuoteItemCreate(BaseModel):
    product_id: Optional[UUID] = None
    line_number: int
    name: str = Field(..., max_length=255)
    sku: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    quantity: Decimal = Field(..., gt=0)
    unit: str = Field("pcs", max_length=50)
    unit_price: Decimal = Field(..., ge=0)  # in quote currency
    discount_percent: Decimal = Field(Decimal("0"), ge=0, le=100)
    tax_rate: Decimal = Field(Decimal("18"), ge=0, le=100)
    cost_price: Optional[Decimal] = None  # in base currency


class QuoteItemRead(QuoteItemCreate):
    id: UUID
    quote_id: UUID
    discount_amount: Decimal
    tax_amount: Decimal
    line_total: Decimal
    base_unit_price: Optional[Decimal]
    base_line_total: Optional[Decimal]
    margin_amount: Optional[Decimal]
    margin_percent: Optional[Decimal]

    class Config:
        from_attributes = True


class QuoteCreate(BaseModel):
    rfq_id: Optional[UUID] = None
    customer_id: UUID
    quote_currency: CurrencyCode = CurrencyCode.INR
    exchange_rate: Optional[Decimal] = None
    exchange_rate_source: Optional[str] = None
    quote_date: datetime
    validity_days: int = Field(30, ge=1, le=365)
    incoterm: Optional[Incoterm] = None
    payment_terms: Optional[str] = Field(None, max_length=100)
    payment_method: Optional[PaymentMethod] = None
    tax_treatment: TaxTreatment = TaxTreatment.GST_INTRASATE
    tax_rate: Decimal = Field(Decimal("18"), ge=0, le=100)
    notes: Optional[str] = None
    assumptions: List[str] = []
    items: List[QuoteItemCreate] = []


class QuoteUpdate(BaseModel):
    status: Optional[QuoteStatus] = None
    validity_days: Optional[int] = Field(None, ge=1, le=365)
    incoterm: Optional[Incoterm] = None
    payment_terms: Optional[str] = Field(None, max_length=100)
    payment_method: Optional[PaymentMethod] = None
    tax_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    notes: Optional[str] = None
    assumptions: Optional[List[str]] = None


class QuoteRead(BaseModel):
    id: UUID
    organization_id: UUID
    rfq_id: Optional[UUID]
    customer_id: UUID
    owner_id: UUID
    quote_number: str
    version: int
    status: QuoteStatus
    base_currency: CurrencyCode
    quote_currency: CurrencyCode
    exchange_rate: Optional[Decimal]
    exchange_rate_source: Optional[str]
    exchange_rate_locked_at: Optional[datetime]
    quote_date: datetime
    validity_days: int
    valid_until: datetime
    incoterm: Optional[Incoterm]
    payment_terms: Optional[str]
    payment_method: Optional[PaymentMethod]
    tax_treatment: TaxTreatment
    tax_rate: Decimal
    subtotal: Decimal
    discount_amount: Decimal
    taxable_amount: Decimal
    tax_amount: Decimal
    grand_total: Decimal
    base_subtotal: Optional[Decimal]
    base_grand_total: Optional[Decimal]
    requires_technical_approval: bool
    requires_commercial_approval: bool
    requires_finance_approval: bool
    notes: Optional[str]
    assumptions: List[str]
    exceptions: List[str]
    items: List[QuoteItemRead] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuoteVersionRead(BaseModel):
    id: UUID
    quote_id: UUID
    version: int
    snapshot: dict
    changed_fields: List[dict]
    change_reason: Optional[str]
    changed_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class SubmitApprovalRequest(BaseModel):
    quote_id: UUID
    change_reason: Optional[str] = None