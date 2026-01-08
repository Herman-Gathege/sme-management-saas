from flask import Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/", methods=["GET"])
def test_auth():
    return jsonify({"status": "auth module OK"})
