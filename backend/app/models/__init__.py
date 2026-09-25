"""Models package for QuotePilot AI."""

from app.models.base import TimestampMixin, SoftDeleteMixin
from app.models.enums import *
from app.models.core import (
    Organization,
    User,
    UserSession,
    PasswordResetToken,
    EmailVerificationToken,
)
from app.models.rfq_quote import (
    RFQDocument,
    RFQ,
    RFQRequirement,
    NormalizedRequirement,
    Clarification,
)
from app.models.products import (
    Customer,
    CustomerContact,
    Product,
    Inventory,
)
from app.models.product_match import ProductMatch
from app.models.quotes import Quote
from app.models.quote_items import QuoteItem, QuoteVersion
from app.models.approvals import Approval, CommercialException
from app.models.fx_pricing import ExchangeRate, PricingRule
from app.models.audit import AuditEvent, AuditEvidence, Notification

__all__ = [
    # Base
    "TimestampMixin",
    "SoftDeleteMixin",
    # Core
    "Organization",
    "User",
    "UserSession",
    "PasswordResetToken",
    "EmailVerificationToken",
    # RFQ
    "RFQDocument",
    "RFQ",
    "RFQRequirement",
    "NormalizedRequirement",
    "Clarification",
    # Products & Customers
    "Customer",
    "CustomerContact",
    "Product",
    "Inventory",
    "ProductMatch",
    # Quotes
    "Quote",
    "QuoteItem",
    "QuoteVersion",
    # Approvals & Exceptions
    "Approval",
    "CommercialException",
    # FX & Pricing
    "ExchangeRate",
    "PricingRule",
    # Audit & Notifications
    "AuditEvent",
    "AuditEvidence",
    "Notification",
]