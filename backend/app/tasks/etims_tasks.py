# backend/app/tasks/etims_tasks.py

from app.celery_app import celery
from app.extensions import db
from app.models.sale import Sale
from app.services.etims.client import EtimsClient
from app.services.etims.payload_builder import EtimsPayloadBuilder
from app.services.etims.response_handler import EtimsResponseHandler


@celery.task(name="app.tasks.transmit_sale_task")
def transmit_sale_task(sale_id):
    print("ETIMS TASK MODULE LOADED")
    print("🔥 WORKER RECEIVED SALE:", sale_id)
    sale = Sale.query.get(sale_id)
    if not sale:
        return

    try:
        client = EtimsClient(sale.organization_id)
        payload = EtimsPayloadBuilder.build_invoice_payload(sale)
        response = client.send_invoice(payload)
        result = EtimsResponseHandler.handle(response)

        sale.kra_status = result["status"]

        if result["status"] == "SENT":
            sale.kra_icn = result["icn"]
            sale.kra_qr_code = result["qr_code"]
            sale.kra_control_number = result["control_number"]
            sale.kra_response_payload = result["raw_response"]
            sale.kra_eat_timestamp = result.get("eat_timestamp")
        else:
            sale.kra_response_payload = {"error": result.get("error")}

    except Exception as e:
        sale.kra_status = "FAILED"
        sale.kra_response_payload = {"error": str(e)}

    db.session.commit()