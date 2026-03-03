# /backend/app/auth/routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    create_refresh_token
)

from ..extensions import db
from ..models.organization import Organization
from ..models.user import User
from datetime import datetime, timedelta


auth_bp = Blueprint("auth", __name__)

# -------------------------
# Register Organization + Owner
# -------------------------

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(
        email=data.get("email"),
        is_active=True
    ).first()

    # 1️⃣ Validate credentials FIRST
    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Invalid Email or Password Try Again"}), 401

    # 2️⃣ If user belongs to organization → validate org
    if user.organization_id:

        org = user.organization

        if not org:
            return jsonify({"error": "Organization not found"}), 403

        # Hard stop if org disabled
        if not org.is_active:
            return jsonify({"error": "Organization is inactive"}), 403

        # Trial expired
        if org.subscription_status == "trial" and org.trial_ends_at:
            if datetime.utcnow() > org.trial_ends_at:
                return jsonify({"error": "Trial expired. Contact admin."}), 403

        # Paid expired
        if org.subscription_status == "active" and org.subscription_ends_at:
            if datetime.utcnow() > org.subscription_ends_at:
                return jsonify({"error": "Subscription expired"}), 403

        # Suspended
        if org.subscription_status == "suspended":
            return jsonify({"error": "Organization suspended"}), 403

    # 3️⃣ Issue tokens
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "organization_id": user.organization_id,
            "role": user.role
        }
    )

    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token
    })



@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))
    if not user or not user.is_active:
        return jsonify({"error": "User not found"}), 401

    access_token = create_access_token(
        identity=str(user.id),
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
    user_id = int(get_jwt_identity())
    claims = get_jwt()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    response = {
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "branch_id": user.branch_id
        }
    }

    # Only attach organization if exists
    if user.organization_id:
        org = user.organization
        response["organization"] = {
            "id": org.id,
            "name": org.name,
            "subscription_status": org.subscription_status,
            "is_active": org.is_active
        }
    else:
        response["organization"] = None

    return jsonify(response)


