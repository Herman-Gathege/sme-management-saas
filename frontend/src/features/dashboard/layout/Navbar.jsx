import { useState } from "react";
import styles from "./DashboardLayout.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className={styles.navbar}>
      <div />

      <div className={styles.avatarWrapper}>
        <div
          className={styles.avatar}
          onClick={() => setOpen(!open)}
        >
          U
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
