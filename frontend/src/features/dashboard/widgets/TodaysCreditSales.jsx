import { useEffect, useState } from "react";
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

  const totalCredit = debtors
    .filter((c) => Number(c.balance) > 0)
    .reduce((sum, c) => sum + Number(c.balance), 0);

  const customersOwing = debtors.filter(
    (c) => Number(c.balance) > 0
  ).length;

  return (
    <div
      className="card-w flex flex-col gap-sm cursor-pointer "
      onClick={() => navigate("/owner/customers/debtors")}
    >
      <h3 className="text-md text-bold">Credit Sales</h3>

      <div className="text-xl text-bold company-blue">
        KES {totalCredit.toFixed(2)}
      </div>

      {customersOwing > 0 && (
        <span className="text-sm text-error">
          {customersOwing} customer{customersOwing > 1 ? "s" : ""} owe you
        </span>
      )}

      <span className="text-sm text-muted">View debtors →</span>
    </div>
  );
}
