// frontend/src/features/dashboard/widgets/TodaysSales.jsx
import { useEffect, useState } from "react";

export default function TodaysSales() {
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const fetchSales = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/sales/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch sales");
      setSales(data);
    } catch (err) {
      setMessage(err.message);
      console.error(err);
    }
  };

  fetchSales();
}, []);


  const totalToday = sales.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>Today's Sales</h3>
      <p>Total sales: KES {totalToday.toFixed(2)}</p>
      {/* {sales.slice(0, 5).map((s) => (
        <p key={s.sale_id}>
          {s.staff} sold KES {s.total_amount.toFixed(2)}
        </p>
      ))}
      {sales.length > 5 && <p>...and {sales.length - 5} more</p>} */}
    </div>
  );
}
