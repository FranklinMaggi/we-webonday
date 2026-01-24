// ======================================================
// FE || components/navbar/Navbar.tsx
// ======================================================
// NAVBAR — GLOBAL (MARKETING / PRE-LOGIN)
//
// AI COMMENT (STRUTTURA):
// - Incapsulamento semantico: shell → layout → zones
// - Nessuna modifica UX o flusso
// - Predisposto per estensioni (cart toggle) senza attivarle
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import LanguageSelector from "./LanguageSelector";
import { logout } from "@shared/lib/userApi/auth.user.api";
import { useAuthStore } from "@shared/lib/store/auth.store";
import { t } from "@shared/aiTranslateGenerator";

import { navbarClasses as cls } from "./navbar.classes";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);
  const clearUser = useAuthStore(s => s.clearUser);

  const userMode = localStorage.getItem("user_mode");
  const activeBusinessId = localStorage.getItem("active_business_id");

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    function onResize() {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    }
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  async function handleLogout() {
    await logout();
    clearUser();
    localStorage.removeItem("user_mode");
    navigate("/", { replace: true });
  }

  return (
    <nav ref={navRef} className={cls.navShell} aria-label="Primary navigation">
      <div className={cls.navLayout}>
        {/* ================= LEFT / BRAND ================= */}
        <div className={cls.navZoneLeft}>
          <Link
            to={user ? "/user/dashboard" : "/"}
            className={cls.brandLink}
            aria-label="WebOnDay Home"
          >
            <img
              src="/icon/favicon.ico"
              alt="WebOnDay logo"
              className={cls.brandIcon}
            />

            {!isMobile && (
              <div className={cls.brandText}>
                <span className={cls.brandWe}>We</span>
                <span className={cls.brandName}>WebOnDay</span>
              </div>
            )}
          </Link>
        </div>

        {/* ================= CENTER / NAV ================= */}
        <div className={cls.navZoneCenter}>
          {ready && user && (
            <Link to="/user/dashboard" className={cls.navLink}>
              {t("navbar.dashboard")}
            </Link>
          )}

          {userMode === "configurator" && activeBusinessId && (
            <Link
              to={`/user/dashboard/${activeBusinessId}`}
              className={cls.navLink}
            >
              {t("navbar.dashboard.active_business")}
            </Link>
          )}

          <Link to="/solution" className={cls.navLink}>
            {t("navbar.solutions")}
          </Link>

          <Link to="/mission" className={cls.navLink}>
            {t("navbar.mission")}
          </Link>

          <Link to="/vision" className={cls.navLink}>
            {t("navbar.vision")}
          </Link>

          {ready && !user && (
            <Link to="/user/login" className={cls.navLink}>
              {t("navbar.login")}
            </Link>
          )}
        </div>

        {/* ================= RIGHT / ACTIONS ================= */}
        <div className={cls.navZoneRight}>
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

          {/* CART TOGGLE — HOOK (NON ATTIVO)
             - spazio riservato
             - hidden via CSS/flag
             - nessuna logica montata
          */}
          <div className={cls.cartHook} aria-hidden />

          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
}
