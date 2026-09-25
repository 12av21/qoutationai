"""Quote service: creation, versioning, totals, FX locking, approval submission."""
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Optional, Dict, Any
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.quotes import Quote
from app.models.quote_items import QuoteItem, QuoteVersion
from app.models.products import Product, Customer
from app.models.enums import QuoteStatus, CurrencyCode, FXRateSource
from app.services.fx_service import FXService
from app.schemas.quote import QuoteCreate, QuoteUpdate, QuoteItemCreate, SubmitApprovalRequest


class QuoteService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.fx = FXService(session)

    @staticmethod
    def _round(amount: Decimal) -> Decimal:
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    async def _generate_quote_number(self, org_id: UUID) -> str:
        today = datetime.utcnow().strftime("%Y%m%d")
        stmt = select(func.count()).select_from(Quote).where(Quote.organization_id == org_id)
        count = (await self.session.execute(stmt)).scalar() or 0
        seq = count + 1
        return f"QT-{today}-{seq:04d}"

    async def _calculate_item_totals(self, item: QuoteItemCreate, quote_currency: CurrencyCode,
                                     base_currency: CurrencyCode, exchange_rate: Optional[Decimal]) -> Dict[str, Any]:
        discount_amount = self._round(item.unit_price * item.quantity * item.discount_percent / Decimal("100"))
        net_price = self._round(item.unit_price * item.quantity - discount_amount)
        tax_amount = self._round(net_price * item.tax_rate / Decimal("100"))
        line_total = self._round(net_price + tax_amount)

        base_unit_price = None
        base_line_total = None
        margin_amount = None
        margin_percent = None

        if item.cost_price is not None:
            if exchange_rate and quote_currency != base_currency:
                base_unit_price = self._round(item.unit_price / exchange_rate)
                base_line_total = self._round(line_total / exchange_rate)
            else:
                base_unit_price = item.unit_price
                base_line_total = line_total
            cost_total = item.cost_price * item.quantity
            if base_line_total:
                margin_amount = self._round(base_line_total - cost_total)
                if cost_total and margin_amount:
                    margin_percent = self._round(margin_amount / cost_total * Decimal("100"))

        return {
            "discount_amount": discount_amount,
            "tax_amount": tax_amount,
            "line_total": line_total,
            "base_unit_price": base_unit_price,
            "base_line_total": base_line_total,
            "margin_amount": margin_amount,
            "margin_percent": margin_percent,
        }

    async def create_quote(self, payload: QuoteCreate, owner_id: UUID, org_id: UUID) -> Quote:
        cust = await self.session.get(Customer, payload.customer_id)
        if not cust or cust.organization_id != org_id:
            raise ValueError("Customer not found in organization")

        base_currency = CurrencyCode.INR
        quote_currency = payload.quote_currency

        exchange_rate = payload.exchange_rate
        exchange_rate_source = payload.exchange_rate_source or FXRateSource.MANUAL
        if exchange_rate is None and quote_currency != base_currency:
            conv = await self.fx.convert(
                amount=Decimal("1"),
                from_currency=base_currency,
                to_currency=quote_currency,
                organization_id=org_id,
            )
            exchange_rate = conv.rate_used
            exchange_rate_source = conv.rate_source

        exchange_rate_locked_at = datetime.utcnow() if exchange_rate else None

        quote_date = payload.quote_date
        valid_until = quote_date + timedelta(days=payload.validity_days)

        quote = Quote(
            organization_id=org_id,
            rfq_id=payload.rfq_id,
            customer_id=payload.customer_id,
            owner_id=owner_id,
            quote_number=await self._generate_quote_number(org_id),
            version=1,
            status=QuoteStatus.DRAFT,
            base_currency=base_currency,
            quote_currency=quote_currency,
            exchange_rate=exchange_rate,
            exchange_rate_source=exchange_rate_source,
            exchange_rate_locked_at=exchange_rate_locked_at,
            quote_date=quote_date,
            validity_days=payload.validity_days,
            valid_until=valid_until,
            incoterm=payload.incoterm,
            payment_terms=payload.payment_terms,
            payment_method=payload.payment_method,
            tax_treatment=payload.tax_treatment,
            tax_rate=payload.tax_rate,
            notes=payload.notes,
            assumptions=payload.assumptions,
            exceptions=[],
        )
        self.session.add(quote)
        await self.session.flush()

        subtotal = Decimal("0")
        discount_total = Decimal("0")
        tax_total = Decimal("0")
        base_subtotal = Decimal("0")

        for item_in in payload.items:
            calc = await self._calculate_item_totals(
                item_in, quote_currency, base_currency, exchange_rate
            )
            item = QuoteItem(
                quote_id=quote.id,
                product_id=item_in.product_id,
                line_number=item_in.line_number,
                name=item_in.name,
                sku=item_in.sku,
                description=item_in.description,
                quantity=item_in.quantity,
                unit=item_in.unit,
                unit_price=item_in.unit_price,
                discount_percent=item_in.discount_percent,
                discount_amount=calc["discount_amount"],
                tax_rate=item_in.tax_rate,
                tax_amount=calc["tax_amount"],
                line_total=calc["line_total"],
                base_unit_price=calc["base_unit_price"],
                base_line_total=calc["base_line_total"],
                cost_price=item_in.cost_price,
                margin_amount=calc["margin_amount"],
                margin_percent=calc["margin_percent"],
            )
            self.session.add(item)

            subtotal += calc["line_total"]
            discount_total += calc["discount_amount"]
            tax_total += calc["tax_amount"]
            if calc["base_line_total"]:
                base_subtotal += calc["base_line_total"]

        taxable_amount = self._round(subtotal - discount_total)
        grand_total = self._round(subtotal + tax_total)
        base_grand_total = self._round(base_subtotal) if base_subtotal else None

        quote.subtotal = subtotal
        quote.discount_amount = discount_total
        quote.taxable_amount = taxable_amount
        quote.tax_amount = tax_total
        quote.grand_total = grand_total
        quote.base_subtotal = base_subtotal if base_subtotal else None
        quote.base_grand_total = base_grand_total

        await self._create_version(quote, owner_id, "Initial creation", {})
        await self.session.flush()
        return quote