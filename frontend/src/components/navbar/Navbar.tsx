import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cartStore } from "../../lib/cartStore";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Se cartStore è uno store Zustand classico:
  // const cartCount = cartStore((s) => s.items.length);
  // Se invece in altri punti usi getState(), manteniamo lo stesso approccio:
  const cartCount = cartStore.getState().items.length;

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  const isActive = (path: string) =>
    location.pathname.startsWith(path) ? "wd-link-active" : "";

  return (
    <nav className="wd-navbar">
      {/* LOGO */}
      <Link to="/" className="wd-navbar-logo" onClick={closeMenu}>
        <img
          src="/icon/favicon.ico"
          alt="Moka Icon"
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
        onClick={toggleMenu}
        aria-label="Apri/chiudi menu"
        aria-expanded={open}
      >
        ☰
      </button>

      {/* RIGHT LINKS */}
      <div className={`nav-right ${open ? "open" : ""}`}>
        <Link
          to="/vision"
          className={`wd-navbar-link ${isActive("/vision")}`}
          onClick={closeMenu}
        >
          Vision
        </Link>

        <Link
          to="/mission"
          className={`wd-navbar-link ${isActive("/mission")}`}
          onClick={closeMenu}
        >
          Mission
        </Link>

        <Link
          to="/user/login"
          className={`wd-navbar-link ${isActive("/user")}`}
          onClick={closeMenu}
        >
          Accedi
        </Link>

        <Link
          to="/cart"
          className={`wd-navbar-link wd-link-accent ${isActive("/cart")}`}
          onClick={closeMenu}
        >
          Carrello ({cartCount})
        </Link>
      </div>
    </nav>
  );
}
