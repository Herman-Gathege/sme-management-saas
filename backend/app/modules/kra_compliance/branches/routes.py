#backend/app/modules/kra_compliance/routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.extensions import db
from app.models import Branch

branches_bp = Blueprint("branches", __name__, url_prefix="/api/branches")


@branches_bp.route("", methods=["POST"])
def create_branch():
    data = request.json
    org_id = data.get("organization_id")

    branch = Branch(
        organisation_id=org_id,
        name=data["name"],
        location=data.get("location")
    )

    db.session.add(branch)
    db.session.commit()

    return jsonify({"message": "Branch created"}), 201


@branches_bp.route("", methods=["GET"])
def list_branches():
    org_id = request.args.get("organization_id")
    branches = Branch.query.filter_by(organisation_id=org_id).all()

    return jsonify([
        {
            "id": b.id,
            "name": b.name,
            "location": b.location,
            "is_active": b.is_active
        }
        for b in branches
    ])