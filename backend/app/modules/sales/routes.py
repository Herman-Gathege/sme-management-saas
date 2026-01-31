#backend/app/modules/sales/routes.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from ...models.sale import Sale
from ...models.sale_item import SaleItem
from ...models.stock import Stock
from ...models.user import User
from datetime import timezone
from zoneinfo import ZoneInfo

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/", methods=["GET"])
def test_sales():
    return jsonify({"status": "sales module OK"}), 200


# ✅ CREATE SALE
@sales_bp.route("", methods=["POST"])
@jwt_required()
def create_sale():
    from flask import request
    from ...models.customer import Customer

    data = request.get_json()
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    if user.role not in ["staff", "owner"]:
        return jsonify({"error": "Unauthorized"}), 403

    payment_method = data.get("paymentMethod", "").lower()

    if payment_method not in ["cash", "mpesa", "credit"]:
        return jsonify({"error": "Invalid payment method"}), 400

    customer = None
    if payment_method == "credit":
        customer_id = data.get("customer_id")
        if not customer_id:
            return jsonify({"error": "Customer required for credit sale"}), 400

        customer = Customer.query.filter_by(
            id=customer_id,
            organization_id=user.organization_id,
            role="debtor",
            is_active=True
        ).first()

        if not customer:
            return jsonify({"error": "Invalid debtor selected"}), 400

    items_data = data.get("items", [])
    if not items_data:
        return jsonify({"error": "Sale must have at least one item"}), 400

    try:
        total_amount = 0
        sale_items = []

        for item in items_data:
            stock = Stock.query.filter_by(
                id=item["stock_id"],
                organization_id=user.organization_id
            ).first()

            if not stock:
                return jsonify({"error": "Stock not found"}), 404

            if stock.quantity < item["quantity"]:
                return jsonify({"error": f"Insufficient stock for {stock.name}"}), 400

            subtotal = stock.unit_price * item["quantity"]
            total_amount += subtotal

            sale_items.append(
                SaleItem(
                    stock_id=stock.id,
                    quantity=item["quantity"],
                    unit_price=stock.unit_price,
                    line_total=subtotal,
                )
            )

            stock.quantity -= item["quantity"]

        sale = Sale(
            organization_id=user.organization_id,
            user_id=user.id,
            customer_id=customer.id if customer else None,
            payment_method=payment_method,
            total_amount=total_amount,
            items=sale_items,
        )

        db.session.add(sale)
        db.session.commit()

        tz = ZoneInfo("Africa/Nairobi")
        created_at = sale.created_at.replace(
            tzinfo=timezone.utc
        ).astimezone(tz).isoformat()

        return jsonify({
            "message": "Sale created successfully",
            "sale_id": sale.id,
            "customer": customer.full_name if customer else None,
            "total_amount": float(sale.total_amount),
            "payment_method": sale.payment_method,
            "created_at": created_at,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ✅ OWNER DASHBOARD SALES
@sales_bp.route("/owner", methods=["GET"])
@jwt_required()
def get_sales_for_owner():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "owner":
        return jsonify({"error": "Owner access required"}), 403

    sales = (
        Sale.query
        .filter_by(organization_id=user.organization_id)
        .order_by(Sale.created_at.desc())
        .all()
    )

    result = []
    tz = ZoneInfo("Africa/Nairobi")  # Nairobi timezone

    for sale in sales:
        staff = User.query.get(sale.user_id)
        sale_items = [
            {
                "stock_id": item.stock_id,
                "name": item.stock.name if item.stock else "Unknown",
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
                "line_total": float(item.line_total),
            }
            for item in sale.items
        ]

        result.append({
            "sale_id": sale.id,
            "staff": staff.full_name if staff else "Unknown",
            "total_amount": float(sale.total_amount),
            # ✅ Convert created_at from UTC to Nairobi
            "created_at": sale.created_at.replace(tzinfo=timezone.utc).astimezone(tz).isoformat(),
            "items": sale_items,
        })

    return jsonify(result), 200
