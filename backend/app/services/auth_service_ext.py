"""Auth service additional methods: email verification, password reset, current user."""
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
import secrets
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.core import User, PasswordResetToken, EmailVerificationToken
from app.models.enums import UserStatus


class AuthServiceExtended:
    def __init__(self, session: AsyncSession):
        self.session = session
        # reuse password hashing from base (import if needed)
        import bcrypt
        self._hash_password = staticmethod(lambda p: bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode())
        self._verify_password = staticmethod(lambda p, h: bcrypt.checkpw(p.encode(), h.encode()))

    # ---------- Email verification ----------
    async def create_email_verification_token(self, user_id: UUID) -> EmailVerificationToken:
        token = secrets.token_urlsafe(32)
        token_hash = self._hash_password(token)
        ev = EmailVerificationToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
        self.session.add(ev)
        await self.session.flush()
        return ev

    async def verify_email(self, token: str) -> bool:
        stmt = select(EmailVerificationToken).where(EmailVerificationToken.expires_at > datetime.utcnow())
        result = await self.session.execute(stmt)
        for ev in result.scalars().all():
            if self._verify_password(token, ev.token_hash):
                ev.used = True
                ev.used_at = datetime.utcnow()
                user = await self.session.get(User, ev.user_id)
                if user:
                    user.email_verified = True
                    user.status = UserStatus.ACTIVE
                return True
        return False

    # ---------- Password reset ----------
    async def create_password_reset_token(self, email: str) -> Optional[PasswordResetToken]:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            return None
        token = secrets.token_urlsafe(32)
        token_hash = self._hash_password(token)
        pr = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
        self.session.add(pr)
        await self.session.flush()
        return pr

    async def reset_password(self, token: str, new_password: str) -> bool:
        stmt = select(PasswordResetToken).where(PasswordResetToken.expires_at > datetime.utcnow())
        result = await self.session.execute(stmt)
        for pr in result.scalars().all():
            if self._verify_password(token, pr.token_hash):
                pr.used = True
                pr.used_at = datetime.utcnow()
                user = await self.session.get(User, pr.user_id)
                if user:
                    user.hashed_password = self._hash_password(new_password)
                return True
        return False

    # ---------- Current user ----------
    async def get_current_user(self, token: str) -> User:
        # decode using base class method; we replicate minimal decode
        import jwt
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except jwt.PyJWTError:
            raise ValueError("Invalid token")
        if payload.get("type") != "access":
            raise ValueError("Invalid token type")
        user_id = UUID(payload["sub"])
        user = await self.session.get(User, user_id)
        if not user or user.status != UserStatus.ACTIVE:
            raise ValueError("User not found or inactive")
        return user