//frontend/src/api/staff.js

import { apiFetch } from "./client";


// List all staff
export const listStaff = async () => {
  const res = await apiFetch("/api/staff");
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
};


// Create new staff
export const createStaff = async (data) => {
  const res = await apiFetch("/api/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create staff");
  return res.json();
};


// Update staff
export const updateStaff = async (id, data) => {
  const res = await apiFetch(`/api/staff/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update staff");
  return res.json();
};


// Deactivate
export const deactivateStaff = async (id) => {
  const res = await apiFetch(`/api/staff/${id}/deactivate`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to deactivate staff");
  return res.json();
};


// Reactivate
export const reactivateStaff = async (id) => {
  const res = await apiFetch(`/api/staff/${id}/reactivate`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to reactivate staff");
  return res.json();
};


// Reset password
export const resetStaffPassword = async (id) => {
  const res = await apiFetch(`/api/staff/${id}/password/reset`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to reset password");
  return res.json();
};
