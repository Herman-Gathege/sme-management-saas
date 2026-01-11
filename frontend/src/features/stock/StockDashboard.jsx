// frontend/src/features/stock/StockDashboard.jsx
import { Outlet } from "react-router-dom";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

// -----------------------------
// Nested Views
// -----------------------------
export function StockList() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Stock Items</h2>
      <p>List of all stock items.</p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Item</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Quantity</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Example Item 1</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>50</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>$100</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Example Item 2</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>20</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>$200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function StockAdd() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Stock Item</h2>
      <p>Form to add a new stock item will appear here.</p>
    </div>
  );
}

export function StockHistory() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Stock History</h2>
      <p>Stock change logs will appear here.</p>
    </div>
  );
}

// -----------------------------
// Stock Dashboard Layout
// -----------------------------
export default function StockDashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
