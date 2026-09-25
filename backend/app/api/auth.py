"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    UserRead,
)
from app.services.auth_service import AuthService
from app.services.auth_service_ext import AuthServiceExtended

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(db)


def get_auth_ext(db: AsyncSession = Depends(get_db)) -> AuthServiceExtended:
    return AuthServiceExtended(db)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    auth: AuthService = Depends(get_auth_service),
):
    try:
        user, _ = await auth.register(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    request: Request,
    auth: AuthService = Depends(get_auth_service),
):
    try:
        device = request.headers.get("user-agent", "")
        return await auth.login(payload, device_info=device)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    payload: RefreshRequest,
    auth: AuthService = Depends(get_auth_service),
):
    try:
        return await auth.refresh(payload.refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout(
    request: Request,
    auth: AuthService = Depends(get_auth_service),
):
    # In a real implementation, extract access token from cookie/header and revoke session
    return {"detail": "Logged out"}


@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest,
    auth_ext: AuthServiceExtended = Depends(get_auth_ext),
):
    await auth_ext.create_password_reset_token(payload.email)
    # Always return success to avoid email enumeration
    return {"detail": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    payload: ResetPasswordRequest,
    auth_ext: AuthServiceExtended = Depends(get_auth_ext),
):
    ok = await auth_ext.reset_password(payload.token, payload.password)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"detail": "Password reset successful"}


@router.post("/verify-email")
async def verify_email(
    payload: VerifyEmailRequest,
    auth_ext: AuthServiceExtended = Depends(get_auth_ext),
):
    ok = await auth_ext.verify_email(payload.token)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"detail": "Email verified successfully"}


@router.get("/me", response_model=UserRead)
async def me(
    auth_ext: AuthServiceExtended = Depends(get_auth_ext),
    # token extracted via dependency in future
):
    # Placeholder: will be replaced with dependency that extracts token
    raise HTTPException(status_code=501, detail="Not implemented")