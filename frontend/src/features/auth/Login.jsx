import { useState } from "react";
import { loginUser } from "../../api/auth";
import styles from "./AuthForm.module.css"; // CSS module for styling

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
      const res = await loginUser({ email, password });

      if (res.access_token) {
        // Save token only
        localStorage.setItem("token", res.access_token);

        // Redirect to generic dashboard
        window.location.href = "/dashboard";
      } else {
        setError(res.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error or server unavailable. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.inputField}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.inputField}
        required
      />

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className={styles.errorText}>{error}</p>}
    </form>
  );
}
