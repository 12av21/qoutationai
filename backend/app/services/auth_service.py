"""Authentication service: password hashing, JWT, tokens."""
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
import secrets
import bcrypt
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.core import User, Organization, UserSession, PasswordResetToken, EmailVerificationToken
from app.models.enums import UserRole, UserStatus, OrganizationStatus
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session

    # ---------- Password ----------
    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        return bcrypt.checkpw(password.encode(), hashed.encode())

    # ---------- JWT ----------
    def create_access_token(self, user: User, expires_delta: Optional[timedelta] = None) -> str:
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "org_id": str(user.organization_id),
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access",
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def create_refresh_token(self, user: User, expires_delta: Optional[timedelta] = None) -> str:
        expire = datetime.utcnow() + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
        payload = {
            "sub": str(user.id),
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh",
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def decode_token(self, token: str) -> dict:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except jwt.PyJWTError as e:
            raise ValueError("Invalid token") from e

    # ---------- Token storage ----------
    async def store_session(self, user: User, access_token: str, refresh_token: str, device_info: str = "") -> UserSession:
        session = UserSession(
            user_id=user.id,
            token_hash=self.hash_password(access_token),
            refresh_token_hash=self.hash_password(refresh_token),
            device_info=device_info,
            expires_at=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        self.session.add(session)
        await self.session.flush()
        return session

    async def revoke_session(self, session_id: UUID) -> None:
        stmt = select(UserSession).where(UserSession.id == session_id)
        result = await self.session.execute(stmt)
        sess = result.scalar_one_or_none()
        if sess:
            sess.revoked = True
            sess.revoked_at = datetime.utcnow()

    async def revoke_all_sessions(self, user_id: UUID) -> None:
        stmt = select(UserSession).where(UserSession.user_id == user_id, UserSession.revoked == False)
        result = await self.session.execute(stmt)
        for sess in result.scalars().all():
            sess.revoked = True
            sess.revoked_at = datetime.utcnow()

    # ---------- Registration ----------
    async def register(self, data: RegisterRequest) -> tuple[User, Organization]:
        org = Organization(
            name=data.company_name,
            slug=data.company_name.lower().replace(" ", "-") + "-" + secrets.token_hex(4),
            default_currency=settings.DEFAULT_CURRENCY,
            status=OrganizationStatus.ACTIVE,
        )
        self.session.add(org)
        await self.session.flush()

        user = User(
            organization_id=org.id,
            email=data.email,
            hashed_password=self.hash_password(data.password),
            full_name=data.full_name,
            phone=data.phone,
            country=data.country,
            role=UserRole.ORG_ADMIN,
            status=UserStatus.PENDING_VERIFICATION,
            email_verified=False,
        )
        self.session.add(user)
        await self.session.flush()

        await self.create_email_verification_token(user.id)
        return user, org

    # ---------- Login ----------
    async def authenticate(self, email: str, password: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user or not self.verify_password(password, user.hashed_password):
            return None
        if user.status != UserStatus.ACTIVE:
            return None
        return user

    async def login(self, data: LoginRequest, device_info: str = "") -> TokenResponse:
        user = await self.authenticate(data.email, data.password)
        if not user:
            raise ValueError("Invalid credentials")
        access = self.create_access_token(user)
        refresh = self.create_refresh_token(user)
        await self.store_session(user, access, refresh, device_info)
        return TokenResponse(
            access_token=access,
            refresh_token=refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )