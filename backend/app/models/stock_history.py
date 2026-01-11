from models.stock_history import StockHistory
from models.user import User  # if you need user info
import json
from extensions import db

# --- POST /add_stock ---
history = StockHistory(
    stock_id=stock.id,
    organization_id=user["organization_id"],
    user_id=user["id"],
    action="created",
    details=json.dumps({"name": stock.name, "quantity": stock.quantity}),
)
db.session.add(history)
db.session.commit()

# --- PATCH /update_stock ---
changes = {}
for field in ["name", "sku", "category", "quantity", "unit_price", "min_stock_level"]:
    old = getattr(stock, field)
    new = data.get(field, old)
    if old != new:
        changes[field] = {"old": old, "new": new}
        setattr(stock, field, new)

if changes:
    history = StockHistory(
        stock_id=stock.id,
        organization_id=organization_id,
        user_id=user["id"],
        action="updated",
        details=json.dumps(changes),
    )
    db.session.add(history)

db.session.commit()

# --- DELETE /delete_stock ---
history = StockHistory(
    stock_id=stock.id,
    organization_id=organization_id,
    user_id=user["id"],
    action="deleted",
    details=json.dumps({
        "name": stock.name,
        "quantity": stock.quantity,
        "unit_price": stock.unit_price,
        "category": stock.category
    }),
)
db.session.add(history)
db.session.commit()
db.session.delete(stock)
db.session.commit()
