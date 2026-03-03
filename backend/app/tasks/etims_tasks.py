from celery import shared_task
from app.extensions import db
from app.models.sale import Sale
from app.services.etims.client import EtimsClient
from app.services.etims.payload_builder import EtimsPayloadBuilder
from app.services.etims.response_handler import EtimsResponseHandler


@shared_task()
def transmit_sale_task(sale_id):

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
        else:
            sale.kra_response_payload = {"error": result.get("error")}

    except Exception as e:
        sale.kra_status = "FAILED"
        sale.kra_response_payload = {"error": str(e)}

    db.session.commit()