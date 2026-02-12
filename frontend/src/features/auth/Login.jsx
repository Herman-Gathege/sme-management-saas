// src/features/auth/Login.jsx
import { useState } from "react";
import { loginUser } from "../../api/auth";
// import styles from "./AuthForm.module.css"; // CSS module for styling

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await loginUser({ email, password });

  //     if (res.access_token) {
  //       // Save token only
  //       localStorage.setItem("token", res.access_token);
        

  //       // Redirect to generic dashboard
  //       window.location.href = "/dashboard";
  //     } else {
  //       setError(res.error || "Login failed. Please try again.");
  //     }
  //   } catch (err) {
  //     setError("Network error or server unavailable. Please try again later.");
  //     console.error("Login error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = await loginUser({ email, password });

    // ✅ save both tokens once
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh", data.refresh_token);

    window.location.href = "/dashboard";
  } catch (err) {
    setError("Invalid email or password");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  // return (
  //   <form className={styles.formContainer} onSubmit={handleSubmit}>
  //     <h2 className={styles.formTitle}>Login</h2>

  //     <input
  //       type="email"
  //       placeholder="Email"
  //       value={email}
  //       onChange={(e) => setEmail(e.target.value)}
  //       className={styles.inputField}
  //       required
  //     />

  //     <input
  //       type="password"
  //       placeholder="Password"
  //       value={password}
  //       onChange={(e) => setPassword(e.target.value)}
  //       className={styles.inputField}
  //       required
  //     />

  //     <button type="submit" className={styles.submitButton} disabled={loading}>
  //       {loading ? "Logging in..." : "Login"}
  //     </button>

  //     {error && <p className={styles.errorText}>{error}</p>}
  //   </form>
  // );

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
