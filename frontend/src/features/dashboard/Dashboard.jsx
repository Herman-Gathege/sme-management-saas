import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({
    role: "",
    org_id: "",
    token: "",
  });

  useEffect(() => {
    // Grab token & user info from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const org_id = localStorage.getItem("org_id");

    if (!token) {
      // Not logged in → redirect to login
      window.location.href = "/login";
    } else {
      setUserInfo({ token, role, org_id });
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to your Dashboard</h1>
      <p>
        <strong>Organization ID:</strong> {userInfo.org_id}
      </p>
      <p>
        <strong>Your Role:</strong> {userInfo.role}
      </p>
      <p>
        Auth Token (JWT): {userInfo.token ? userInfo.token.slice(0, 20) + "..." : ""}
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h2>Modules</h2>
        <ul>
          <li>Sales (coming soon)</li>
          <li>Stock (coming soon)</li>
          <li>Staff (coming soon)</li>
          <li>Reports (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}
