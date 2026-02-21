from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

from app.extensions import db
from app.models.sale import Sale
from app.models.sale_item import SaleItem


profits_bp = Blueprint("profits", __name__, url_prefix="/profits")



def get_date_range(filter_type, start_date=None, end_date=None):
    today = datetime.utcnow().date()

    if filter_type == "today":
        return today, today

    if filter_type == "week":
        start = today - timedelta(days=today.weekday())
        return start, today

    if filter_type == "month":
        start = today.replace(day=1)
        return start, today

    if filter_type == "year":
        start = today.replace(month=1, day=1)
        return start, today

    if filter_type == "custom" and start_date and end_date:
        return (
            datetime.strptime(start_date, "%Y-%m-%d").date(),
            datetime.strptime(end_date, "%Y-%m-%d").date()
        )

    return today, today

@profits_bp.route("/summary", methods=["GET"])
@jwt_required()
def profit_summary():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    filter_type = request.args.get("filter", "today")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    start, end = get_date_range(filter_type, start_date, end_date)

    query = (
        db.session.query(
            func.date(Sale.created_at).label("date"),
            func.sum(SaleItem.line_total).label("revenue"),
            func.sum(SaleItem.cost_price * SaleItem.quantity).label("cost")
        )
        .join(SaleItem, Sale.id == SaleItem.sale_id)
        .filter(Sale.organization_id == user.organization_id)   # 🔥 IMPORTANT
        .filter(func.date(Sale.created_at) >= start)
        .filter(func.date(Sale.created_at) <= end)
        .group_by(func.date(Sale.created_at))
        .order_by(func.date(Sale.created_at))
    )

    results = query.all()

    labels = []
    revenue_data = []
    cost_data = []
    profit_data = []

    total_revenue = 0.0
    total_cost = 0.0

    for row in results:
        revenue = float(row.revenue or 0)
        cost = float(row.cost or 0)
        profit = revenue - cost

        labels.append(str(row.date))
        revenue_data.append(revenue)
        cost_data.append(cost)
        profit_data.append(profit)

        total_revenue += revenue
        total_cost += cost

    total_profit = total_revenue - total_cost
    margin = (total_profit / total_revenue * 100) if total_revenue else 0

    return jsonify({
        "labels": labels,
        "revenue": revenue_data,
        "cost": cost_data,
        "profit": profit_data,
        "totals": {
            "revenue": total_revenue,
            "cost": total_cost,
            "profit": total_profit,
            "margin": margin   # 🔥 nice business metric
        }
    })

@profits_bp.route("/widget", methods=["GET"])
@jwt_required()
def profit_widget():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    today = datetime.utcnow().date()
    start_month = today.replace(day=1)
    start_year = today.replace(month=1, day=1)

    def calc_profit(start_date):
        revenue, cost = (
            db.session.query(
                func.sum(SaleItem.line_total),
                func.sum(SaleItem.cost_price * SaleItem.quantity)
            )
            .join(Sale, Sale.id == SaleItem.sale_id)
            .filter(Sale.organization_id == user.organization_id)
            .filter(func.date(Sale.created_at) >= start_date)
            .first()
        )

        revenue = float(revenue or 0)
        cost = float(cost or 0)

        return revenue - cost

    return jsonify({
        "today_profit": calc_profit(today),
        "month_profit": calc_profit(start_month),
        "year_profit": calc_profit(start_year)
    })