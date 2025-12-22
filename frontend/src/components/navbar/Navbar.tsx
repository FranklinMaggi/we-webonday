// frontend/src/components/navbar/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { cartStore } from "../../lib/cartStore"; // hook zustand
import { uiBus } from "../../lib/uiBus";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { logout } from "../../lib/authApi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const items = cartStore((s) => s.items);
  const cartCount = items.length;

  const { user, loading } = useCurrentUser();

  async function handleLogout() {
    await logout();
    window.location.href = "/user/login";
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

        {/* AUTH SECTION */}
        {!loading && !user && (
          <Link to="/user/login" className="wd-navbar-link">
            Accedi
          </Link>
        )}

        {!loading && user && (
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
          title="Apri carrello"
        >
          Carrello <span className="nav-cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

