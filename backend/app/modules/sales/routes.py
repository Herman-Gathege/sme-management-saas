# backend/app/modules/sales/routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from ...models.sale import Sale
from ...models.sale_item import SaleItem
from ...models.stock import Stock
from ...models.user import User

sales_bp = Blueprint("sales", __name__)


@sales_bp.route("/", methods=["GET"])
def test_sales():
    return jsonify({"status": "sales module OK"})


@sales_bp.route("", methods=["POST"])
@jwt_required()
def create_sale():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    org_id = user.organization_id
    role = user.role

    if role not in ["staff", "owner"]:
        return jsonify({"error": "Unauthorized"}), 403

    items_data = data.get("items", [])
    if not items_data:
        return jsonify({"error": "Sale must have at least one item"}), 400

    try:
        total_amount = 0.0
        sale_items = []

        for item in items_data:
            stock = Stock.query.filter_by(id=item["stock_id"], organization_id=org_id).first()
            if not stock:
                return jsonify({"error": f"Stock item {item['stock_id']} not found"}), 404
            if stock.quantity < item["quantity"]:
                return jsonify({"error": f"Not enough stock for {stock.name}"}), 400

            subtotal = stock.unit_price * item["quantity"]
            total_amount += subtotal

            sale_items.append(
                SaleItem(
                    stock_id=stock.id,
                    quantity=item["quantity"],
                    unit_price=stock.unit_price,
                    line_total=subtotal  # ✅ use the correct column name
                )
            )

        # Deduct stock
        for item in sale_items:
            stock = Stock.query.get(item.stock_id)
            stock.quantity -= item.quantity

        # Commit transaction
        sale = Sale(
            organization_id=org_id,
            user_id=user_id,
            total_amount=total_amount,
            items=sale_items
        )
        db.session.add(sale)
        db.session.commit()

        return jsonify({
            "message": "Sale created successfully",
            "sale_id": sale.id,
            "total_amount": sale.total_amount,
            "items": [
                {
                    "stock_id": i.stock_id,
                    "quantity": i.quantity,
                    "unit_price": i.unit_price,
                    "line_total": i.line_total,
                } for i in sale_items
            ]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
