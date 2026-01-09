import { useAuth } from "../../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <span>{user.full_name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
