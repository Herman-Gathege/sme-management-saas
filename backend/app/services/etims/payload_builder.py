#backend/app/services/etims/payload_builder.py

from datetime import datetime

class EtimsPayloadBuilder:

    @staticmethod
    def build_invoice_payload(sale):

        # Safely determine customer PIN
        customer_pin = None

        if sale.customer:
            # Only use kra_pin if it actually exists on model
            if hasattr(sale.customer, "kra_pin"):
                customer_pin = sale.customer.kra_pin

        return {
            "invoiceNumber": str(sale.id),
            "invoiceDate": sale.created_at.isoformat(),
            "customerPin": customer_pin,
            "totalAmount": float(sale.total_amount),
            "items": [
                {
                    "description": item.stock.name,
                    "quantity": item.quantity,
                    "unitPrice": float(item.unit_price),
                    "lineTotal": float(item.line_total)
                }
                for item in sale.items
            ]
        }