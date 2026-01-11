from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.stock import Stock
from modules.auth.utils import owner_required  # assuming you already use this

stock_bp = Blueprint("stock", __name__, url_prefix="/api/stock")


@stock_bp.route("/", methods=["GET"])
@jwt_required()
@owner_required
def get_stock():
    user = get_jwt_identity()
    organization_id = user["organization_id"]

    stock_items = Stock.query.filter_by(
        organization_id=organization_id
    ).all()

    return jsonify([item.to_dict() for item in stock_items])


@stock_bp.route("/", methods=["POST"])
@jwt_required()
@owner_required
def add_stock():
    data = request.get_json()
    user = get_jwt_identity()

    stock = Stock(
        organization_id=user["organization_id"],
        name=data["name"],
        sku=data.get("sku"),
        category=data.get("category"),
        quantity=data["quantity"],
        unit_price=data["unit_price"],
        min_stock_level=data.get("min_stock_level", 0),
    )

    db.session.add(stock)
    db.session.commit()

    return jsonify(stock.to_dict()), 201

@stock_bp.route("/<int:stock_id>", methods=["PATCH"])
@jwt_required()
@owner_required
def update_stock(stock_id):
    """
    Update stock item fields
    """
    user = get_jwt_identity()
    organization_id = user["organization_id"]

    stock = Stock.query.filter_by(id=stock_id, organization_id=organization_id).first()
    if not stock:
        return jsonify({"error": "Stock item not found"}), 404

    data = request.get_json()
    stock.name = data.get("name", stock.name)
    stock.sku = data.get("sku", stock.sku)
    stock.category = data.get("category", stock.category)
    stock.quantity = data.get("quantity", stock.quantity)
    stock.unit_price = data.get("unit_price", stock.unit_price)
    stock.min_stock_level = data.get("min_stock_level", stock.min_stock_level)

    db.session.commit()

    return jsonify(stock.to_dict())

@stock_bp.route("/<int:stock_id>", methods=["DELETE"])
@jwt_required()
@owner_required
def delete_stock(stock_id):
    """
    Delete a stock item
    """
    user = get_jwt_identity()
    organization_id = user["organization_id"]

    stock = Stock.query.filter_by(id=stock_id, organization_id=organization_id).first()
    if not stock:
        return jsonify({"error": "Stock item not found"}), 404

    db.session.delete(stock)
    db.session.commit()

    return jsonify({"message": "Stock item deleted successfully"})

@stock_bp.route("/history", methods=["GET"])
@jwt_required()
@owner_required
def stock_history():
    user = get_jwt_identity()
    organization_id = user["organization_id"]

    histories = StockHistory.query.filter_by(
        organization_id=organization_id
    ).order_by(StockHistory.created_at.desc()).all()

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
