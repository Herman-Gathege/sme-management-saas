# backend/app/modules/customers/services.py
from app.models.customer import Customer
from app.models.sale import Sale
from app.models.payment import Payment
from app.extensions import db

def get_debtors_summary(org_id):
    """
    Debtors = customers who owe us money
    Balance = sum of credit sales per customer - sum of payments
    Only include those with balance > 0
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

        if balance > 0:  # Only include actual debtors
            debtors.append({
                "id": customer.id,
                "full_name": f"{customer.name} ({customer.business_name})" if customer.business_name else customer.name,
                "balance": balance,
                "status": "OWED"
            })

    return debtors


def get_creditors_summary(org_id):
    """
    Creditors = customers we owe money
    Balance = sum of purchases/payables - payments made
    Only include those with balance > 0
    """
    creditors = []

    customers = Customer.query.filter_by(
        organization_id=org_id,
        is_active=True,
        role="creditor"
    ).all()

    for customer in customers:
        total_credit = db.session.query(
            db.func.coalesce(db.func.sum(Sale.total_amount), 0)
        ).filter(
            Sale.customer_id == customer.id,
            Sale.organization_id == org_id,
            Sale.payment_method == "credit"  # adjust if needed
        ).scalar()

        total_payments = db.session.query(
            db.func.coalesce(db.func.sum(Payment.amount), 0)
        ).filter(
            Payment.customer_id == customer.id,
            Payment.organization_id == org_id
        ).scalar()

        balance = float(total_credit - total_payments)

        if balance > 0:  # Only include actual creditors
            creditors.append({
                "id": customer.id,
                "full_name": f"{customer.name} ({customer.business_name})" if customer.business_name else customer.name,
                "balance": balance,
                "status": "OWED"
            })

    return creditors
