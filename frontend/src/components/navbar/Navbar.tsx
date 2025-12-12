import { useState } from "react";
import { Link } from "react-router-dom";
import { cartStore } from "../../lib/cartStore";
import "./navbar.css"; // manterrà solo responsive/mobile, lo puliamo dopo

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cartCount = cartStore((s) => s.items.length);

  return (
    <nav className="wd-navbar">
      
      {/* LOGO */}
      <div className="wd-navbar-logo">
        <img
          src="/icon/favicon.ico"
          alt="Moka Icon"
          className="moka-icon"
        />

        <div className="logo-text">
          <span className="we">We</span>
          <span className="webonday">WebOnDay</span>
        </div>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* RIGHT LINKS */}
      <div className={`nav-right ${open ? "open" : ""}`}>
        <Link to="/vision" className="wd-navbar-link">Vision</Link>
        <Link to="/mission" className="wd-navbar-link">Mission</Link>
        <Link to="/user/login" className="wd-navbar-link">Accedi</Link>

        <Link to="/cart" className="wd-navbar-link wd-link-accent">
          Carrello ({cartCount})
        </Link>
      </div>

    </nav>
  );
}
