//frontend/src/api/client.js

const API_BASE = import.meta.env.VITE_API_URL;


// central fetch wrapper
export async function apiFetch(url, options = {}) {
  let res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // 🔥 if access expired → try silent refresh
  if (res.status === 401) {
    await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    // retry original request
    res = await fetch(`${API_BASE}${url}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  }

  return res;
}
