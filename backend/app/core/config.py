"""Application configuration settings."""
from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "QuotePilot AI"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/quotepilot",
        description="PostgreSQL async connection URL"
    )
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = Field(
        default="your-super-secret-key-change-in-production-min-32-chars",
        description="Secret key for JWT signing"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8
    BCRYPT_ROUNDS: int = 12

    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5500"],
        description="Allowed CORS origins"
    )

    # Email (for verification, password reset)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    EMAIL_FROM: str = "noreply@quotepilot.ai"
    EMAIL_FROM_NAME: str = "QuotePilot AI"

    # Frontend URL (for email links)
    FRONTEND_URL: str = "http://localhost:5500"

    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".xlsx", ".csv", ".txt", ".eml"]

    # FX Rate Provider
    FX_PROVIDER: str = "simulated"  # simulated, exchangerate-api, fixer, openexchangerates
    FX_API_KEY: Optional[str] = None
    FX_BASE_CURRENCY: str = "USD"
    FX_CACHE_TTL_SECONDS: int = 3600  # 1 hour

    # Default currency for new orgs
    DEFAULT_CURRENCY: str = "INR"

    # Demo Mode
    DEMO_MODE: bool = True
    DEMO_ORG_NAME: str = "QuotePilot Demo"
    DEMO_ORG_SLUG: str = "demo"

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    # Session
    SESSION_COOKIE_NAME: str = "qp_session"
    SESSION_COOKIE_SECURE: bool = False  # True in production with HTTPS
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()