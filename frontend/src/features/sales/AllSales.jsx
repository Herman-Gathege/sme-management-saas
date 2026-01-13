// frontend/src/features/sales/AllSales.jsx
import { useEffect, useState } from "react";

export default function AllSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5000/api/sales/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <p>Loading sales...</p>;

  return (
    <div>
      <h2>All Sales</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Staff</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sales) &&
            sales.map((sale) => (
              <tr key={sale.sale_id}>
                <td>{sale.sale_id}</td>
                <td>{sale.staff}</td>
                <td>
                  {Array.isArray(sale.items) && sale.items.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                      {sale.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} — {item.quantity} × KES{" "}
                          {item.unit_price.toFixed(2)} ={" "}
                          <strong>KES {item.line_total.toFixed(2)}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <em>No items</em>
                  )}
                </td>
                <td>KES {sale.total_amount.toFixed(2)}</td>
                <td>{new Date(sale.created_at).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
