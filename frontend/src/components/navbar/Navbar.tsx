/**
 * AI-SUPERCOMMENT
 * COMPONENT: Navbar
 *
 * RUOLI:
 * - <Link> => navigazione
 * - <button> => azioni o UI control
 *
 * INVARIANTI:
 * - nessun button con classi da link
 * - cart gestito da NavCartButton
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../lib/authApi";
import ModeSwitch from "./ModeSwitch";
import NavCartButton from "./NavCartButton";
import { useAuthStore } from "../../store/auth.store";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const clearUser = useAuthStore((s) => s.clearUser);

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    clearUser();
    localStorage.removeItem("user_mode");
    navigate("/", { replace: true });
  }

  return (
    <nav className="wd-navbar wd-navbar-neon">
      {/* LOGO */}
      <Link to="/" className="wd-navbar-logo" aria-label="WebOnDay Home">
        <img src="/icon/favicon.ico" alt="WebOnDay logo" className="moka-icon" />
        <div className="logo-text">
          <span className="we">We</span>
          <span className="webonday">WebOnDay</span>
        </div>
      </Link>

      {/* MOBILE MENU TOGGLE */}
      <button
        type="button"
        className="navbar-menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Apri menu"
      >
        ☰
      </button>

      {/* RIGHT AREA */}
      <div className={`nav-right ${open ? "open" : ""}`}>
        
        {user && <ModeSwitch />}
        <Link to="/solution" className="wd-navbar-link">
  Soluzioni
</Link>
        {ready && !user && (
          <Link to="/user/login" className="wd-navbar-link">
            Accedi
          </Link>
        )}

        {ready && user && (
          <button
            type="button"
            onClick={handleLogout}
            className="navbar-logout-btn"
          >
            Logout
          </button>
        )}

        {/* CART TOGGLE */}
        <NavCartButton />
      </div>
    </nav>
  );
}
