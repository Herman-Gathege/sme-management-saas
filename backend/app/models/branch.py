# backend/models/branch.py

from datetime import datetime
from app.extensions import db


class Branch(db.Model):
    __tablename__ = "branches"

    id = db.Column(db.Integer, primary_key=True)

    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    name = db.Column(db.String(120), nullable=False)
    kra_branch_code = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(255), nullable=True)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    organization = db.relationship(
        "Organization",
        back_populates="branches"
    )

    devices = db.relationship(
        "Device",
        back_populates="branch",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Branch {self.name}>"