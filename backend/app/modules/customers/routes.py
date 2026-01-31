#backend/app/modules/customers/routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions import db
from app.models.customer import Customer
from app.auth.decorators import owner_required
from app.utils.decorators import owner_or_staff_required
from .services import get_debtors_summary, get_creditors_summary

customers_bp = Blueprint("customers", __name__, url_prefix="/api/customers")


# -------------------------
# Helpers
# -------------------------
def get_org_id_from_jwt():
    claims = get_jwt()
    org_id = claims.get("organization_id")
    if not org_id:
        raise ValueError("Missing organization_id in token")
    return org_id


def validate_role(role):
    return role in ["debtor", "creditor"]


# -------------------------
# CREATE CUSTOMER
# -------------------------
@customers_bp.route("", methods=["POST"])
@jwt_required()
@owner_required
def create_customer():
    try:
        data = request.get_json()
        org_id = get_org_id_from_jwt()

        if not data.get("name"):
            return jsonify({"error": "Customer name is required"}), 400

        role = data.get("role", "debtor")
        if not validate_role(role):
            return jsonify({"error": "Invalid role"}), 400

        customer = Customer(
            organization_id=org_id,
            name=data["name"],
            business_name=data.get("business_name"),
            phone=data.get("phone"),
            email=data.get("email"),
            role=role,
            notes=data.get("notes"),
        )

        db.session.add(customer)
        db.session.commit()

        return jsonify(customer.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

        
# -------------------------
# GET ALL CUSTOMERS
# -------------------------
@customers_bp.route("", methods=["GET"])
@jwt_required()
@owner_or_staff_required
def get_customers():
    org_id = get_org_id_from_jwt()

    customers = Customer.query.filter_by(
        organization_id=org_id,
        is_active=True
    ).all()

    return jsonify([c.to_dict() for c in customers])


# -------------------------
# GET DEBTORS (WITH BALANCE)
# -------------------------
@customers_bp.route("/debtors", methods=["GET"])
@jwt_required()
@owner_required
def get_debtors():
    org_id = get_org_id_from_jwt()
    return jsonify(get_debtors_summary(org_id))


# -------------------------
# GET CREDITORS (WITH BALANCE)
# -------------------------
@customers_bp.route("/creditors", methods=["GET"])
@jwt_required()
@owner_required
def get_creditors():
    org_id = get_org_id_from_jwt()
    return jsonify(get_creditors_summary(org_id))


# -------------------------
# UPDATE CUSTOMER
# -------------------------
@customers_bp.route("/<int:customer_id>", methods=["PATCH"])
@jwt_required()
@owner_required
def update_customer(customer_id):
    try:
        data = request.get_json()
        org_id = get_org_id_from_jwt()

        customer = Customer.query.filter_by(
            id=customer_id,
            organization_id=org_id,
            is_active=True
        ).first()

        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        if "role" in data and not validate_role(data["role"]):
            return jsonify({"error": "Invalid role"}), 400

        for field in [
            "name",
            "business_name",
            "phone",
            "email",
            "role",
            "notes",
        ]:
            if field in data:
                setattr(customer, field, data[field])

        db.session.commit()
        return jsonify(customer.to_dict())

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# -------------------------
# SOFT DELETE CUSTOMER
# -------------------------
@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
@jwt_required()
@owner_required
def delete_customer(customer_id):
    try:
        org_id = get_org_id_from_jwt()

        customer = Customer.query.filter_by(
            id=customer_id,
            organization_id=org_id,
            is_active=True
        ).first()

        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        customer.is_active = False
        db.session.commit()

        return jsonify({"message": "Customer deactivated successfully"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
