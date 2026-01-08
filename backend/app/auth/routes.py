from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..extensions import db
from ..models.organization import Organization
from ..models.user import User

auth_bp = Blueprint("auth", __name__)

# Register Organization + Owner
# Register Organization + Owner with contact
@auth_bp.route("/register", methods=["POST"])
def register_org():
    data = request.get_json()
    name = data.get("name")
    owner_name = data.get("owner_name")
    owner_email = data.get("owner_email")
    owner_phone = data.get("owner_phone")  # New field
    owner_password = data.get("owner_password")

    if not all([name, owner_name, owner_password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Create organization
    org = Organization(name=name)
    db.session.add(org)
    db.session.commit()

    # Create owner user
    owner = User(
        organization_id=org.id,
        full_name=owner_name,
        email=owner_email,
        phone=owner_phone,  # Save phone
        role="owner"
    )
    owner.set_password(owner_password)
    db.session.add(owner)
    db.session.commit()

    return jsonify({
        "message": "Organization and owner registered",
        "org_id": org.id,
        "owner_id": owner.id,
        "owner_phone": owner.phone  # optional in response
    })


# Login (owner or staff)
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, is_active=True).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity={
        "user_id": user.id,
        "organization_id": user.organization_id,
        "role": user.role
    })

    return jsonify({"access_token": access_token, "role": user.role, "organization_id": user.organization_id})