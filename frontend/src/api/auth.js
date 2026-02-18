// /home/annewaithaka/personalprojects/sme-management-saas/frontend/src/api/auth.js
import { apiFetch } from "./client";

const API = `${import.meta.env.VITE_API_URL}/auth`;


export const loginUser = async (data) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
};

// export const getMe = async () => {
//   const res = await fetch(`${API}/me`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

//   if (!res.ok) throw new Error("Unauthorized");

//   return res.json();
// };

export const getMe = async () => {
  const res = await apiFetch("/auth/me");

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};


export async function registerOrg(data) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}




