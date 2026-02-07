// frontend/src/api/suppliers.js

const API_BASE = import.meta.env.VITE_API_URL;
const SUPPLIERS_API = `${API_BASE}/api/suppliers`;
const PURCHASES_API = `${API_BASE}/api/supplier-purchases`;
const PAYMENTS_API = `${API_BASE}/api/suppliers/payments`;

const getToken = () => localStorage.getItem("token");

// ----------------- Suppliers -----------------
export const listSuppliers = async () => {
  try {
    const res = await fetch(SUPPLIERS_API, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to fetch suppliers");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to fetch suppliers");
  }
};

export const createSupplier = async (data) => {
  try {
    const res = await fetch(SUPPLIERS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create supplier");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to create supplier");
  }
};

export const updateSupplier = async (id, data) => {
  try {
    const res = await fetch(`${SUPPLIERS_API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to update supplier");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to update supplier");
  }
};

export const deactivateSupplier = async (id) => {
  try {
    const res = await fetch(`${SUPPLIERS_API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to deactivate supplier");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to deactivate supplier");
  }
};

// ----------------- Purchases -----------------
export const listPurchases = async () => {
  try {
    const res = await fetch(PURCHASES_API, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to fetch purchases");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to fetch purchases");
  }
};

/**
 * Create a new purchase
 * data = {
 *   supplier_id: number,
 *   payment_method: string, // cash / mpesa / bank / credit
 *   notes: string,
 *   items: [{ name, sku, category, quantity, unit_price, min_stock_level }]
 * }
 */
export const createPurchase = async (data) => {
  try {
    const res = await fetch(PURCHASES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create purchase");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to create purchase");
  }
};

// ----------------- Payments -----------------
export const listPayments = async () => {
  try {
    const res = await fetch(PAYMENTS_API, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to fetch payments");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to fetch payments");
  }
};

/**
 * Create a new payment
 * data = {
 *   supplier_id: number,
 *   user_id: number,
 *   amount: number,
 *   payment_method: string, // cash / mpesa / bank
 *   notes: string
 * }
 */
export const createPayment = async (data) => {
  try {
    const res = await fetch(PAYMENTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create payment");
    }
    return res.json();
  } catch (err) {
    throw new Error(err.message || "Failed to create payment");
  }
};
