from datetime import timedelta
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///sme_management.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # Token expires after 15 minutes
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)


# from datetime import timedelta
# import os


# class BaseConfig:
#     """
#     Base configuration.
#     Shared across all environments.
#     """

#     # --------------------
#     # Core
#     # --------------------
#     SECRET_KEY = os.environ.get("SECRET_KEY")
#     if not SECRET_KEY:
#         raise RuntimeError("SECRET_KEY environment variable is not set")

#     # --------------------
#     # Database
#     # --------------------
#     SQLALCHEMY_DATABASE_URI = os.environ.get(
#         "DATABASE_URL",
#         "sqlite:///sme_management.db"
#     )
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     SQLALCHEMY_ENGINE_OPTIONS = {
#         "pool_pre_ping": True,  # avoid stale DB connections
#     }

#     # --------------------
#     # JWT / Auth
#     # --------------------
#     JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
#     if not JWT_SECRET_KEY:
#         raise RuntimeError("JWT_SECRET_KEY environment variable is not set")

#     JWT_TOKEN_LOCATION = ["headers"]
#     JWT_HEADER_NAME = "Authorization"
#     JWT_HEADER_TYPE = "Bearer"

#     JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
#     JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

#     # --------------------
#     # Security
#     # --------------------
#     SESSION_COOKIE_HTTPONLY = True
#     SESSION_COOKIE_SAMESITE = "Lax"
#     SESSION_COOKIE_SECURE = os.environ.get("FLASK_ENV") == "production"

#     # --------------------
#     # JSON / API
#     # --------------------
#     JSON_SORT_KEYS = False
#     JSONIFY_PRETTYPRINT_REGULAR = False


# class DevelopmentConfig(BaseConfig):
#     """
#     Development environment configuration.
#     """
#     DEBUG = True
#     ENV = "development"


# class TestingConfig(BaseConfig):
#     """
#     Testing environment configuration.
#     """
#     TESTING = True
#     SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
#     JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)


# class ProductionConfig(BaseConfig):
#     """
#     Production environment configuration.
#     """
#     DEBUG = False
#     ENV = "production"

#     # Force secure cookies in production
#     SESSION_COOKIE_SECURE = True


# # Config selector
# config_by_name = {
#     "development": DevelopmentConfig,
#     "testing": TestingConfig,
#     "production": ProductionConfig,
# }
