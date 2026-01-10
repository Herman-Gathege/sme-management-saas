//frontend/src/features/auth/Register.jsx

import { useState } from "react";
import { registerOrg } from "../../api/auth";
import styles from "./AuthForm.module.css"; // import CSS module

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
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <input placeholder="Business Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
      <input placeholder="Owner Email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
      <input placeholder="Owner Phone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
      <input type="password" placeholder="Password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}
