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
    subscription_status = db.Column(db.String(20), default="trial")  # trial, active, suspended
    plan = db.Column(db.String(20), default="starter")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship("User", backref="organization", lazy=True)
