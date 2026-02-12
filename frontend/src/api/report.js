
//frontend/src/api/report.js
import { apiFetch } from "./client";

const REPORTS_API = "/api/reports/sales";

export const getSalesReport = async (range = "all") => {
  let query = "";

  if (range === "today") query = "?range=today";
  else if (range === "month") query = "?range=month";

  const res = await apiFetch(`${REPORTS_API}${query}`);

  if (!res.ok) throw new Error("Failed to load reports");

  return res.json();
};
