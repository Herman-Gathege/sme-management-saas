//frontend/src/features/auth/Register.jsx

import { useState } from "react";
import { registerOrg } from "../../api/auth";
// import styles from "./AuthForm.module.css"; // import CSS module

export default function Register() {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerOrg({
      name,
      owner_name: ownerName,
      owner_email: ownerEmail,
      owner_phone: ownerPhone,
      owner_password: ownerPassword,
    });
    setMessage(res.message || res.error);
  };

  

  return (
  <div className="auth-page">
    <form className="auth-card card form-stack" onSubmit={handleSubmit}>
      <h2 className="text-center">Create Account</h2>

      <input
        className="input"
        placeholder="Business Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="input"
        placeholder="Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        required
      />

      <input
        type="email"
        className="input"
        placeholder="Owner Email"
        autoComplete="email"
        value={ownerEmail}
        onChange={(e) => setOwnerEmail(e.target.value)}
        required
      />

      <input
        type="tel"
        className="input"
        placeholder="Owner Phone"
        autoComplete="tel"
        value={ownerPhone}
        onChange={(e) => setOwnerPhone(e.target.value)}
        required
      />

      <input
        type="password"
        className="input"
        placeholder="Password"
        autoComplete="new-password"
        value={ownerPassword}
        onChange={(e) => setOwnerPassword(e.target.value)}
        required
      />

      <button type="submit" className="btn btn-primary">
        Register
      </button>

      {message && (
        <p className="text-center text-error mt-md">{message}</p>
      )}
    </form>
  </div>
);

}
