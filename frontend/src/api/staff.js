// frontend/src/api/staff.js
import { apiFetch } from "./client";

const API = "/api/staff";

// List
export const listStaff = async () => {
  const res = await apiFetch(API);
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
};

// Create
export const createStaff = async (data) => {
  const res = await apiFetch(API, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create staff");
  return res.json();
};

// Update
export const updateStaff = async (id, data) => {
  const res = await apiFetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update staff");
  return res.json();
};

// Deactivate
export const deactivateStaff = async (id) => {
  const res = await apiFetch(`${API}/${id}/deactivate`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to deactivate staff");
  return res.json();
};

// Reactivate
export const reactivateStaff = async (id) => {
  const res = await apiFetch(`${API}/${id}/reactivate`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to reactivate staff");
  return res.json();
};

// Reset password
export const resetStaffPassword = async (id) => {
  const res = await apiFetch(`${API}/${id}/password/reset`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to reset password");
  return res.json();
};

// Update password (for staff changing their own password)
export async function updateStaffPassword(userId, newPassword) {
  const res = await apiFetch(`/api/staff/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify({ new_password: newPassword }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Password update failed");

  return data;
}