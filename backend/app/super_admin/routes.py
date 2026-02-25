from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.user import User
from datetime import datetime, timedelta
from app.models.organization import Organization
from app.utils.decorators import super_admin_required
from flask_cors import cross_origin


super_admin_bp = Blueprint(
    "super_admin",
    __name__,
    url_prefix="/api/super-admin"
)

@super_admin_bp.route("/organizations", methods=["POST"])
@super_admin_required
def create_organization():
    """
    Super Admin can create a new organization + owner.
    """
    data = request.get_json()
    required = ["name", "owner_name", "owner_email", "owner_password"]

    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    # Create org
    org = Organization(
        name=data["name"],
        subscription_status="trial",
        trial_ends_at=datetime.utcnow() + timedelta(days=14),
        is_active=True
    )
    db.session.add(org)
    db.session.commit()

    # Create owner user
    owner = User(
        organization_id=org.id,
        full_name=data["owner_name"],
        email=data["owner_email"],
        phone=data.get("owner_phone"),
        role="owner",
        is_active=True
    )
    owner.set_password(data["owner_password"])
    db.session.add(owner)
    db.session.commit()

    return jsonify({
        "message": "Organization created",
        "organization_id": org.id,
        "owner_id": owner.id
    }), 201

@super_admin_bp.route("/organizations", methods=["GET"])
@super_admin_required
def list_organizations():
    # Order by creation date descending (latest first)
    orgs = Organization.query.order_by(Organization.created_at.desc()).all()
    now = datetime.utcnow()

    return jsonify([
        {
            "id": org.id,
            "name": org.name,
            "subscription_status": org.subscription_status,
            "plan": org.plan,  # <--- add this
            "trial_ends_at": org.trial_ends_at,
            "subscription_ends_at": org.subscription_ends_at,
            "is_active": org.is_active,
            "days_remaining": (
                max((org.subscription_ends_at - now).days, 0)
                if org.is_active and org.subscription_ends_at else None
            )
        }
        for org in orgs
    ])


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
    now = datetime.utcnow()

    org.is_active = True

    # If subscription is expired or missing, reset it
    if not org.subscription_ends_at or org.subscription_ends_at < now:
        org.subscription_status = "active"
        org.subscription_ends_at = now + timedelta(days=30)
    else:
        # If still valid, just mark as active
        org.subscription_status = "active"

    db.session.commit()

    return jsonify({"message": "Organization activated successfully"})



@super_admin_bp.route("/organizations/<int:org_id>", methods=["DELETE"])
@super_admin_required
@cross_origin(origin="http://localhost:5173", supports_credentials=True)

def delete_organization(org_id):
    org = Organization.query.get_or_404(org_id)

    # Optional: prevent deleting your own org or critical orgs
    # if org.id == 1:
    #     return jsonify({"error": "Cannot delete the main organization"}), 403

    db.session.delete(org)
    db.session.commit()

    return jsonify({"message": f"Organization '{org.name}' deleted successfully"})