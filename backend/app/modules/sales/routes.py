#backend/app/modules/sales/routes.py
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.services.receipt_generator import ReceiptGenerator
from ...models.sale import Sale
from ...models.sale_item import SaleItem
from ...models.stock import Stock
from ...models.user import User
from ...models.customer import Customer
from ...models.branch import Branch
from ...models.device import Device
from datetime import timezone
from zoneinfo import ZoneInfo


from sqlalchemy.orm import joinedload

# from app.services.etims.client import EtimsClient
# from app.services.etims.payload_builder import EtimsPayloadBuilder
# from app.services.etims.response_handler import EtimsResponseHandler

# from app.tasks.etims_tasks import transmit_sale_task


sales_bp = Blueprint("sales", __name__)


@sales_bp.route("/", methods=["GET"])
def test_sales():
    return jsonify({"status": "sales module OK"}), 200


# ✅ CREATE SALE with stock deduction & low stock alerts
@sales_bp.route("", methods=["POST"])
@jwt_required()
def create_sale():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Invalid token"}), 401

    if user.role not in ["staff", "owner"]:
        return jsonify({"error": "Unauthorized"}), 403

    current_org_id = user.organization_id
    if not current_org_id:
        return jsonify({"error": "User not assigned to an organization"}), 403


    print("==== SALES PAYLOAD ====")
    print(request.json)
    print("========================")

    # -----------------------
    # Branch Validation
    # -----------------------
    # branch_id = data.get("branch_id")

    branch_id = user.branch_id
    if not branch_id:
        return jsonify({"error": "User is not assigned to a branch"}), 400

    branch = Branch.query.filter_by(
        id=branch_id,
        organization_id=current_org_id
    ).first()

    if not branch:
        return jsonify({"error": "Invalid branch"}), 404

    # -----------------------
    # Device Validation
    # -----------------------
    device_id = data.get("device_id")
    if not device_id:
        return jsonify({"error": "Device is required"}), 400

    device = (
        Device.query
        .filter(Device.id == device_id)
        .filter(Device.branch_id == branch.id)
        .join(Branch)                     # or .join(Device.branch)
        .filter(Branch.organization_id == current_org_id)
        .first()
    )

    if not device:
        return jsonify({"error": "Invalid device for this branch or organization"}), 404

    # -----------------------
    # Payment Validation
    # -----------------------
    payment_method = data.get("payment_method", "").lower()
    if payment_method not in ["cash", "mpesa", "credit"]:
        return jsonify({"error": "Invalid payment method"}), 400

    customer = None
    if payment_method == "credit":
        customer_id = data.get("customer_id")
        if not customer_id:
            return jsonify({"error": "Customer required for credit sale"}), 400

        customer = Customer.query.filter_by(
            id=customer_id,
            organization_id=current_org_id,
            role="debtor",
            is_active=True
        ).first()

        if not customer:
            return jsonify({"error": "Invalid debtor selected"}), 400

    items_data = data.get("items", [])
    if not items_data:
        return jsonify({"error": "Sale must have at least one item"}), 400

    try:
        total_amount = 0
        sale_items = []
        low_stock_items = []

        # -----------------------
        # Stock Processing
        # -----------------------
        for item in items_data:
            stock = (
                Stock.query
                .filter_by(
                    id=item["stock_id"],
                    organization_id=current_org_id
                )
                .with_for_update()
                .first()
            )

            if not stock:
                return jsonify({"error": f"Stock item {item['stock_id']} not found"}), 404

            qty = int(item["quantity"])
            if stock.quantity < qty:
                return jsonify({"error": f"Insufficient stock for {stock.name}"}), 400

            price = float(item["price"])
            cost = float(stock.unit_price or 0)
            subtotal = price * qty
            total_amount += subtotal

            stock.quantity -= qty

            if stock.min_stock_level and stock.quantity <= stock.min_stock_level:
                low_stock_items.append({
                    "id": stock.id,
                    "name": stock.name,
                    "quantity": stock.quantity
                })

            sale_items.append(
                SaleItem(
                    stock_id=stock.id,
                    quantity=qty,
                    unit_price=price,
                    cost_price=cost,
                    line_total=subtotal
                )
            )

        # -----------------------
        # Create Sale (Initial Commit)
        # -----------------------
        sale = Sale(
            organization_id=current_org_id,
            branch_id=branch.id,
            device_id=device.id,
            user_id=user.id,
            customer_id=customer.id if customer else None,
            payment_method=payment_method,
            total_amount=total_amount,
            items=sale_items,
            kra_status="PENDING"
        )

        db.session.add(sale)
        db.session.commit()  # Important: generate sale ID first

        # -----------------------
        # KRA Transmission
        # -----------------------
        # try:
        #     client = EtimsClient(current_org_id)
        #     payload = EtimsPayloadBuilder.build_invoice_payload(sale)
        #     response = client.send_invoice(payload)
        #     result = EtimsResponseHandler.handle(response)

        #     sale.kra_status = result["status"]

        #     if result["status"] == "SENT":
        #         sale.kra_icn = result["icn"]
        #         sale.kra_qr_code = result["qr_code"]
        #         sale.kra_control_number = result["control_number"]
        #         sale.kra_response_payload = result["raw_response"]
        #     else:
        #         sale.kra_response_payload = {"error": result.get("error")}

        # except Exception as e:
        #     sale.kra_status = "FAILED"
        #     sale.kra_response_payload = {"error": str(e)}

        # db.session.commit()
        from app.celery_app import celery

        print("Broker URL:", celery.conf.broker_url)
        print("Result Backend:", celery.conf.result_backend)
        
        try:
            # from celery import current_app
            # print("FLASK broker:", current_app.conf.broker_url)
            
            from app.tasks.etims_tasks import transmit_sale_task
            transmit_sale_task.delay(sale.id)

        except Exception as e:
            print("Celery not available:", str(e))

        # -----------------------
        # Response
        # -----------------------
        tz = ZoneInfo("Africa/Nairobi")
        created_at = sale.created_at.replace(
            tzinfo=timezone.utc
        ).astimezone(tz).isoformat()

        return jsonify({
            "message": "Sale created successfully",
            "sale_id": sale.id,
            "customer": customer.full_name if customer else None,
            "total_amount": float(sale.total_amount),
            "payment_method": sale.payment_method,
            "kra_status": sale.kra_status,
            "created_at": created_at,
            "low_stock_items": low_stock_items
        }), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ✅ OWNER DASHBOARD SALES
@sales_bp.route("/owner", methods=["GET"])
@jwt_required()
def get_sales_for_owner():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "owner":
        return jsonify({"error": "Owner access required"}), 403

    tz = ZoneInfo("Africa/Nairobi")

    sales = (
        Sale.query
        .options(
            joinedload(Sale.user),                 # staff
            joinedload(Sale.items).joinedload(SaleItem.stock)  # items + stock
        )
        .filter_by(organization_id=user.organization_id)
        .order_by(Sale.created_at.desc())
        .limit(100)  # 🚀 critical for speed
        .all()
    )

    result = []

    for sale in sales:
        sale_items = [
            {
                "stock_id": item.stock_id,
                "name": item.stock.name if item.stock else "Unknown",
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
                "line_total": float(item.line_total),
            }
            for item in sale.items
        ]

        result.append({
            "sale_id": sale.id,
            "staff": sale.user.full_name if sale.user else "Unknown",
            "total_amount": float(sale.total_amount),
            "created_at": sale.created_at.replace(tzinfo=timezone.utc).astimezone(tz).isoformat(),
            "items": sale_items,
            "payment_method": sale.payment_method
        })

        print("Request JSON:", request.json)
    return jsonify(result), 200
    


# ✅ SALE RECEIPT
@sales_bp.route("/<int:sale_id>/receipt", methods=["GET"])
def get_receipt(sale_id):
    receipt = ReceiptGenerator.generate(sale_id)
    return receipt, 200