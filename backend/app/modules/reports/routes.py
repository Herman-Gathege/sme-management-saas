from flask import Blueprint, jsonify

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/", methods=["GET"])
def test_reports():
    return jsonify({"status": "reports module OK"})
