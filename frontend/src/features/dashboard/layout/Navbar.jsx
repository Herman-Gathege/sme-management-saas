import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { FiMaximize, FiMinimize } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement,
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!user) return <header className="navbar" />;

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
    <header className="navbar flex justify-between items-center p-md">
      {/* LEFT */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="btn "
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
      </button>

      {/* CENTER */}
      <div className="flex flex-col items-center text-sm">
        <span className="text-muted">{formattedDate}</span>
        <span className="text-bold">{formattedTime}</span>
      </div>

      {/* RIGHT */}
      <div className="relative">
        <div className="avatar" onClick={() => setOpen((o) => !o)}>
          {user.full_name.charAt(0).toUpperCase()}
        </div>

        {open && (
          <div className="dropdown">
            <button className="dropdown-item" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
