# # backend/app/models/sale.py

from datetime import datetime
from ..extensions import db

class Sale(db.Model):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)

    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=True
    )

    payment_method = db.Column(
        db.String(20),  # cash | mpesa | credit
        nullable=False
    )

    total_amount = db.Column(
        db.Numeric(10, 2),
        nullable=False,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # === relationships for eager loading ===
    user = db.relationship("User", backref="sales")  # staff who made the sale
    customer = db.relationship("Customer", backref="sales")  # optional customer

    items = db.relationship(
        "SaleItem",
        backref="sale",
        lazy="selectin",  # better for bulk loading
        cascade="all, delete-orphan"
    )

    branch_id = db.Column(
        db.Integer,
        db.ForeignKey("branches.id"),
        nullable=False,
        index=True
    )

    device_id = db.Column(
        db.Integer,
        db.ForeignKey("devices.id"),
        nullable=False,
        index=True
    )

    receipt_number = db.Column(db.String(100), nullable=True)

    branch = db.relationship("Branch")
    device = db.relationship("Device")

    kra_status = db.Column(
        db.String(20),
        default="PENDING"
    )

    kra_icn = db.Column(db.String(100), nullable=True)
    kra_qr_code = db.Column(db.Text, nullable=True)
    kra_control_number = db.Column(db.String(100), nullable=True)

    kra_response_payload = db.Column(db.JSON, nullable=True)
    kra_eat_timestamp = db.Column(db.DateTime, nullable=True)