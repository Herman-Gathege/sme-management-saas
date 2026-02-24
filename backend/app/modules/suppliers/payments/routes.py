#backend/app/modules/suppliers/payments/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from app.extensions import db
from app.models.supplier_payment import SupplierPayment
from app.utils.decorators import owner_or_staff_required
from app.utils.time import to_local_iso


payments_bp = Blueprint(
    "supplier_payments",
    __name__,
    url_prefix="/api/suppliers/payments")



def get_org_and_user_from_jwt():
    claims = get_jwt()
    return claims.get("organization_id"), claims.get("sub")


# def to_dict(self):
#     return {
#         "id": self.id,
#         "supplier_id": self.supplier_id,
#         "user_id": self.user_id,
#         "amount": float(self.amount),
#         "payment_method": self.payment_method,
#         "notes": self.notes,
#         "created_at": to_local_iso(self.created_at)
#     }


# ---------------- CREATE PAYMENT ----------------
@payments_bp.route("", methods=["POST"])
@owner_or_staff_required
def create_payment():
    try:
        data = request.get_json()
        print("Incoming payload:", data)

        supplier_id = data.get("supplier_id")
        amount = data.get("amount")
        payment_method = data.get("payment_method")
        notes = data.get("notes", "")

        if not supplier_id or not amount or not payment_method:
            return jsonify({"error": "Missing required fields"}), 400

        organization_id, user_id = get_org_and_user_from_jwt()

        payment = SupplierPayment(
            organization_id=organization_id,
            supplier_id=int(supplier_id),
            user_id=int(user_id),
            amount=float(amount),
            payment_method=payment_method,
            notes=notes
        )

        db.session.add(payment)
        db.session.commit()

        # return jsonify(payment.to_dict()), 201
        response = payment.to_dict()
        response["created_at"] = to_local_iso(payment.created_at)

        return jsonify(response), 201

    except Exception as e:
        db.session.rollback()
        print("Payment error:", str(e))
        return jsonify({"error": "Failed to create payment"}), 400


# ---------------- GET PAYMENTS ----------------
@payments_bp.route("", methods=["GET"])
@owner_or_staff_required
def get_payments():
    organization_id, _ = get_org_and_user_from_jwt()

    payments = SupplierPayment.query.filter_by(
        organization_id=organization_id
    ).order_by(SupplierPayment.created_at.desc()).all()

    


    # return jsonify([p.to_dict() for p in payments])
    result = []

    for p in payments:
        data = p.to_dict()
        data["created_at"] = to_local_iso(p.created_at)
        result.append(data)

    return jsonify(result)
