#backend/app/models/organization.py
from datetime import datetime
from ..extensions import db

class Organization(db.Model):
    __tablename__ = "organizations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    business_type = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)

    # Subscription
    subscription_status = db.Column(db.String(20), default="trial")
    # trial | active | suspended | expired

    plan = db.Column(db.String(20), default="starter")

    trial_ends_at = db.Column(db.DateTime, nullable=True)
    subscription_ends_at = db.Column(db.DateTime, nullable=True)

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship("User", backref="organization", lazy=True)

    # inside Organisation model

    branches = db.relationship(
        "Branch",
        back_populates="organization",
        cascade="all, delete-orphan"
    )

    kra_profile = db.relationship(
        "KRAProfile",
        back_populates="organization",
        uselist=False,
        cascade="all, delete-orphan"
    )