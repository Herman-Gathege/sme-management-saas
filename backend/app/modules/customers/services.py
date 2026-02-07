# backend/app/modules/customers/services.py
from app import db

# Debtors
from app.models.customer import Customer
from app.models.sale import Sale
from app.models.payment import Payment

# Creditors (suppliers)
from app.models.supplier import Supplier
from app.models.supplier_purchase import SupplierPurchase
from app.models.supplier_payment import SupplierPayment


def get_debtors_summary(org_id):
    """
    Debtors = customers who owe us money
    Balance = sum of credit sales per customer - sum of payments
    Includes fully paid customers with balance 0
    """
    debtors = []

    # Get all active debtors
    customers = Customer.query.filter_by(
        organization_id=org_id,
        is_active=True,
        role="debtor"
    ).all()

    for customer in customers:
        # Sum of credit sales
        total_sales = db.session.query(
            db.func.coalesce(db.func.sum(Sale.total_amount), 0)
        ).filter(
            Sale.customer_id == customer.id,
            Sale.organization_id == org_id,
            Sale.payment_method == "credit"
        ).scalar()

        # Sum of payments
        total_payments = db.session.query(
            db.func.coalesce(db.func.sum(Payment.amount), 0)
        ).filter(
            Payment.customer_id == customer.id,
            Payment.organization_id == org_id
        ).scalar()

        balance = float(total_sales - total_payments)

        # Include all, not just balance > 0
        debtors.append({
            "id": customer.id,
            "full_name": f"{customer.name} ({customer.business_name})" if customer.business_name else customer.name,
            "balance": balance,
            "status": "OWED" if balance > 0 else "PAID"  # mark status
        })

    return debtors



def get_creditors_summary(org_id):
    creditors = []

    suppliers = Supplier.query.filter_by(
        organization_id=org_id,
        is_active=True
    ).all()

    for supplier in suppliers:
        total_credit = db.session.query(
            db.func.coalesce(db.func.sum(SupplierPurchase.total_amount), 0)
        ).filter(
            SupplierPurchase.organization_id == org_id,
            SupplierPurchase.supplier_id == supplier.id,
            SupplierPurchase.payment_method == "credit"
        ).scalar()

        total_paid = db.session.query(
            db.func.coalesce(db.func.sum(SupplierPayment.amount), 0)
        ).filter(
            SupplierPayment.organization_id == org_id,
            SupplierPayment.supplier_id == supplier.id
        ).scalar()

        balance = float(total_credit - total_paid)

        creditors.append({
            "supplier_id": supplier.id,
            "supplier_name": supplier.name,
            "balance": balance,
            "status": "OWED" if balance > 0 else "PAID"
        })

    return creditors
