from datetime import datetime
from app.extensions import db


class StockHistory(db.Model):
    __tablename__ = "stock_history"

    id = db.Column(db.Integer, primary_key=True)

    stock_id = db.Column(
        db.Integer,
        db.ForeignKey("stocks.id"),
        nullable=False
    )

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

    action = db.Column(db.String(50), nullable=False)  # created | updated | deleted
    details = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "stock_id": self.stock_id,
            "organization_id": self.organization_id,
            "user_id": self.user_id,
            "action": self.action,
            "details": self.details,
            "created_at": self.created_at.isoformat(),
        }
