# backend/app/modules/staff/routes.py
from flask import Blueprint, request, jsonify
from ...extensions import db
from ...models.user import User
from ...utils.decorators import owner_required, staff_required
from werkzeug.security import generate_password_hash
from flask_jwt_extended import get_jwt
import secrets

staff_bp = Blueprint("staff", __name__, url_prefix="/api/staff")


# ----------------------
# Owner: Create Staff
# ----------------------
@staff_bp.route("", methods=["POST"])
@owner_required
def create_staff():
    data = request.get_json()
    required = ["full_name", "email", "phone"]
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing fields"}), 400

    claims = get_jwt()
    org_id = claims["organization_id"]

    # Check if email exists
    existing = User.query.filter_by(email=data["email"]).first()
    if existing:
        if not existing.is_active:
            return jsonify({"error": "Staff with this email exists but is inactive. Reactivate instead."}), 400
        return jsonify({"error": "Staff with this email already exists"}), 400

    # Generate temporary password
    temp_password = secrets.token_urlsafe(8)
    hashed_password = generate_password_hash(temp_password)

    staff = User(
        full_name=data["full_name"],
        email=data["email"],
        phone=data["phone"],
        role="staff",
        is_active=True,
        organization_id=org_id,
        password_hash=hashed_password
    )

    try:
        db.session.add(staff)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "staff": {
            "id": staff.id,
            "full_name": staff.full_name,
            "email": staff.email,
            "phone": staff.phone,
            "role": staff.role,
            "is_active": staff.is_active
        },
        "temporary_password": temp_password
    }), 201


# ----------------------
# Owner: List Staff in Org
# ----------------------
@staff_bp.route("", methods=["GET"])
@owner_required
def list_staff():
    claims = get_jwt()
    org_id = claims["organization_id"]

    staff_members = User.query.filter_by(organization_id=org_id, role="staff").all()
    result = [
        {
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "phone": s.phone,
            "is_active": s.is_active
        } for s in staff_members
    ]
    return jsonify({"staff": result})


# ----------------------
# Owner: Update Staff
# ----------------------
@staff_bp.route("/<int:id>", methods=["PATCH"])
@owner_required
def update_staff(id):
    claims = get_jwt()
    org_id = claims["organization_id"]

    staff = User.query.filter_by(id=id, organization_id=org_id, role="staff").first()
    if not staff:
        return jsonify({"error": "Staff not found"}), 404

    data = request.get_json()
    staff.full_name = data.get("full_name", staff.full_name)
    staff.email = data.get("email", staff.email)
    staff.phone = data.get("phone", staff.phone)
    if "is_active" in data:
        staff.is_active = data["is_active"]

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "staff": {
            "id": staff.id,
            "full_name": staff.full_name,
            "email": staff.email,
            "phone": staff.phone,
            "is_active": staff.is_active
        }
    })


# ----------------------
# Owner: Deactivate Staff (Soft Delete)
# ----------------------
@staff_bp.route("/<int:id>/deactivate", methods=["PATCH"])
@owner_required
def deactivate_staff(id):
    claims = get_jwt()
    org_id = claims["organization_id"]

    staff = User.query.filter_by(id=id, organization_id=org_id, role="staff").first()
    if not staff:
        return jsonify({"error": "Staff not found"}), 404

    staff.is_active = False

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": f"{staff.full_name} has been deactivated"})


# ----------------------
# Owner: Reactivate Staff
# ----------------------
@staff_bp.route("/<int:id>/reactivate", methods=["PATCH"])
@owner_required
def reactivate_staff(id):
    claims = get_jwt()
    org_id = claims["organization_id"]

    staff = User.query.filter_by(id=id, organization_id=org_id, role="staff").first()
    if not staff:
        return jsonify({"error": "Staff not found"}), 404

    staff.is_active = True

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": f"{staff.full_name} has been reactivated"})


# ----------------------
# Staff: Update Own Password
# ----------------------
@staff_bp.route("/<int:id>/password", methods=["PATCH"])
@staff_required
def update_password(id):
    claims = get_jwt()
    if claims["sub"] != str(id):
        return jsonify({"error": "Unauthorized: can only update your own password"}), 403

    data = request.get_json()
    new_password = data.get("new_password")
    if not new_password:
        return jsonify({"error": "Missing new_password"}), 400

    staff = User.query.get(id)
    staff.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"})
