# backend/app/modules/suppliers/purchases/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.extensions import db
from app.models.supplier_purchase import SupplierPurchase
from app.models.supplier_purchase_item import SupplierPurchaseItem
from app.models.stock import Stock
from app.models.stock_history import StockHistory
from app.auth.decorators import owner_required
from app.utils.decorators import owner_or_staff_required
import json

purchases_bp = Blueprint(
    "supplier_purchases",
    __name__,
    url_prefix="/api/supplier-purchases"
)


def get_org_id_from_jwt():
    claims = get_jwt()
    org_id = claims.get("organization_id")
    if not org_id:
        raise ValueError("Missing organization_id in token")
    return org_id


@purchases_bp.route("", methods=["POST"])
@jwt_required()
@owner_required
def create_purchase():
    try:
        data = request.get_json() or {}
        org_id = get_org_id_from_jwt()
        user_id = int(get_jwt_identity())

        supplier_id = data.get("supplier_id")
        payment_method = data.get("payment_method", "credit")
        items = data.get("items", [])

        if not supplier_id:
            return jsonify({"error": "supplier_id is required"}), 400

        if not items:
            return jsonify({"error": "At least one purchase item is required"}), 400

        # Validate each item
        for idx, item in enumerate(items):
            name = item.get("name")
            quantity = item.get("quantity")
            buying_price = item.get("buying_price")

            if not name:
                return jsonify({"error": f"Item {idx + 1}: name is required"}), 400
            if quantity in (None, ""):
                return jsonify({"error": f"Item {name}: quantity is required"}), 400
            if buying_price in (None, ""):
                return jsonify({"error": f"Item {name}: buying_price is required"}), 400

            try:
                item["quantity"] = int(quantity)
            except (ValueError, TypeError):
                return jsonify({"error": f"Item {name}: quantity must be an integer"}), 400

            try:
                item["buying_price"] = float(buying_price)
            except (ValueError, TypeError):
                return jsonify({"error": f"Item {name}: buying_price must be a number"}), 400

        total_amount = sum(i["quantity"] * i["buying_price"] for i in items)

        purchase = SupplierPurchase(
            organization_id=org_id,
            supplier_id=int(supplier_id),
            total_amount=total_amount,
            payment_method=payment_method,
            notes=data.get("notes"),
        )
        db.session.add(purchase)
        db.session.commit()  # get purchase.id

        for i in items:
            qty = i["quantity"]
            price = i["buying_price"]

            purchase_item = SupplierPurchaseItem(
                purchase_id=purchase.id,
                organization_id=org_id,
                name=i["name"],
                sku=i.get("sku"),
                category=i.get("category"),
                quantity=qty,
                buying_price=price,
                min_stock_level=i.get("min_stock_level") or 0,
            )
            db.session.add(purchase_item)

            stock = None
            if i.get("sku"):
                stock = Stock.query.filter_by(organization_id=org_id, sku=i["sku"]).first()
            if not stock:
                stock = Stock.query.filter_by(organization_id=org_id, name=i["name"]).first()

            if stock:
                stock.quantity += qty
                stock.buying_price = price
            else:
                stock = Stock(
                    organization_id=org_id,
                    name=i["name"],
                    sku=i.get("sku"),
                    category=i.get("category"),
                    quantity=qty,
                    buying_price=price,
                    selling_price=None,
                    min_stock_level=i.get("min_stock_level") or 0,
                )
                db.session.add(stock)
                db.session.flush()

            history = StockHistory(
                stock_id=stock.id,
                organization_id=org_id,
                user_id=user_id,
                action="purchase_added",
                details=json.dumps({
                    "purchase_id": purchase.id,
                    "quantity_added": qty,
                    "buying_price": price
                }),
            )
            db.session.add(history)

        db.session.commit()

        return jsonify({
            "purchase": purchase.to_dict(),
            "items": [i.to_dict() for i in purchase.items]
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Failed payload:", json.dumps(request.get_json(), indent=2))  # log payload
        return jsonify({
            "error": "Failed to create supplier purchase",
            "details": str(e)
        }), 400


@purchases_bp.route("", methods=["GET"])
@jwt_required()
@owner_or_staff_required
def get_purchases():
    org_id = get_org_id_from_jwt()
    purchases = SupplierPurchase.query.filter_by(
        organization_id=org_id
    ).order_by(SupplierPurchase.created_at.desc()).all()

    return jsonify([
        {
            "purchase": p.to_dict(),
            "items": [i.to_dict() for i in p.items]
        }
        for p in purchases
    ])
