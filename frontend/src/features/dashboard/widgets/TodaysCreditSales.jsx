import { useEffect, useState } from "react";
import widget from "./DashboardWidget.module.css";
import { useNavigate } from "react-router-dom";

export default function TodaysCreditSales() {
  const [debtors, setDebtors] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDebtors = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/api/customers/debtors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setDebtors(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDebtors();
  }, [API_BASE]);

  // Total credit owed (sum of balances > 0)
  const totalCredit = debtors
    .filter((c) => Number(c.balance) > 0)
    .reduce((sum, c) => sum + Number(c.balance), 0);

  // Count of customers who owe money
  const customersOwing = debtors.filter((c) => Number(c.balance) > 0).length;

  return (
    <div
      className={widget.widget}
      onClick={() => navigate("/owner/customers/debtors")}
    >
      <h3 className={widget.title}>Credit Sales</h3>

      <div className={widget.content}>
        KES {totalCredit.toFixed(2)}
        {customersOwing > 0 && (
          <p style={{ fontSize: "0.85rem", marginTop: "0.1rem", color: "#d84a4a", marginLeft: "auto" }}>
            {customersOwing} customer{customersOwing > 1 ? "s" : ""} owe(s) you
          </p>
        )}
      </div>

      <div className={widget.footer}>View debtors →</div>
    </div>
  );
}
