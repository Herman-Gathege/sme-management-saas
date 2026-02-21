// //frontend/src/api/client.js

const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}, _retry = false) {
  let access = localStorage.getItem("token");

  const makeRequest = (token) =>
    fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

  let res = await makeRequest(access);

  if ((res.status === 401 || res.status === 403) && !_retry) {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
      localStorage.clear();
      window.location.href = "/login";
      return res;
    }

    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refresh}`,
      },
    });

    if (!refreshRes.ok) {
      localStorage.clear();
      window.location.href = "/login";
      return res;
    }

    const data = await refreshRes.json();
    localStorage.setItem("token", data.access_token);

    // retry once ONLY
    return apiFetch(url, options, true);
  }

  return res;
}
