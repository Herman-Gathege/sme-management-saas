# backend/app/modules/suppliers/purchases/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions import db
from app.models.supplier_purchase import SupplierPurchase
from app.models.supplier_purchase_item import SupplierPurchaseItem
from app.auth.decorators import owner_required
from app.utils.decorators import owner_or_staff_required

purchases_bp = Blueprint("supplier_purchases", __name__, url_prefix="/api/supplier-purchases")

def get_org_id_from_jwt():
    claims = get_jwt()
    return claims.get("organization_id")


# ---------------- CREATE PURCHASE WITH ITEMS ----------------
@purchases_bp.route("", methods=["POST"])
@jwt_required()
@owner_required
def create_purchase():
    try:
        data = request.get_json()
        org_id = get_org_id_from_jwt()
        supplier_id = data.get("supplier_id")
        payment_method = data.get("payment_method", "credit")
        items = data.get("items", [])

        if not supplier_id or not items:
            return jsonify({"error": "Supplier and items are required"}), 400

        total_amount = sum(float(i["quantity"]) * float(i["unit_price"]) for i in items)

        purchase = SupplierPurchase(
            organization_id=org_id,
            supplier_id=supplier_id,
            total_amount=total_amount,
            payment_method=payment_method,
            notes=data.get("notes")
        )
        db.session.add(purchase)
        db.session.commit()

        # Add items
        for i in items:
            item = SupplierPurchaseItem(
                purchase_id=purchase.id,
                organization_id=org_id,
                name=i["name"],
                sku=i.get("sku"),
                category=i.get("category"),
                quantity=i["quantity"],
                unit_price=i["unit_price"],
                min_stock_level=i.get("min_stock_level"),
            )
            db.session.add(item)
        db.session.commit()

        return jsonify({"purchase": purchase.to_dict(), "items": [i.to_dict() for i in purchase.items]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ---------------- GET PURCHASES ----------------
@purchases_bp.route("", methods=["GET"])
@jwt_required()
@owner_or_staff_required
def get_purchases():
    org_id = get_org_id_from_jwt()
    purchases = SupplierPurchase.query.filter_by(organization_id=org_id).all()
    result = []
    for p in purchases:
        result.append({
            "purchase": p.to_dict(),
            "items": [i.to_dict() for i in p.items]
        })
    return jsonify(result)
