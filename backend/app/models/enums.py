"""Application enums - User and Organization."""
import enum


class UserRole(str, enum.Enum):
    """User roles in the system."""
    SUPER_ADMIN = "super_admin"
    ORG_ADMIN = "org_admin"
    SALES_MANAGER = "sales_manager"
    SALES_USER = "sales_user"
    TECHNICAL_APPROVER = "technical_approver"
    COMMERCIAL_MANAGER = "commercial_manager"
    FINANCE_REVIEWER = "finance_reviewer"
    VIEWER = "viewer"


class UserStatus(str, enum.Enum):
    """User account status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING_VERIFICATION = "pending_verification"
    SUSPENDED = "suspended"


class OrganizationStatus(str, enum.Enum):
    """Organization status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"
    SUSPENDED = "suspended"


class RFQStatus(str, enum.Enum):
    """RFQ workflow status."""
    DRAFT = "draft"
    PROCESSING = "processing"
    SPECS_REVIEW = "specs_review"
    CLARIFICATION_REQUIRED = "clarification_required"
    MATCHING = "matching"
    COMMERCIAL_REVIEW = "commercial_review"
    APPROVAL_REQUIRED = "approval_required"
    APPROVED = "approved"
    RELEASED = "released"
    REJECTED = "rejected"
    REVISION_REQUIRED = "revision_required"
    COMPLETED = "completed"


class RFQStage(str, enum.Enum):
    """RFQ workflow stages."""
    STAGE_1_INTAKE = "stage_1_intake"
    STAGE_2_VERIFY_SPECS = "stage_2_verify_specs"
    STAGE_3_CLARIFICATION = "stage_3_clarification"
    STAGE_4_MATCH_MARGIN = "stage_4_match_margin"
    STAGE_5_APPROVALS = "stage_5_approvals"
    STAGE_6_QUOTE_AUDIT = "stage_6_quote_audit"


class ExtractionStatus(str, enum.Enum):
    """Field extraction status."""
    EXTRACTED = "extracted"
    VERIFIED = "verified"
    NORMALIZED = "normalized"
    ASSUMED = "assumed"
    MISSING = "missing"
    AMBIGUOUS = "ambiguous"
    CONFLICTING = "conflicting"
    INVALID = "invalid"
    OPTIONAL = "optional"


class ClarificationStatus(str, enum.Enum):
    """Clarification request status."""
    PENDING = "pending"
    SENT = "sent"
    RESPONDED = "responded"
    OVERRIDDEN = "overridden"
    RESOLVED = "resolved"


class MatchStatus(str, enum.Enum):
    """Product match status."""
    RECOMMENDED = "recommended"
    ALTERNATIVE = "alternative"
    REJECTED = "rejected"
    SELECTED = "selected"


class ApprovalStatus(str, enum.Enum):
    """Approval status."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVISION = "needs_revision"
    NOT_REQUIRED = "not_required"


class ApprovalRole(str, enum.Enum):
    """Approval role types."""
    TECHNICAL_APPROVER = "technical_approver"
    COMMERCIAL_MANAGER = "commercial_manager"
    FINANCE_REVIEWER = "finance_reviewer"


class QuoteStatus(str, enum.Enum):
    """Quotation status."""
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    RELEASED = "released"
    REJECTED = "rejected"
    EXPIRED = "expired"
    REVISED = "revised"


class ExceptionStatus(str, enum.Enum):
    """Commercial exception status."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PRICE_REVISION_REQUESTED = "price_revision_requested"


class CurrencyCode(str, enum.Enum):
    """Supported currency codes."""
    INR = "INR"
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    AED = "AED"
    SGD = "SGD"
    AUD = "AUD"
    CAD = "CAD"
    JPY = "JPY"
    CHF = "CHF"


class FXRateSource(str, enum.Enum):
    """Exchange rate source."""
    MANUAL = "manual"
    CONFIGURED_PROVIDER = "configured_provider"
    EXCHANGERATE_API = "exchangerate_api"
    FIXER = "fixer"
    OPENEXCHANGERATES = "openexchangerates"
    CENTRAL_BANK = "central_bank"


class TaxTreatment(str, enum.Enum):
    """Tax treatment types."""
    GST_INTRASATE = "gst_intrastate"
    GST_INTERSTATE = "gst_interstate"
    GST_EXPORT = "gst_export"
    GST_SEZ = "gst_sez"
    VAT_DOMESTIC = "vat_domestic"
    VAT_INTRA_EU = "vat_intra_eu"
    VAT_EXPORT = "vat_export"
    SALES_TAX_US = "sales_tax_us"
    NO_TAX = "no_tax"


class Incoterm(str, enum.Enum):
    """Incoterms 2020."""
    EXW = "EXW"
    FCA = "FCA"
    FOB = "FOB"
    CIF = "CIF"
    CPT = "CPT"
    CIP = "CIP"
    DAP = "DAP"
    DDP = "DDP"


class PaymentMethod(str, enum.Enum):
    """Payment methods."""
    UPI = "upi"
    NEFT = "neft"
    RTGS = "rtgs"
    BANK_TRANSFER = "bank_transfer"
    CARD = "card"
    LETTER_OF_CREDIT = "letter_of_credit"
    ACH = "ach"
    WIRE = "wire"
    SEPA = "sepa"
    CHECK = "check"


class AuditEventType(str, enum.Enum):
    """Audit event types."""
    RFQ_CREATED = "rfq_created"
    RFQ_UPLOADED = "rfq_uploaded"
    SPECS_EXTRACTED = "specs_extracted"
    SPECS_NORMALIZED = "specs_normalized"
    CLARIFICATION_REQUESTED = "clarification_requested"
    CLARIFICATION_RESPONDED = "clarification_responded"
    TECHNICAL_OVERRIDE = "technical_override"
    PRODUCTS_MATCHED = "products_matched"
    PRICING_CALCULATED = "pricing_calculated"
    MARGIN_CHECKED = "margin_checked"
    COMMERCIAL_EXCEPTION_CREATED = "commercial_exception_created"
    COMMERCIAL_EXCEPTION_APPROVED = "commercial_exception_approved"
    TECHNICAL_APPROVAL = "technical_approval"
    COMMERCIAL_APPROVAL = "commercial_approval"
    FINANCE_APPROVAL = "finance_approval"
    QUOTE_GENERATED = "quote_generated"
    QUOTE_RELEASED = "quote_released"
    QUOTE_REVISED = "quote_revised"
    CURRENCY_CHANGED = "currency_changed"
    FX_RATE_LOCKED = "fx_rate_locked"
    FX_RATE_OVERRIDDEN = "fx_rate_overridden"
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    PASSWORD_CHANGED = "password_changed"


class NotificationType(str, enum.Enum):
    """Notification types."""
    NEW_RFQ = "new_rfq"
    CLARIFICATION_REQUIRED = "clarification_required"
    APPROVAL_REQUIRED = "approval_required"
    QUOTE_APPROVED = "quote_approved"
    QUOTE_REJECTED = "quote_rejected"
    MARGIN_EXCEPTION = "margin_exception"
    PRICE_REVISION_REQUESTED = "price_revision_requested"
    QUOTE_RELEASED = "quote_released"
    PASSWORD_RESET = "password_reset"
    EMAIL_VERIFICATION = "email_verification"
    SECURITY_ALERT = "security_alert"