from flask import Blueprint, jsonify

stock_bp = Blueprint("stock", __name__)

@stock_bp.route("/", methods=["GET"])
def test_stock():
    return jsonify({"status": "stock module OK"})
