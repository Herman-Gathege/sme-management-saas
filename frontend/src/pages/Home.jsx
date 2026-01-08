import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5rem" }}>
      <h1>Welcome to SmartShop</h1>
      <p>Your simple SME management system</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/register")} style={{ padding: "1rem 2rem" }}>Register</button>
        <button onClick={() => navigate("/login")} style={{ padding: "1rem 2rem" }}>Login</button>
      </div>
    </div>
  );
}
