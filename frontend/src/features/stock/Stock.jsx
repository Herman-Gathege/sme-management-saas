// frontend/src/features/stock/Stock.jsx
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function Stock() {
  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>
        <h2>Stock Management</h2>
        <p>This is where owner can view and manage stock items.</p>

        {/* Placeholder table */}
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
    </DashboardLayout>
  );
}
