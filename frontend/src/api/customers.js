// frontend/src/api/customers.js
import { apiFetch } from "./client";

/* ================= GET CUSTOMERS ================= */

export async function listCustomers(role = "") {
  const endpoint = role
    ? `/api/customers/${role}`
    : "/api/customers";

  const res = await apiFetch(endpoint);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load customers");

  return Array.isArray(data) ? data : [];
}

/* ================= CREATE CUSTOMER ================= */

export async function createCustomer(payload) {
  const res = await apiFetch("/api/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to create customer");

  return data;
}

/* ================= GET PAYMENTS ================= */

export async function getCustomerPayments(customerId) {
  const res = await apiFetch(
    `/api/customers/payments/customer/${customerId}`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to load payments");

  return data;
}

/* ================= RECORD PAYMENT ================= */

export async function recordCustomerPayment(payload) {
  const res = await apiFetch("/api/customers/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to record payment");

  return data;
}
