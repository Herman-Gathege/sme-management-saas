#backend/app/modules/kra_compliance/devices/routes.py

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Device

devices_bp = Blueprint("devices", __name__, url_prefix="/api/devices")


@devices_bp.route("", methods=["POST"])
def create_device():
    data = request.json

    device = Device(
        branch_id=data["branch_id"],
        device_serial=data["device_serial"]
    )

    db.session.add(device)
    db.session.commit()

    return jsonify({"message": "Device created"}), 201


@devices_bp.route("", methods=["GET"])
def list_devices():
    branch_id = request.args.get("branch_id")

    devices = Device.query.filter_by(branch_id=branch_id).all()

    return jsonify([
        {
            "id": d.id,
            "device_serial": d.device_serial,
            "is_active": d.is_active
        }
        for d in devices
    ])