import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StockAlerts.module.css"; // correct import

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
  }, []);

  const outOfStock = alerts.filter((i) => i.quantity === 0).length;
  const lowStock = alerts.filter(
    (i) => i.quantity > 0 && i.quantity <= i.min_stock_level
  ).length;

  if (alerts.length === 0) return null;

  return (
    <div className={styles.widgetCard} onClick={() => navigate("/owner/stock")}>
  <h3 className={styles.title}>Stock Alerts</h3>

  <div className={styles.alertsRow}>
    {outOfStock > 0 && (
      <p className={styles.danger}>
        🔴 {outOfStock} out of stock
      </p>
    )}
    {lowStock > 0 && (
      <p className={styles.warning}>
        🟧 {lowStock} running low
      </p>
    )}
  </div>

  <p className={styles.cta}>View stock →</p>
</div>


  );
}
