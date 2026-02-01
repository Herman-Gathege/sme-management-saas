# backend/app/models/supplier_payment.py
from datetime import datetime
from app.extensions import db

class SupplierPayment(db.Model):
    __tablename__ = "supplier_payments"

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey("suppliers.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    amount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    payment_method = db.Column(db.String(20), nullable=False)  # cash, mpesa, bank
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    supplier = db.relationship("Supplier", backref="payments", lazy=True)

    def to_dict(self):
      return {
          "id": self.id,
          "organization_id": self.organization_id,
          "supplier_id": self.supplier_id,
          "supplier_name": self.supplier.name if self.supplier else None,
          "user_id": self.user_id,
          "amount": float(self.amount),
          "payment_method": self.payment_method,
          "notes": self.notes,
          "created_at": self.created_at.isoformat(),
          "updated_at": self.updated_at.isoformat(),
      }
