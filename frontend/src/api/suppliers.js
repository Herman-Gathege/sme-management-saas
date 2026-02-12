import { apiFetch } from "./client";

const SUPPLIERS_API = "/api/suppliers";
const PURCHASES_API = "/api/supplier-purchases";
const PAYMENTS_API = "/api/suppliers/payments";


// ----------------- Suppliers -----------------

export const listSuppliers = async () => {
  const res = await apiFetch(SUPPLIERS_API);
  if (!res.ok) throw new Error("Failed to fetch suppliers");
  return res.json();
};

export const createSupplier = async (data) => {
  const res = await apiFetch(SUPPLIERS_API, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create supplier");
  return res.json();
};

export const updateSupplier = async (id, data) => {
  const res = await apiFetch(`${SUPPLIERS_API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update supplier");
  return res.json();
};

export const deactivateSupplier = async (id) => {
  const res = await apiFetch(`${SUPPLIERS_API}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to deactivate supplier");
  return res.json();
};


// ----------------- Purchases -----------------

export const listPurchases = async () => {
  const res = await apiFetch(PURCHASES_API);
  if (!res.ok) throw new Error("Failed to fetch purchases");
  return res.json();
};

export const createPurchase = async (data) => {
  const res = await apiFetch(PURCHASES_API, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create purchase");
  return res.json();
};


// ----------------- Payments -----------------

export const listPayments = async () => {
  const res = await apiFetch(PAYMENTS_API);
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
};

export const createPayment = async (data) => {
  const res = await apiFetch(PAYMENTS_API, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create payment");
  return res.json();
};
