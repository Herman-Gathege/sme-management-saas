#backend/app/models/kra_profile.py
from app.extensions import db
from datetime import datetime

class KRAProfile(db.Model):
    __tablename__ = "kra_profiles"

    id = db.Column(db.Integer, primary_key=True)

    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    kra_pin = db.Column(db.String(20), nullable=False)
    etims_username = db.Column(db.String(100), nullable=False)
    encrypted_password = db.Column(db.Text, nullable=False)

    certificate_path = db.Column(db.String(255), nullable=True)

    environment = db.Column(db.String(20), default="sandbox")  # sandbox or live

    is_verified = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    organization = db.relationship("Organization", back_populates="kra_profile")