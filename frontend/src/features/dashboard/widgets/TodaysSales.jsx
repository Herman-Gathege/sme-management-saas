import { useEffect, useState } from "react";
import widget from "./DashboardWidget.module.css";
import { useNavigate } from "react-router-dom";

export default function TodaysSales() {
  const [sales, setSales] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/api/sales/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setSales(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSales();
  }, [API_BASE]);

  const today = new Date().toISOString().split("T")[0];

  const todaysSales = sales.filter((sale) => {
    const saleDate = sale.created_at.split("T")[0];
    return saleDate === today;
  });


    const totalToday = todaysSales.reduce(
    (sum, s) => sum + Number(s.total_amount || 0),
    0
  );


  return (
    <div className={widget.widget}
     onClick={() => navigate("/owner/sales")}
    >
      <h3 className={widget.title}>Today’s Sales</h3>

      <div className={widget.content}>
        KES {totalToday.toFixed(2)}
      </div>

      <div className={widget.footer}>View details →</div>
    </div>
  );
}
