//frontend/src/features/auth/Login.jsx

import { useState } from "react";
import { loginUser } from "../../api/auth";
import styles from "./AuthForm.module.css"; // import CSS module

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser({ email, password });
    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("org_id", res.organization_id);
      window.location.href = "/dashboard";
    } else {
      setError(res.error);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
