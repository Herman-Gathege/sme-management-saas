const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
  // always include cookies
  let res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // 🔥 access expired → refresh silently
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // backend sets new access cookie automatically
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
  }

  return res;
}
