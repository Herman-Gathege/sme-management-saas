const API_BASE = import.meta.env.VITE_API_URL;

let accessToken = null;

// allow AuthContext to update token
export const setAccessToken = (token) => {
  accessToken = token;
};

export async function apiFetch(url, options = {}) {
  let res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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
      const data = await refreshRes.json();
      accessToken = data.access_token;

      res = await fetch(`${API_BASE}${url}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...(options.headers || {}),
        },
        ...options,
      });
    }
  }

  return res;
}
