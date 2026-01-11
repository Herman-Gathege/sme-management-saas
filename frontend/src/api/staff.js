const API = "http://127.0.0.1:5000/api/staff";

// Helper to get token
const getToken = () => localStorage.getItem("token");

// List all staff
export const listStaff = async (token = getToken()) => {
  const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch staff");
  }
  return res.json();
};

// Create new staff
export const createStaff = async (data, token = getToken()) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to create staff");
  }
  return res.json();
};

// Update staff info
export const updateStaff = async (id, data, token = getToken()) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to update staff");
  }
  return res.json();
};

// Deactivate staff
export const deactivateStaff = async (id, token = getToken()) => {
  const res = await fetch(`${API}/${id}/deactivate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to deactivate staff");
  }
  return res.json();
};

// Reactivate staff (NEW)
export const reactivateStaff = async (id, token = getToken()) => {
  const res = await fetch(`${API}/${id}/reactivate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to reactivate staff");
  }
  return res.json();
};

// Reset staff password
export const resetStaffPassword = async (id, token = getToken()) => {
  const res = await fetch(`${API}/${id}/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to reset password");
  }
  return res.json(); // { temporary_password: "..." }
};
