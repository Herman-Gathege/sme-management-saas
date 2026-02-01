# backend/app/models/supplier_purchase.py
from datetime import datetime
from app.extensions import db

class SupplierPurchase(db.Model):
    __tablename__ = "supplier_purchases"

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey("suppliers.id"), nullable=False)

    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    payment_method = db.Column(db.String(20), nullable=False)  # cash, mpesa, bank, credit
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    supplier = db.relationship("Supplier", backref="purchases", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "supplier_id": self.supplier_id,
            "total_amount": float(self.total_amount),
            "payment_method": self.payment_method,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
