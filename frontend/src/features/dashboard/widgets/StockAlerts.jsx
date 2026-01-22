import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import widget from "./DashboardWidget.module.css";
import styles from "./StockAlerts.module.css";

export default function StockAlerts() {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_BASE}/api/stock/alerts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(() => {});
  }, [API_BASE]);

  const outOfStock = alerts.filter((i) => i.quantity === 0).length;
  const lowStock = alerts.filter(
    (i) => i.quantity > 0 && i.quantity <= i.min_stock_level
  ).length;

  // if (alerts.length === 0) return null;

  return (
    <div
      className={widget.widget}
      onClick={() => navigate("/owner/stock")}
    >
      <h3 className={widget.title}>Stock Alerts</h3>

      <div className={styles.alertsRow}>
        {outOfStock > 0 && (
          <span className={styles.danger}>
            🔴 {outOfStock} item(s) out of stock
          </span>
        )}
        {lowStock > 0 && (
          <span className={styles.warning}>
            🟧 {lowStock} item(s) running low
          </span>
        )}
        {outOfStock === 0 && lowStock === 0 && (
          <span className={styles.ok}>
            ✅ All stock levels look good today
          </span>
        )}
      </div>

      <div className={widget.footer}>View stock →</div>
    </div>
  );
}
