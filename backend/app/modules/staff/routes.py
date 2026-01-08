from flask import Blueprint, jsonify

staff_bp = Blueprint("staff", __name__)

@staff_bp.route("/", methods=["GET"])
def test_staff():
    return jsonify({"status": "staff module OK"})
