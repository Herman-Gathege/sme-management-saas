from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)

from ..extensions import db
from ..models.organization import Organization
from ..models.user import User

auth_bp = Blueprint("auth", __name__)

# -------------------------
# Register Organization + Owner
# -------------------------
@auth_bp.route("/register", methods=["POST"])
def register_org():
    data = request.get_json()

    required = ["name", "owner_name", "owner_email", "owner_password"]
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    org = Organization(name=data["name"])
    db.session.add(org)
    db.session.commit()

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

    return jsonify({"message": "Organization created"}), 201


# -------------------------
# Login
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(
        email=data.get("email"),
        is_active=True
    ).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    # 🔥 IDENTITY IS USER ID ONLY

    # Login
    access_token = create_access_token(
        identity=str(user.id),   # 👈 MUST be string or int
        additional_claims={
            "organization_id": user.organization_id,
            "role": user.role
        }
    )

    return jsonify({
        "access_token": access_token
    })


# -------------------------
# Authenticated User Info
# -------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())   # 👈 comes from sub
    claims = get_jwt()

    org_id = claims["organization_id"]
    role = claims["role"]

    user = User.query.get(user_id)
    if not user:
        return {"error": "Invalid token"}, 401

    org = Organization.query.get(org_id)

    return {
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": role
        },
        "organization": {
            "id": org.id,
            "name": org.name
        }
    }


