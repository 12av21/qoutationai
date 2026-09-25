"""Pydantic schemas for authentication."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    company_name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    country: str = Field(..., min_length=2, max_length=2)
    password: str = Field(..., min_length=8)
    confirm_password: str
    accept_terms: bool = True

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

    @validator("password")
    def password_complexity(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain a lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain a number")
        if not any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?" for c in v):
            raise ValueError("Password must contain a special character")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8)
    confirm_password: str

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

    @validator("password")
    def password_complexity(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain a lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain a number")
        if not any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?" for c in v):
            raise ValueError("Password must contain a special character")
        return v


class VerifyEmailRequest(BaseModel):
    token: str


class UserRead(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    organization_id: str
    is_active: bool
    email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class OrganizationRead(BaseModel):
    id: str
    name: str
    slug: str
    default_currency: str
    status: str

    class Config:
        from_attributes = True