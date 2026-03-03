from datetime import timedelta
import os
from cryptography.fernet import Fernet



class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")

    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set")

    # Neon sometimes gives postgres://, SQLAlchemy prefers postgresql://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,      # check connection before using
        "pool_recycle": 300,        # recycle every 5 minutes
        "pool_size": 5,
        "max_overflow": 10,
    }

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    KRA_ENCRYPTION_KEY = os.environ.get("KRA_ENCRYPTION_KEY") or Fernet.generate_key()

    ETIMS_SANDBOX_URL = os.environ.get("ETIMS_SANDBOX_URL")

    ETIMS_LIVE_URL = os.environ.get("ETIMS_LIVE_URL")

    ETIMS_MODE = "mock"  # change to "live" or "sandbox" later

    CELERY_BROKER_URL = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/0"
