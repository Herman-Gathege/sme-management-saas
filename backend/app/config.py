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
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
