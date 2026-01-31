# backend/app/utils/decorators.py
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt
from flask import jsonify

# Owner-only decorator
def owner_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "owner":
            return jsonify({"error": "Unauthorized: owner only"}), 403
        return fn(*args, **kwargs)
    return wrapper

# Staff-only decorator (self actions)
def staff_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "staff":
            return jsonify({"error": "Unauthorized: staff only"}), 403
        return fn(*args, **kwargs)
    return wrapper

def owner_or_staff_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") not in ["owner", "staff"]:
            return jsonify({"error": "Unauthorized"}), 403
        return fn(*args, **kwargs)
    return wrapper
