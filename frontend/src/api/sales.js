import { apiFetch } from "./client";


// -------------------
// Owner sales list
// -------------------
export const listOwnerSales = async () => {
  const res = await apiFetch("/api/sales/owner");

  if (!res.ok) throw new Error("Failed to load sales");

  return res.json();
};


// -------------------
// Stock for staff
// -------------------
export const listStockForSale = async () => {
  const res = await apiFetch("/api/stock/staff");

  if (!res.ok) throw new Error("Failed to fetch stock");

  return res.json();
};


// -------------------
// Customers
// -------------------
export const listCustomers = async () => {
  const res = await apiFetch("/api/customers");

  if (!res.ok) throw new Error("Failed to fetch customers");

  return res.json();
};


// -------------------
// Create sale
// -------------------
export const createSale = async (payload) => {
  const res = await apiFetch("/api/sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Sale failed");
  }

  return res.json();
};
