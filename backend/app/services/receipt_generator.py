# backend/app/services/receipt_generator.py

from app.models.sale import Sale


class ReceiptGenerator:

    @staticmethod
    def generate(sale_id):
        sale = Sale.query.get_or_404(sale_id)

        return {
            "sale_id": sale.id,
            "created_at": sale.created_at.isoformat(),
            "total_amount": sale.total_amount,
            "payment_method": sale.payment_method,

            "staff": sale.user.full_name if sale.user else None,
            "customer": sale.customer.name if sale.customer else None,

            "items": [
                {
                    "name": item.stock.name,
                    "quantity": item.quantity,
                    "price": item.price,
                    "line_total": item.quantity * item.price
                }
                for item in sale.items
            ],

            # 🔥 COMPLIANCE SECTION
            "kra_status": sale.kra_status,
            "kra_pin": sale.organization.kra_pin if sale.organization else None,
            "branch_code": sale.branch.code if sale.branch else None,
            "control_number": sale.kra_control_number,
            "icn": sale.kra_icn,
            "eat_timestamp": sale.kra_eat_timestamp,
            "qr_code": sale.kra_qr_code,
        }