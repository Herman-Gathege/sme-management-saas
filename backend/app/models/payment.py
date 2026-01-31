#backend/app/models/payment.py
from datetime import datetime
from app.extensions import db

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)

    # Organization owning the payment
    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id"),
        nullable=False
    )

    # Customer making / receiving the payment
    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=False
    )

    # Staff / owner recording the payment
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Amount paid
    amount = db.Column(
        db.Numeric(10, 2),
        nullable=False,
        default=0
    )

    # Method: cash, mpesa, bank, etc.
    payment_method = db.Column(
        db.String(20),
        nullable=False
    )

    # Optional notes
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ----------------------
    # Relationships
    # ----------------------
    customer = db.relationship("Customer", backref="payments", lazy=True)
    # Optional: backref from user
    user = db.relationship("User", backref="payments", lazy=True)

    # ----------------------
    # Dictionary representation for API
    # ----------------------
    def to_dict(self):
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "customer_id": self.customer_id,
            "user_id": self.user_id,
            "amount": float(self.amount),
            "payment_method": self.payment_method,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

