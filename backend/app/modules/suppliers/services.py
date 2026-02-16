# backend/app/modules/suppliers/services.py
from app.models.supplier import Supplier
from app.models.supplier_purchase import SupplierPurchase
from app.models.supplier_payment import SupplierPayment
from app.extensions import db
from sqlalchemy import func

# def get_creditors_summary(organization_id: int):
#     """
#     Return a list of suppliers we owe money to (credit purchases minus payments)
#     """
#     # Get all active suppliers
#     suppliers = Supplier.query.filter_by(organization_id=organization_id, is_active=True).all()

#     creditors = []

#     for supplier in suppliers:
#         # Total credit purchases
#         total_credit = db.session.query(func.coalesce(func.sum(SupplierPurchase.total_amount), 0)) \
#             .filter_by(organization_id=organization_id, supplier_id=supplier.id, payment_method="credit") \
#             .scalar()

#         # Total payments made
#         total_paid = db.session.query(func.coalesce(func.sum(SupplierPayment.amount), 0)) \
#             .filter_by(organization_id=organization_id, supplier_id=supplier.id) \
#             .scalar()

#         balance_due = float(total_credit) - float(total_paid)

#         if balance_due > 0:
#             creditors.append({
#                 "supplier_id": supplier.id,
#                 "supplier_name": supplier.name,
#                 "total_credit": float(total_credit),
#                 "total_paid": float(total_paid),
#                 "balance_due": balance_due
#             })

#     return creditors

def get_creditors_summary(organization_id: int):
    """
    Return supplier balances including:
    - owing suppliers
    - fully paid (settled) suppliers
    - overpaid suppliers
    """

    suppliers = Supplier.query.filter_by(
        organization_id=organization_id,
        is_active=True
    ).all()

    creditors = []

    for supplier in suppliers:

        # Total credit purchases
        total_credit = db.session.query(
            func.coalesce(func.sum(SupplierPurchase.total_amount), 0)
        ).filter_by(
            organization_id=organization_id,
            supplier_id=supplier.id,
            payment_method="credit"
        ).scalar()

        # Total payments made
        total_paid = db.session.query(
            func.coalesce(func.sum(SupplierPayment.amount), 0)
        ).filter_by(
            organization_id=organization_id,
            supplier_id=supplier.id
        ).scalar()

        total_credit = float(total_credit)
        total_paid = float(total_paid)

        balance_due = total_credit - total_paid

        # Determine status
        if balance_due > 0:
            status = "owing"
        elif balance_due == 0:
            status = "settled"
        else:
            status = "overpaid"

        creditors.append({
            "supplier_id": supplier.id,
            "supplier_name": supplier.name,
            "total_credit": total_credit,
            "total_paid": total_paid,
            "balance_due": balance_due,
            "status": status
        })

    return creditors

