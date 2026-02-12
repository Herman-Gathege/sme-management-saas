// frontend/src/api/stock.js
import { apiFetch } from "./client";

// GET all stock
export async function listStock() {
  const res = await apiFetch("/api/stock");
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load stock");

  return data;
}

// GET single stock
export async function getStock(id) {
  const res = await apiFetch(`/api/stock/${id}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load stock item");

  return data;
}

// CREATE stock
export async function createStock(payload) {
  const res = await apiFetch("/api/stock", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to create stock");

  return data;
}

// UPDATE stock
export async function updateStock(id, payload) {
  const res = await apiFetch(`/api/stock/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to update stock");

  return data;
}

// DELETE stock
export async function deleteStock(id) {
  const res = await apiFetch(`/api/stock/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to delete stock");

  return data;
}

// GET history
export async function getStockHistory() {
  const res = await apiFetch("/api/stock/history");
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to fetch stock history");

  return data;
}
