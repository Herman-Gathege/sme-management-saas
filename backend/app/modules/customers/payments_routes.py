#backend/app/modules/customers/payments_routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.payment import Payment
from app.models.customer import Customer
from app.models.user import User

payments_bp = Blueprint("payments", __name__, url_prefix="/api/payments")


# -------------------------
# Helpers
# -------------------------
def get_org_id_from_jwt():
    claims = get_jwt()
    org_id = claims.get("organization_id")
    if not org_id:
        raise ValueError("Missing organization_id in token")
    return org_id


# -------------------------
# CREATE PAYMENT
# -------------------------
@payments_bp.route("", methods=["POST"])
@jwt_required()
def create_payment():
    """
    Record a payment for a customer
    """
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        org_id = get_org_id_from_jwt()

        # Validate customer
        customer_id = data.get("customer_id")
        if not customer_id:
            return jsonify({"error": "customer_id is required"}), 400

        customer = Customer.query.filter_by(
            id=customer_id,
            organization_id=org_id,
            is_active=True
        ).first()
        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        # Validate amount
        amount = data.get("amount")
        if not amount or float(amount) <= 0:
            return jsonify({"error": "Amount must be positive"}), 400

        # Validate method
        payment_method = data.get("payment_method", "").lower()
        if payment_method not in ["cash", "mpesa", "bank"]:
            return jsonify({"error": "Invalid payment method"}), 400

        notes = data.get("notes")

        payment = Payment(
            organization_id=org_id,
            customer_id=customer.id,
            user_id=user_id,
            amount=amount,
            payment_method=payment_method,
            notes=notes
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({
            "message": "Payment recorded successfully",
            "payment": payment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# -------------------------
# GET PAYMENTS BY CUSTOMER
# -------------------------
@payments_bp.route("/customer/<int:customer_id>", methods=["GET"])
@jwt_required()
def get_payments_for_customer(customer_id):
    org_id = get_org_id_from_jwt()

    payments = Payment.query.filter_by(
        customer_id=customer_id,
        organization_id=org_id
    ).order_by(Payment.created_at.desc()).all()

    return jsonify([p.to_dict() for p in payments]), 200


# -------------------------
# GET ALL PAYMENTS FOR ORG (ADMIN/OWNER)
# -------------------------
@payments_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_payments():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "owner":
        return jsonify({"error": "Owner access required"}), 403

    org_id = get_org_id_from_jwt()

    payments = Payment.query.filter_by(
        organization_id=org_id
    ).order_by(Payment.created_at.desc()).all()

    return jsonify([p.to_dict() for p in payments]), 200
