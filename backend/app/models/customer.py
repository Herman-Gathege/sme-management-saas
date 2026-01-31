# backend/app/models/customer.py
from datetime import datetime
from app.extensions import db


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)

    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id"),
        nullable=False
    )

    name = db.Column(db.String(255), nullable=False)
    business_name = db.Column(db.String(255), nullable=True)

    phone = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)

    # debtor | creditor
    role = db.Column(db.String(20), nullable=False)

    notes = db.Column(db.Text, nullable=True)

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    @property
    def full_name(self):
        if self.business_name:
            return f"{self.name} ({self.business_name})"
        return self.name

    def to_dict(self):
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "name": self.name,
            "business_name": self.business_name,
            "full_name": self.full_name,
            "phone": self.phone,
            "email": self.email,
            "role": self.role,
            "notes": self.notes,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
