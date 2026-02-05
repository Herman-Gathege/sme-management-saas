import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DashboardLayout.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  // hooks FIRST
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );

  // update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // track fullscreen changes (esc, f11, button)
  useEffect(() => {
    const handler = () =>
      setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", handler);
    return () =>
      document.removeEventListener("fullscreenchange", handler);
  }, []);

  // user not loaded
  if (!user) return <header className={styles.navbar} />;

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className={styles.navbar}>
      {/* LEFT */}
      <div className={styles.left}>
        <button
          type="button"
          onClick={toggleFullscreen}
          className={styles.fullscreenBtn}
          title="Toggle Fullscreen"
        >
          {isFullscreen ? "⤫" : "⛶"}
        </button>
      </div>

      {/* CENTER */}
      <div className={styles.timeWrapper}>
        <span className={styles.date}>{formattedDate}</span>
        <span className={styles.time}>{formattedTime}</span>
      </div>

      {/* RIGHT */}
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
