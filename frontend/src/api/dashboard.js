// frontend/src/api/dashboard.js
import { apiFetch } from "./client";

/* ================= STOCK ALERTS ================= */

export async function getStockAlerts() {
  const res = await apiFetch("/api/stock/alerts");
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load stock alerts");

  return Array.isArray(data) ? data : [];
}

/* ================= TODAY'S CREDIT SALES ================= */

export async function getDebtors() {
  const res = await apiFetch("/api/customers/debtors");
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load debtors");

  return Array.isArray(data) ? data : [];
}

/* ================= OWNER SALES ================= */

export async function getOwnerSales() {
  const res = await apiFetch("/api/sales/owner");
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load sales");

  return Array.isArray(data) ? data : [];
}
