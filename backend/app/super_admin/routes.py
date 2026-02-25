from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.organization import Organization
from app.utils.decorators import super_admin_required

super_admin_bp = Blueprint(
    "super_admin",
    __name__,
    url_prefix="/api/super-admin"
)

@super_admin_bp.route("/organizations", methods=["GET"])
@super_admin_required
def list_organizations():
    orgs = Organization.query.all()

    return jsonify([
        {
            "id": org.id,
            "name": org.name,
            "subscription_status": org.subscription_status,
            "trial_ends_at": org.trial_ends_at,
            "subscription_ends_at": org.subscription_ends_at,
            "is_active": org.is_active
        }
        for org in orgs
    ])

from datetime import datetime, timedelta

@super_admin_bp.route("/organizations/<int:org_id>/upgrade", methods=["POST"])
@super_admin_required
def upgrade_org(org_id):
    org = Organization.query.get_or_404(org_id)

    org.subscription_status = "active"
    org.subscription_ends_at = datetime.utcnow() + timedelta(days=30)
    org.is_active = True

    db.session.commit()

    return jsonify({"message": "Organization upgraded to active"})



@super_admin_bp.route("/organizations/<int:org_id>/deactivate", methods=["POST"])
@super_admin_required
def deactivate_org(org_id):
    org = Organization.query.get_or_404(org_id)

    org.is_active = False
    org.subscription_status = "expired"

    db.session.commit()

    return jsonify({"message": "Organization deactivated"})

    

@super_admin_bp.route("/organizations/<int:org_id>/activate", methods=["POST"])
@super_admin_required
def activate_org(org_id):
    org = Organization.query.get_or_404(org_id)

    org.is_active = True

    db.session.commit()

    return jsonify({"message": "Organization activated"})