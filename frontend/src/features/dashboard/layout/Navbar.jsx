import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DashboardLayout.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  if (!user) return null;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  // Format date & time nicely
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className={styles.navbar}>
      <div className={styles.timeWrapper}>
        <span className={styles.date}>{formattedDate}</span>
        <span className={styles.time}>{formattedTime}</span>
      </div>

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
