# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, migrate

from .modules.sales.routes import sales_bp
from .modules.stock.routes import stock_bp
from .modules.customers.routes import customers_bp
from .modules.staff.routes import staff_bp
from .modules.reports.routes import reports_bp
from .auth.routes import auth_bp



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from . import models


    # 🔐 JWT ERROR HANDLERS
    @jwt.unauthorized_loader
    def missing_token(reason):
        return {"error": "Missing token"}, 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return {"error": "Invalid token"}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"error": "Token expired"}, 401

    print("APP INSTANCE ID:", id(app))

    CORS(
            app,
            supports_credentials=True,
            resources={
                r"/api/*": {
                    "origins": [
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
                    ]
                },
                r"/auth/*": {
                    "origins": [
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
                    ]
                }
            },
            allow_headers=["Content-Type", "Authorization"],
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        )
    # Register blueprints (ONCE each)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(staff_bp, url_prefix="/api/staff")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")
    app.register_blueprint(stock_bp, url_prefix="/api/stock")
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(customers_bp)


    return app
