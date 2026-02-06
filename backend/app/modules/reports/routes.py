from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity 
from sqlalchemy import func
from app.extensions import db
from ...models.sale import Sale
from ...models.user import User
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from ...utils.decorators import owner_required 

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/sales", methods=["GET"])
@jwt_required()
@owner_required
def sales_report():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "owner":
        return jsonify({"error": "Owner access required"}), 403

    # 🔢 Aggregate totals by payment method
    totals = (
        db.session.query(
            Sale.payment_method,
            func.sum(Sale.total_amount)
        )
        .filter(Sale.organization_id == user.organization_id)
        .group_by(Sale.payment_method)
        .all()
    )

    summary = {
        "cash": 0,
        "mpesa": 0,
        "credit": 0,
        "total": 0
    }

    for method, amount in totals:
        method = method.lower()
        summary[method] = float(amount)
        summary["total"] += float(amount)

    # 📅 Filter sales based on query param
    range_param = request.args.get("range", "all")  # default all-time
    tz = ZoneInfo("Africa/Nairobi")
    now = datetime.now(tz)

    query = Sale.query.filter_by(organization_id=user.organization_id)

    if range_param == "today":
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(Sale.created_at >= start_of_day)
    elif range_param == "month":
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(Sale.created_at >= start_of_month)

    sales = query.order_by(Sale.created_at.desc()).all()

    sales_data = [
        {
            "sale_id": sale.id,
            "payment_method": sale.payment_method,
            "total_amount": float(sale.total_amount),
            "created_at": sale.created_at.replace(
                tzinfo=timezone.utc
            ).astimezone(tz).isoformat()
        }
        for sale in sales
    ]

    # Optionally recompute summary based on filtered sales
    filtered_totals = {}
    for sale in sales:
        key = sale.payment_method.lower()
        filtered_totals[key] = filtered_totals.get(key, 0) + float(sale.total_amount)

    summary_filtered = {
        "cash": filtered_totals.get("cash", 0),
        "mpesa": filtered_totals.get("mpesa", 0),
        "credit": filtered_totals.get("credit", 0),
        "total": sum(filtered_totals.values())
    }

    return jsonify({
        "summary": summary_filtered,
        "sales": sales_data
    }), 200
