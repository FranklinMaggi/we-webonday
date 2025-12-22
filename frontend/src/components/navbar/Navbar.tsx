import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartStore } from "../../lib/cartStore";
import { uiBus } from "../../lib/uiBus";
import { logout } from "../../lib/authApi";
import ModeSwitch from "./ModeSwitch";
import { useAuthStore } from "../../store/auth.store";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const items = cartStore((s) => s.items);
  const cartCount = items.length;

  // 🔐 AUTH STATE
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const clearUser = useAuthStore((s) => s.clearUser);

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();                // invalida cookie server
    clearUser();                   // pulisce store client
    localStorage.removeItem("user_mode");

    navigate("/user/login", { replace: true });
  }

  return (
    <nav className="wd-navbar wd-navbar-neon">
      {/* LOGO */}
      <Link to="/" className="wd-navbar-logo" aria-label="WebOnDay Home">
        <img
          src="/icon/favicon.ico"
          alt="WebOnDay logo"
          className="moka-icon"
        />
        <div className="logo-text">
          <span className="we">We</span>
          <span className="webonday">WebOnDay</span>
        </div>
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        ☰
      </button>

      {/* RIGHT LINKS */}
      <div className={`nav-right ${open ? "open" : ""}`}>
        <Link to="/vision" className="wd-navbar-link">Vision</Link>
        <Link to="/mission" className="wd-navbar-link">Mission</Link>

        {/* MODE SWITCH */}
        {user && <ModeSwitch />}

        {/* AUTH */}
        {ready && !user && (
          <Link to="/user/login" className="wd-navbar-link">
            Accedi
          </Link>
        )}

        {ready && user && (
          <button
            type="button"
            onClick={handleLogout}
            className="wd-navbar-link"
          >
            Logout
          </button>
        )}

        {/* CART */}
        <button
          type="button"
          onClick={() => uiBus.emit("cart:toggle")}
          className="wd-navbar-link wd-link-accent nav-cart-toggle"
          aria-label="Apri carrello"
        >
          Carrello <span className="nav-cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
