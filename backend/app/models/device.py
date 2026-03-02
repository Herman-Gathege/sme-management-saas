# backend/models/device.py

from datetime import datetime
from app.extensions import db


class Device(db.Model):
    __tablename__ = "devices"

    id = db.Column(db.Integer, primary_key=True)

    branch_id = db.Column(
        db.Integer,
        db.ForeignKey("branches.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    device_serial = db.Column(db.String(120), nullable=False)
    device_number = db.Column(db.String(50), nullable=True)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    branch = db.relationship(
        "Branch",
        back_populates="devices"
    )

    def __repr__(self):
        return f"<Device {self.device_serial}>"