#backend/app/modules/customers/services.py
from sqlalchemy import func
from app.models.customer import Customer
from app.models.sale import Sale
from app.extensions import db


def get_debtors_summary(org_id):
    """
    Debtors = customers who owe us money
    Balance = sum of CREDIT sales per customer
    """

    results = (
        db.session.query(
            Customer.id,
            Customer.name,
            Customer.business_name,
            func.coalesce(func.sum(Sale.total_amount), 0).label("balance")
        )
        .outerjoin(
            Sale,
            (Sale.customer_id == Customer.id)
            & (Sale.organization_id == org_id)
            & (Sale.payment_method == "credit")  # ✅ Only include credit sales
        )
        .filter(
            Customer.organization_id == org_id,
            Customer.is_active == True,
            Customer.role == "debtor"
        )
        .group_by(Customer.id)
        .all()
    )

    return [
        {
            "id": r.id,
            "full_name": f"{r.name} ({r.business_name})" if r.business_name else r.name,  # ✅ Use full_name
            "balance": float(r.balance)
        }
        for r in results
    ]


def get_creditors_summary(org_id):
    """
    Creditors = people we owe money to
    For now balance = manual / future purchase logic
    (kept symmetric with debtors)
    """

    results = (
        db.session.query(
            Customer.id,
            Customer.name,
            Customer.business_name,
            func.coalesce(func.sum(Sale.total_amount), 0).label("balance")
        )
        .outerjoin(
            Sale,
            (Sale.customer_id == Customer.id)
            & (Sale.organization_id == org_id)
        )
        .filter(
            Customer.organization_id == org_id,
            Customer.is_active == True,
            Customer.role == "creditor"
        )
        .group_by(Customer.id)
        .all()
    )

    return [
        {
            "id": r.id,
            "full_name": r.name,
            "business_name": r.business_name,
            "balance": float(r.balance)
        }
        for r in results
    ]
