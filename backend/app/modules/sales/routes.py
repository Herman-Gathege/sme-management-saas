from flask import Blueprint, jsonify

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/", methods=["GET"])
def test_sales():
    return jsonify({"status": "sales module OK"})
