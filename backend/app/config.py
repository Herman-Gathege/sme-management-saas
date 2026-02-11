from datetime import timedelta
import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")

    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set")

    # Neon sometimes gives postgres://, SQLAlchemy prefers postgresql://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = ["cookies"]

    # JWT_COOKIE_SECURE = True      # HTTPS only (Render uses HTTPS) change to True in production
    JWT_COOKIE_SECURE=True # False for local development
    JWT_COOKIE_HTTPONLY = True    # JS cannot read cookies
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = True  # disable CSRF for development, enable in production
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)


