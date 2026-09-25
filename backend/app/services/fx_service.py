"""FX / Exchange Rate service."""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fx_pricing import ExchangeRate
from app.models.enums import CurrencyCode, FXRateSource
from app.schemas.fx import ConvertRequest, ConvertResponse, LockRateRequest, LockRateResponse


class FXService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_latest_rate(
        self,
        base: CurrencyCode,
        quote: CurrencyCode,
        organization_id: Optional[UUID] = None,
        as_of: Optional[datetime] = None,
    ) -> Optional[ExchangeRate]:
        """Return the most recent ExchangeRate matching criteria."""
        stmt = (
            select(ExchangeRate)
            .where(
                ExchangeRate.base_currency == base,
                ExchangeRate.quote_currency == quote,
                ExchangeRate.effective_at <= (as_of or datetime.utcnow()),
                (ExchangeRate.expires_at.is_(None) | (ExchangeRate.expires_at >= (as_of or datetime.utcnow()))),
            )
            .order_by(ExchangeRate.effective_at.desc())
        )
        if organization_id:
            stmt = stmt.where(
                (ExchangeRate.organization_id == organization_id) | (ExchangeRate.organization_id.is_(None))
            )
        else:
            stmt = stmt.where(ExchangeRate.organization_id.is_(None))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def convert(self, req: ConvertRequest) -> ConvertResponse:
        """Convert amount using latest applicable rate."""
        org_uuid = UUID(req.organization_id) if req.organization_id else None
        rate_obj = await self.get_latest_rate(
            base=req.from_currency,
            quote=req.to_currency,
            organization_id=org_uuid,
            as_of=req.as_of,
        )
        if not rate_obj:
            raise ValueError(f"No exchange rate found for {req.from_currency} → {req.to_currency}")

        # Apply markup
        effective_rate = rate_obj.rate * (Decimal("1") + rate_obj.markup_percent / Decimal("100"))
        converted = (req.amount / effective_rate) if rate_obj.base_currency == req.from_currency else (req.amount * effective_rate)
        # The model stores rate as quote per base (e.g., USD per INR). Assuming base_currency = from_currency.
        # If base_currency != from_currency, invert.
        if rate_obj.base_currency != req.from_currency:
            # need inverse rate
            effective_rate = Decimal("1") / effective_rate
            converted = req.amount * effective_rate

        return ConvertResponse(
            converted_amount=converted.quantize(Decimal("0.01")),
            rate_used=effective_rate.quantize(Decimal("0.00000001")),
            rate_source=rate_obj.source,
            rate_timestamp=rate_obj.effective_at,
            base_currency=rate_obj.base_currency,
            quote_currency=rate_obj.quote_currency,
        )

    async def create_rate(self, data) -> ExchangeRate:
        """Create a new ExchangeRate record."""
        rate = ExchangeRate(**data)
        self.session.add(rate)
        await self.session.flush()
        return rate

    async def lock_rate_for_quote(self, req: LockRateRequest) -> LockRateResponse:
        """Persist the rate used for a quote version (handled in quote service)."""
        # Here we just acknowledge; actual persistence is in QuoteService when creating QuoteVersion.
        locked_at = datetime.utcnow()
        return LockRateResponse(
            success=True,
            locked_rate=req.rate,
            locked_at=locked_at,
            message="FX rate locked for quote version",
        )