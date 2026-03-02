#backend/app/modules/kra_compliance/admin_functions/routes.py

from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.kra_profile import KRAProfile
from app.services.encryption_service import EncryptionService
from app.extensions import db


admin_bp = Blueprint("admin-functions", __name__, url_prefix="/api/admin")

@admin_bp.route("/kra-profile", methods=["POST"])
@jwt_required()
def create_or_update_kra_profile():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "owner":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    kra_pin = data.get("kra_pin")
    username = data.get("etims_username")
    password = data.get("password")
    environment = data.get("environment", "sandbox")

    if not kra_pin or not username or not password:
        return jsonify({"error": "All credentials are required"}), 400

    encrypted_password = EncryptionService.encrypt(password)

    profile = KRAProfile.query.filter_by(
        organization_id=user.organization_id
    ).first()

    if profile:
        profile.kra_pin = kra_pin
        profile.etims_username = username
        profile.encrypted_password = encrypted_password
        profile.environment = environment
    else:
        profile = KRAProfile(
            organization_id=user.organization_id,
            kra_pin=kra_pin,
            etims_username=username,
            encrypted_password=encrypted_password,
            environment=environment,
            is_verified=False
        )
        db.session.add(profile)

    db.session.commit()

    return jsonify({
        "message": "KRA profile saved successfully",
        "is_verified": profile.is_verified
    }), 200


