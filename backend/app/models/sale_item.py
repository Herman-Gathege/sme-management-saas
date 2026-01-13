# backend/app/models/sale_item.py

from ..extensions import db

class SaleItem(db.Model):
    __tablename__ = "sale_items"

    id = db.Column(db.Integer, primary_key=True)

    sale_id = db.Column(
        db.Integer,
        db.ForeignKey("sales.id"),
        nullable=False
    )

    stock_id = db.Column(
        db.Integer,
        db.ForeignKey("stocks.id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    unit_price = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    line_total = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )
