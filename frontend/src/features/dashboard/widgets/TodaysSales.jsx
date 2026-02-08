import { useEffect, useState } from "react";
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

const today = new Date().toLocaleDateString("en-CA");
  const totalToday = sales
  .filter((s) => {
    if (!s.created_at) return false;
    return s.created_at.slice(0, 10) === today;
  })
  .reduce((sum, s) => sum + Number(s.total_amount || 0), 0);



  return (
    <div
      className="card-w flex flex-col gap-sm cursor-pointer"
      onClick={() => navigate("/owner/sales")}
    >
      <h3 className="text-md text-bold">Today’s Sales</h3>

      <div className="text-xl text-bold company-blue">
        KES {totalToday.toFixed(2)}
      </div>

      <span className="text-sm text-muted">View details →</span>
    </div>
  );
}
