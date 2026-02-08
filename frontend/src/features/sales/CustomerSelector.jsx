//frontend/src/features/sales/CustomerSelector.jsx
export default function CustomerSelector({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  onAddCustomer,
}) {
  return (
    <div className="customer-selector">
      <label>Customer</label>

      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
      >
        <option value="">Select customer</option>

        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {typeof c.balance === "number" &&
              ` — KES ${c.balance.toFixed(2)}`}
          </option>
        ))}
      </select>

      <button type="button" onClick={onAddCustomer}>
        + Add Customer
      </button>
    </div>
  );
}
