from flask import Blueprint, jsonify

customers_bp = Blueprint("customers", __name__)

@customers_bp.route("/", methods=["GET"])
def test_customers():
    return jsonify({"status": "customers module OK"})
