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

    CORS(app, resources={r"/*": {"origins": "*"}})


    # Register blueprints
    app.register_blueprint(sales_bp, url_prefix="/sales")
    app.register_blueprint(stock_bp, url_prefix="/stock")
    app.register_blueprint(customers_bp, url_prefix="/customers")
    app.register_blueprint(staff_bp, url_prefix="/staff")
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
