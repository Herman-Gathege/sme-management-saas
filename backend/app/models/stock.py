from datetime import datetime
from extensions import db


class Stock(db.Model):
    __tablename__ = "stock"

    id = db.Column(db.Integer, primary_key=True)

    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id"),
        nullable=False
    )

    name = db.Column(db.String(120), nullable=False)
    sku = db.Column(db.String(100), unique=True, nullable=True)
    category = db.Column(db.String(100), nullable=True)

    quantity = db.Column(db.Integer, nullable=False, default=0)
    unit_price = db.Column(db.Float, nullable=False)

    min_stock_level = db.Column(db.Integer, nullable=False, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "name": self.name,
            "sku": self.sku,
            "category": self.category,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "min_stock_level": self.min_stock_level,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
