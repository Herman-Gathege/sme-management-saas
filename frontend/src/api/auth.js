//frontend/src/api/auth.js

const API = `${import.meta.env.VITE_API_URL}/auth`;

// 🔐 login now just sets cookies automatically
export const loginUser = async (data) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
};


// 🔐 register unchanged except cookies
export async function registerOrg(data) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");

  return res.json();
}


// 🔐 now no token needed
export const getMe = async () => {
  const res = await fetch(`${API}/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};


// 🔐 silent refresh helper (used later automatically)
export const refreshToken = async () => {
  await fetch(`${API}/refresh`, {
    method: "POST",
    credentials: "include",
  });
};
