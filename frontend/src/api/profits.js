//frontend/src/api/profits.js
import { apiFetch } from "./client";


/**
 * =========================
 * PROFIT SUMMARY (charts)
 * =========================
 * filter: today | week | month | year | custom
 */
export async function getProfitSummary({
  filter = "today",
  startDate = null,
  endDate = null,
} = {}) {
  const params = new URLSearchParams();

  if (filter) params.append("filter", filter);
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const res = await apiFetch(`/profits/summary?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch profit summary");
  }

  return res.json();
}


/**
 * =========================
 * PROFIT WIDGET (dashboard)
 * =========================
 */
export async function getProfitWidget() {
  const res = await apiFetch("/profits/widget");

  if (!res.ok) {
    throw new Error("Failed to fetch profit widget");
  }

  return res.json();
}