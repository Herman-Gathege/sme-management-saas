# backend/app/models/supplier_purchase_item.py
from datetime import datetime
from app.extensions import db

class SupplierPurchaseItem(db.Model):
    __tablename__ = "supplier_purchase_items"

    id = db.Column(db.Integer, primary_key=True)
    purchase_id = db.Column(db.Integer, db.ForeignKey("supplier_purchases.id"), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)

    name = db.Column(db.String(255), nullable=False)
    sku = db.Column(db.String(100), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    min_stock_level = db.Column(db.Integer, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    purchase = db.relationship("SupplierPurchase", backref="items", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "purchase_id": self.purchase_id,
            "organization_id": self.organization_id,
            "name": self.name,
            "sku": self.sku,
            "category": self.category,
            "quantity": self.quantity,
            "unit_price": float(self.unit_price),
            "min_stock_level": self.min_stock_level,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
