// src/features/auth/Login.jsx
import { useState } from "react";
import { loginUser } from "../../api/auth";
// import styles from "./AuthForm.module.css"; // CSS module for styling

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await loginUser({ email, password });

    // Cookies are now set automatically by backend
    window.location.href = "/dashboard";
  } catch (err) {
    setError("Invalid email or password.");
  } finally {
    setLoading(false);
  }
};


  

  return (
  <div className="auth-page">
    <form className="auth-card card form-stack" onSubmit={handleSubmit}>
      <h2 className="text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        required
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        required
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="text-error text-center">{error}</p>}
    </form>
  </div>
);

}
