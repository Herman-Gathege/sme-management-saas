from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from app.extensions import db
from ...models.sale import Sale
from ...models.user import User
from ...utils.decorators import owner_required

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/sales", methods=["GET"])
@jwt_required()
@owner_required
def sales_report():
    """
    Return sales and summary for the owner with optional 'range' filter:
    - range=today
    - range=month
    - default: all-time
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "owner":
        return jsonify({"error": "Owner access required"}), 403

    # Timezone for display
    tz = ZoneInfo("Africa/Nairobi")
    now_nairobi = datetime.now(tz)

    # Determine filter
    range_param = request.args.get("range", "all").lower()
    query = Sale.query.filter_by(organization_id=user.organization_id)

    if range_param == "today":
        start_of_day = now_nairobi.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_day_utc = start_of_day.astimezone(timezone.utc)
        query = query.filter(Sale.created_at >= start_of_day_utc)
    elif range_param == "month":
        start_of_month = now_nairobi.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_of_month_utc = start_of_month.astimezone(timezone.utc)
        query = query.filter(Sale.created_at >= start_of_month_utc)
    # else 'all' -> no filter

    sales = query.order_by(Sale.created_at.desc()).all()

    # Build sales data
    sales_data = [
        {
            "sale_id": sale.id,
            "payment_method": sale.payment_method,
            "total_amount": float(sale.total_amount),
            "created_at": sale.created_at.replace(tzinfo=timezone.utc).astimezone(tz).isoformat()
        }
        for sale in sales
    ]

    # Compute summary for filtered sales
    summary_totals = {}
    for sale in sales:
        key = sale.payment_method.lower()
        summary_totals[key] = summary_totals.get(key, 0) + float(sale.total_amount)

    summary = {
        "cash": summary_totals.get("cash", 0),
        "mpesa": summary_totals.get("mpesa", 0),
        "credit": summary_totals.get("credit", 0),
        "total": sum(summary_totals.values())
    }

    return jsonify({
        "summary": summary,
        "sales": sales_data
    }), 200
