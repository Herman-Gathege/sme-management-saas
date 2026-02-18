# backend/app/modules/suppliers/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions import db
from app.models.supplier import Supplier
from app.auth.decorators import owner_required
from app.utils.decorators import owner_or_staff_required
from app.modules.suppliers.services import get_creditors_summary

suppliers_bp = Blueprint("suppliers", __name__, url_prefix="/api/suppliers")


def get_org_id_from_jwt():
    claims = get_jwt()
    org_id = claims.get("organization_id")
    if not org_id:
        raise ValueError("Missing organization_id in token")
    return org_id


# ---------------- CREATE SUPPLIER ----------------
@suppliers_bp.route("", methods=["POST"])
@jwt_required()
@owner_required
def create_supplier():
    try:
        data = request.get_json()
        org_id = get_org_id_from_jwt()

        if not data.get("name"):
            return jsonify({"error": "Supplier name is required"}), 400

        supplier = Supplier(
            organization_id=org_id,
            name=data["name"],
            phone=data.get("phone"),
            email=data.get("email"),
            address=data.get("address"),
            notes=data.get("notes"),
        )

        db.session.add(supplier)
        db.session.commit()
        return jsonify(supplier.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ---------------- GET ALL SUPPLIERS ----------------
@suppliers_bp.route("", methods=["GET"])
@jwt_required()
@owner_or_staff_required
def get_suppliers():
    org_id = get_org_id_from_jwt()

    suppliers = Supplier.query.filter_by(
        organization_id=org_id
    ).order_by(Supplier.created_at.desc()).all()


    return jsonify([s.to_dict() for s in suppliers])



# ---------------- UPDATE SUPPLIER ----------------
@suppliers_bp.route("/<int:supplier_id>", methods=["PATCH"])
@jwt_required()
@owner_required
def update_supplier(supplier_id):
    try:
        data = request.get_json()
        org_id = get_org_id_from_jwt()

        supplier = Supplier.query.filter_by(
            id=supplier_id,
            organization_id=org_id,
            is_active=True
        ).first()

        if not supplier:
            return jsonify({"error": "Supplier not found"}), 404

        for field in ["name", "phone", "email", "address", "notes"]:
            if field in data:
                setattr(supplier, field, data[field])

        db.session.commit()
        return jsonify(supplier.to_dict())

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ---------------- DEACTIVATE SUPPLIER ----------------
@suppliers_bp.route("/<int:supplier_id>", methods=["DELETE"])
@jwt_required()
@owner_required
def delete_supplier(supplier_id):
    try:
        org_id = get_org_id_from_jwt()

        supplier = Supplier.query.filter_by(
            id=supplier_id,
            organization_id=org_id,
            is_active=True
        ).first()

        if not supplier:
            return jsonify({"error": "Supplier not found"}), 404

        supplier.is_active = False
        db.session.commit()
        return jsonify({"message": "Supplier deactivated successfully"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ================= CREDITORS =================
# Suppliers we owe money (credit purchases - payments)
@suppliers_bp.route("/creditors", methods=["GET"])
@jwt_required()
@owner_or_staff_required
def get_creditors():
    org_id = get_org_id_from_jwt()
    return jsonify(get_creditors_summary(org_id))
