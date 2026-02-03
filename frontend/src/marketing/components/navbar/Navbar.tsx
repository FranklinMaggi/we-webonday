// ======================================================
// FE || components/navbar/Navbar.tsx
// ======================================================
// NAVBAR — MARKETING MINIMAL
//
// RUOLO:
// - Ridurre attrito cognitivo
// - Supportare SOLO il flusso di ingresso
//
// MOSTRA:
// - Brand
// - Login / Logout
// - Language selector
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

import LanguageSelector from "./LanguageSelector";
import { logout } from "@src/user/auth/api/auth.user.api";
import { useAuthStore } from "@shared/lib/store/auth.store";
import { t } from "@shared/aiTranslateGenerator";

import { navbarClasses as cls } from "./navbar.classes";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);
  const clearUser = useAuthStore(s => s.clearUser);

  async function handleLogout() {
    await logout();
    clearUser();
    navigate("/", { replace: true });
  }

  return (
    <nav
      ref={navRef}
      className={cls.navShell}
      aria-label="Primary navigation"
    >
      <div className={cls.navLayout}>

        {/* ================= BRAND ================= */}
        <div className={cls.navZoneLeft}>
          <Link
            to="/"
            className={cls.brandLink}
            aria-label="WebOnDay Home"
          >
            <img
              src="/icon/favicon.ico"
              alt="WebOnDay logo"
              className={cls.brandIcon}
            />

            <div className={cls.brandText}>
              <span className={cls.brandWe}>We</span>
              <span className={cls.brandName}>WebOnDay</span>
            </div>
          </Link>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className={cls.navZoneRight}>
          {ready && !user && (
            <Link to="/user/login" className={cls.navLink}>
              {t("navbar.login")}
            </Link>
          )}

          {ready && user && (
            <button
              type="button"
              onClick={handleLogout}
              className={cls.logoutButton}
              aria-label={t("navbar.logout")}
              title={t("navbar.logout")}
            >
              ⏻
            </button>
          )}

          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
}