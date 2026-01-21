#backend/app/modules/stock/routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import cross_origin

from app.extensions import db
from app.models.stock import Stock
from app.models.stock_history import StockHistory
from app.models.user import User
from app.auth.decorators import owner_required

import json

stock_bp = Blueprint("stock", __name__, url_prefix="/api/stock")


def get_auth_context():
    """
    Safely extract user ID and organization ID from JWT.
    Returns tuple (user_id, organization_id) or raises JSON error.
    """
    try:
        identity = get_jwt_identity()
        if isinstance(identity, dict):
            user_id = identity.get("id")
        else:
            user_id = int(identity)

        claims = get_jwt()
        org_id = claims.get("organization_id")
        if not user_id or not org_id:
            raise ValueError("Invalid token: missing identity or organization")
        return user_id, org_id
    except Exception as e:
        # Return JSON error immediately
        response = jsonify({"error": "Invalid or missing JWT", "detail": str(e)})
        response.status_code = 401
        raise Exception(response)


# -------------------------
# GET ALL STOCK
# -------------------------
@stock_bp.route("/", methods=["GET"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def get_stock():
    try:
        _, organization_id = get_auth_context()
        stock_items = Stock.query.filter_by(organization_id=organization_id).all()
        return jsonify([item.to_dict() for item in stock_items])
    except Exception as e:
        return e.args[0] if hasattr(e, "args") else jsonify({"error": str(e)}), 400


# -------------------------
# ADD STOCK
# -------------------------
@stock_bp.route("/", methods=["POST"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def add_stock():
    try:
        data = request.get_json()
        user_id, organization_id = get_auth_context()

        stock = Stock(
            organization_id=organization_id,
            name=data["name"],
            sku=data.get("sku"),
            category=data.get("category"),
            quantity=data["quantity"],
            unit_price=data["unit_price"],
            min_stock_level=data.get("min_stock_level", 0),
        )

        db.session.add(stock)
        db.session.commit()

        # Add history log
        history = StockHistory(
            stock_id=stock.id,
            organization_id=organization_id,
            user_id=user_id,
            action="created",
            details=json.dumps({
                "name": stock.name,
                "quantity": stock.quantity,
                "unit_price": stock.unit_price,
            }),
        )
        db.session.add(history)
        db.session.commit()

        return jsonify(stock.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# UPDATE STOCK
# -------------------------
@stock_bp.route("/<int:stock_id>", methods=["PATCH"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def update_stock(stock_id):
    try:
        data = request.get_json()
        user_id, organization_id = get_auth_context()

        stock = Stock.query.filter_by(id=stock_id, organization_id=organization_id).first()
        if not stock:
            return jsonify({"error": "Stock item not found"}), 404

        changes = {}
        for field in ["name", "sku", "category", "quantity", "unit_price", "min_stock_level"]:
            old = getattr(stock, field)
            new = data.get(field, old)
            if old != new:
                changes[field] = {"old": old, "new": new}
                setattr(stock, field, new)

        if changes:
            history = StockHistory(
                stock_id=stock.id,
                organization_id=organization_id,
                user_id=user_id,
                action="updated",
                details=json.dumps(changes),
            )
            db.session.add(history)

        db.session.commit()
        return jsonify(stock.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# DELETE STOCK
# -------------------------
@stock_bp.route("/<int:stock_id>", methods=["DELETE"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def delete_stock(stock_id):
    try:
        user_id, organization_id = get_auth_context()

        stock = Stock.query.filter_by(id=stock_id, organization_id=organization_id).first()
        if not stock:
            return jsonify({"error": "Stock item not found"}), 404

        # Add delete history
        history = StockHistory(
            stock_id=stock.id,
            organization_id=organization_id,
            user_id=user_id,
            action="deleted",
            details=json.dumps({
                "name": stock.name,
                "quantity": stock.quantity,
                "unit_price": stock.unit_price,
                "category": stock.category,
            }),
        )
        db.session.add(history)
        db.session.delete(stock)
        db.session.commit()

        return jsonify({"message": "Stock item deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# STOCK HISTORY
# -------------------------
@stock_bp.route("/history", methods=["GET"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def stock_history():
    try:
        _, organization_id = get_auth_context()

        histories = StockHistory.query.filter_by(organization_id=organization_id) \
            .order_by(StockHistory.created_at.desc()).all()

        results = []
        for h in histories:
            stock_item = Stock.query.get(h.stock_id)
            user_obj = User.query.get(h.user_id)
            results.append({
                "id": h.id,
                "stock_name": stock_item.name if stock_item else "Deleted",
                "action": h.action,
                "details": json.loads(h.details) if h.details else {},
                "user": user_obj.full_name if user_obj else "Unknown",
                "created_at": h.created_at.isoformat(),
            })

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# -------------------------
# GET SINGLE STOCK ITEM
# -------------------------
@stock_bp.route("/<int:stock_id>", methods=["GET"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def get_single_stock(stock_id):
    try:
        _, organization_id = get_auth_context()
        stock = Stock.query.filter_by(id=stock_id, organization_id=organization_id).first()
        if not stock:
            return jsonify({"error": "Stock item not found"}), 404

        return jsonify(stock.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@stock_bp.route("/staff", methods=["GET", "OPTIONS"], strict_slashes=False)
@cross_origin(origins="*", headers=["Content-Type", "Authorization"], supports_credentials=True)
@jwt_required()
def get_stock_for_staff():
    if request.method == "OPTIONS":
        return jsonify({}), 200  # preflight success

    # Use get_jwt() to get claims like role/org_id
    claims = get_jwt()
    role = claims.get("role")
    org_id = claims.get("organization_id")

    if role != "staff":
        return jsonify({"error": "Staff access only"}), 403

    stock_items = Stock.query.filter_by(organization_id=org_id).all()
    return jsonify([item.to_dict() for item in stock_items])



# -------------------------
# STOCK ALERTS (LOW / OUT)
# -------------------------
@stock_bp.route("/alerts", methods=["GET"], strict_slashes=False)
@cross_origin()
@jwt_required()
@owner_required
def stock_alerts():
    try:
        _, organization_id = get_auth_context()

        alerts = (
            Stock.query
            .filter(
                Stock.organization_id == organization_id,
                Stock.quantity <= Stock.min_stock_level
            )
            .order_by(Stock.quantity.asc())
            .all()
        )

        return jsonify([item.to_dict() for item in alerts])

    except Exception as e:
        return jsonify({"error": str(e)}), 400

