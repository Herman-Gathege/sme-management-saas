# backend/app/utils/decorators.py
from functools import wraps
from flask_jwt_extended import get_jwt
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request

def owner_required(fn):
    """Owner-only routes"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()  # Ensure JWT is present and valid
            claims = get_jwt()
            print("JWT claims (owner_required):", claims)
            if claims.get("role") != "owner":
                print("Access denied: role is not owner")
                return jsonify({"error": "Unauthorized: owner only"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            print("JWT validation failed (owner_required):", str(e))
            return jsonify({"error": "JWT validation failed"}), 401
    return wrapper

def staff_required(fn):
    """Staff-only routes"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            print("JWT claims (staff_required):", claims)
            if claims.get("role") != "staff":
                print("Access denied: role is not staff")
                return jsonify({"error": "Unauthorized: staff only"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            print("JWT validation failed (staff_required):", str(e))
            return jsonify({"error": "JWT validation failed"}), 401
    return wrapper

def owner_or_staff_required(fn):
    """Owner or Staff routes"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            print("JWT claims (owner_or_staff_required):", claims)
            if claims.get("role") not in ["owner", "staff"]:
                print("Access denied: role is not owner or staff")
                return jsonify({"error": "Unauthorized"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            print("JWT validation failed (owner_or_staff_required):", str(e))
            return jsonify({"error": "JWT validation failed"}), 401
    return wrapper


def super_admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()

        if claims.get("role") != "super_admin":
            return jsonify({"error": "Super Admin access required"}), 403

        return fn(*args, **kwargs)
    return wrapper