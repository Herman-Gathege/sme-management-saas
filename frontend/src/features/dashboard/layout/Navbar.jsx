import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DashboardLayout.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <header className={styles.navbar}>
      <div className={styles.avatarWrapper}>
        <div
          className={styles.avatar}
          onClick={() => setOpen(!open)}
        >
          {user.full_name.charAt(0).toUpperCase()}
        </div>

        {open && (
          <div className={styles.dropdown}>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
