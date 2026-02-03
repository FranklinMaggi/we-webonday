francescomaggi@MacBook-Pro app % cd '/Users/francescomaggi/Documents/GitHub/We-WebOnDay/frontend/src/marketing'
francescomaggi@MacBook-Pro marketing % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/frontend/src/marketing
DATE: 2026-01-31T11:09:36Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: components/Tables/PricingTabel.tsx
LANG: tsx
SIZE:     3221 bytes
----------------------------------------
// FE || components/pricing/PricingTable.tsx
// ======================================================
// PRICING TABLE — WEBONDAY LINEA CAFFÈ
// ======================================================
//
// RUOLO:
// - Componente riutilizzabile per mostrare
//   la tabella prezzi ufficiale WebOnDay
//
// UTILIZZO:
// <PricingTable />
//
// NOTE:
// - Contenuto = source of truth commerciale
// - Nessuna logica JS: solo presentazione
// - Stili isolati in pricing-table.css
//
// ======================================================



export default function PricingTable() {
  return (
    <section id="tabella-servizi" className="pricing-wrapper">
      <h2 className="pricing-title">
        Tabella Riepilogativa — Linea Caffè WebOnDay
      </h2>

      <div className="pricing-scroll">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Servizio</th>

              <th>
                Essential
                <span className="price-note">1.250€ • 300€/anno</span>
              </th>

              <th>
                Worker
                <span className="price-note">4.500€ • 2.500€/anno</span>
              </th>

              <th>
                Industrial
                <span className="price-note">7.000€ • 1.000€/mese</span>
              </th>

              <th>
                Governor
                <span className="price-note">25.000€ • 18.000€/anno</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Dominio + Hosting</td>
              <td>✓</td><td>✓</td><td>✓</td><td>✓</td>
            </tr>

            <tr>
              <td>Email aziendali</td>
              <td>5</td><td>Upgrade</td><td>Upgrade</td><td>Personalizzate</td>
            </tr>

            <tr>
              <td>Tipo di sito</td>
              <td>Vetrina</td>
              <td>Web-App Dinamica</td>
              <td>Backend Completo</td>
              <td>Architettura Dedicata</td>
            </tr>

            <tr>
              <td>Ricezione ordini</td>
              <td>Email / WhatsApp</td>
              <td>Clienti + Fornitori</td>
              <td>Automazioni + DB</td>
              <td>Processi Enterprise</td>
            </tr>

            <tr>
              <td>Pagamenti online</td>
              <td>✕</td>
              <td>Stripe / PayPal</td>
              <td>Completi + API</td>
              <td>Enterprise Sicuro</td>
            </tr>

            <tr>
              <td>E-commerce</td>
              <td>✕</td>
              <td>Opzionale</td>
              <td>Incluso</td>
              <td>Custom Multicanale</td>
            </tr>

            <tr>
              <td>API Business</td>
              <td>✕</td>
              <td>Opzionali</td>
              <td>2 incluse</td>
              <td>Su misura</td>
            </tr>

            <tr>
              <td>Assistenza</td>
              <td>Base</td>
              <td>Manager dedicato</td>
              <td>Alta intensità</td>
              <td>Operatori continui</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}


=== FILE: components/footer/Footer.tsx
LANG: tsx
SIZE:     3005 bytes
----------------------------------------
// ======================================================
// FE || components/footer/Footer.tsx
// ======================================================
// FOOTER — GLOBAL (MARKETING / PRE-LOGIN)
//
// AI COMMENT (STRUTTURA):
// - Incapsulamento semantico del footer globale
// - Separazione: shell → layout → sections → items
// - Nessuna modifica UX o logica
// ======================================================

import { Link } from "react-router-dom";
import { useAuthStore } from "@shared/lib/store/auth.store";
import { t } from "@shared/aiTranslateGenerator";
import { footerClasses as cls } from "./footer.classes";

export default function Footer() {
  const year = new Date().getFullYear();
  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);

  return (
    <footer className={cls.footerShell} role="contentinfo">
      <nav className={cls.footerLayout} aria-label="Footer navigation">
        {/* ================= POLICY ================= */}
        <section className={cls.footerSection}>
          <h4 className={cls.sectionTitle}>
            {t("footer.policy.title")}
          </h4>

          <Link className={cls.footerLink} to="/terms">
            {t("footer.policy.terms")}
          </Link>

          <Link className={cls.footerLink} to="/policy">
            {t("footer.policy.general")}
          </Link>

          <Link className={cls.footerLink} to="/policy/privacy">
            {t("footer.policy.privacy")}
          </Link>
        </section>

        {/* ================= IDENTITY ================= */}
        <section className={cls.footerSection}>
          <h4 className={cls.sectionTitle}>
            {t("footer.about.title")}
          </h4>

          <Link className={cls.footerLink} to="/founder">
            {t("footer.about.founder")}
          </Link>

          <Link className={cls.footerLink} to="/mission">
            {t("footer.about.mission")}
          </Link>

          <Link className={cls.footerLink} to="/vision">
            {t("footer.about.vision")}
          </Link>
        </section>

        {/* ================= ACCESS ================= */}
        <section className={cls.footerSection}>
          <h4 className={cls.sectionTitle}>
            {t("footer.access.title")}
          </h4>

          {ready && user ? (
            <Link className={cls.footerLink} to="/user/dashboard">
              {t("footer.access.dashboard")}
            </Link>
          ) : (
            <>
              <Link className={cls.footerLink} to="/user/login">
                {t("footer.access.login")}
              </Link>

              <Link className={cls.footerLink} to="/solution">
                {t("footer.access.explore")}
              </Link>
            </>
          )}
        </section>
      </nav>

      {/* ================= META ================= */}
      <div className={cls.footerMeta}>
        © {year} WebOnDay — {t("footer.rights")}
      </div>
    </footer>
  );
}


=== FILE: components/footer/footer.classes.ts
LANG: ts
SIZE:      742 bytes
----------------------------------------
// ======================================================
// FE || components/footer/footer.classes.ts
// ======================================================
// FOOTER — CLASS REGISTRY (LOCAL)
//
// Responsabilità:
// - Mappare classi semantiche del footer
// - Nessun CSS
// ======================================================

export const footerClasses = {
    /** SHELL */
    footerShell: "page-section page-section--footer footer-shell",
  
    /** LAYOUT */
    footerLayout: "footer-layout footer-layout--grid",
  
    /** SECTIONS */
    footerSection: "footer-section",
  
    /** ELEMENTS */
    sectionTitle: "footer-section-title",
    footerLink: "footer-link",
  
    /** META */
    footerMeta: "footer-meta",
  };
  

=== FILE: components/hero/HeroBase.tsx
LANG: tsx
SIZE:     1560 bytes
----------------------------------------
// ======================================================
// FE || components/hero/HeroBase.tsx
// ======================================================
// HERO BASE — STRUTTURA RIUTILIZZABILE
//
// AI COMMENT (STRUTTURA):
// - Incapsulamento: section → layout → blocks
// - Nessuna dipendenza dal contesto pagina
// - Pronto per layout padre
// ======================================================

import { heroBaseClasses as cls } from "./heroBase.classes";

interface HeroBaseProps {
  title: string;
  subtitle?: string;
  image?: string;
  referralLabel?: string;
}

export default function HeroBase({
  title,
  subtitle,
  image,
  referralLabel = "Invita un amico",
}: HeroBaseProps) {
  const referralUrl = "/referral"; // futuro: dinamico

  return (
    <section className={cls.heroShell}>
      <div className={cls.heroLayout}>
        {/* ================= IMAGE ================= */}
        {image && (
          <div className={cls.heroImage}>
            <img src={image} alt="" />
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className={cls.heroContent}>
          <h1 className={cls.heroTitle}>{title}</h1>

          {subtitle && (
            <p className={cls.heroSubtitle}>{subtitle}</p>
          )}

          <div className={cls.heroActions}>
            <a
              href={referralUrl}
              className={cls.heroActionPrimary}
            >
              {referralLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


=== FILE: components/hero/heroBase.classes.ts
LANG: ts
SIZE:      773 bytes
----------------------------------------
// ======================================================
// FE || components/hero/heroBase.classes.ts
// ======================================================
// HERO BASE — CLASS REGISTRY
//
// Responsabilità:
// - Classi semantiche HeroBase
// - Nessun CSS
// ======================================================

export const heroBaseClasses = {
    /** SHELL */
    heroShell: "page-section page-section--hero hero-shell",
  
    /** LAYOUT */
    heroLayout: "hero-layout",
  
    /** BLOCKS */
    heroImage: "hero-image",
    heroContent: "hero-content",
  
    /** TYPO */
    heroTitle: "hero-title",
    heroSubtitle: "hero-subtitle",
  
    /** ACTIONS */
    heroActions: "hero-actions",
    heroActionPrimary: "hero-action hero-action--primary",
  };
  

=== FILE: components/hero/home/HomeHero.tsx
LANG: tsx
SIZE:      646 bytes
----------------------------------------
// ======================================================
// FE || components/hero/home/HomeHero.tsx
// ======================================================
// HOME HERO — MARKETING
//
// AI COMMENT:
// - Componente di composizione
// - Non gestisce layout
// - Delega struttura a HeroBase
// ======================================================

import HeroBase from "../HeroBase";
import heroImg from "./hero1.png";
import { t } from "@shared/aiTranslateGenerator";

export default function HomeHero() {
  return (
    <HeroBase
      title={t("home.hero.h1")}
      subtitle={t("home.hero.subtitle")}
      image={heroImg}
    />
  );
}


=== FILE: components/navbar/LanguageSelector.tsx
LANG: tsx
SIZE:     4466 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT
 * COMPONENT: LanguageSelector
 *
 * RUOLO:
 * - Selettore lingua visitor (persistente)
 * - Overlay fullscreen (desktop + mobile)
 *
 * INVARIANTI:
 * - SOLO <button>
 * - Nessun reload
 * - i18n live-safe
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguageStore } from "@shared/aiTranslateGenerator/lib/storeVisitorLanguage.store";

type LangItem = {
  code: string;
  label: string;
  flag: string;
};

const LANGS: LangItem[] = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "zh", label: "中文 (简体)", flag: "🇨🇳" },
  { code: "zh-TW", label: "中文 (繁體)", flag: "🇹🇼" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(
    () => LANGS.find(l => l.code === language),
    [language]
  );

  function close() {
    setOpen(false);
  }

  function changeLang(code: string) {
    setLanguage(code);
    close();
  }

  // ESC to close
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div ref={wrapperRef} className="wd-lang-wrapper">
      {/* NAVBAR TRIGGER */}
      <div className="wd-lang-primary">
        {currentLang && (
          <button
            type="button"
            className="wd-lang-btn active"
            onClick={() => setOpen(true)}
            title={currentLang.label}
          >
            {currentLang.flag}
          </button>
        )}

        <button
          type="button"
          className="wd-lang-btn plus"
          onClick={() => setOpen(true)}
          aria-label="Open language selector"
        >
          +
        </button>
      </div>

      {/* FULLSCREEN OVERLAY */}
      {open && (
        <div className="wd-lang-overlay" role="dialog" aria-modal="true">
          <div className="wd-lang-overlay-panel wd-lang-overlay-panel--full">
            <header className="wd-lang-overlay-head">
              <h2 className="wd-lang-overlay-title">
                Seleziona la lingua
              </h2>

              <button
                type="button"
                className="wd-lang-overlay-close"
                onClick={close}
                aria-label="Close language selector"
              >
                ✕
              </button>
            </header>

            <div className="wd-lang-grid">
              {LANGS
                .filter(l => l.code !== language)
                .map(l => (
                  <button
                    key={l.code}
                    type="button"
                    className="wd-lang-item"
                    onClick={() => changeLang(l.code)}
                  >
                    <span className="flag">{l.flag}</span>
                    <span className="label">{l.label}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


=== FILE: components/navbar/NavCartButton.tsx
LANG: tsx
SIZE:      983 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT
 * COMPONENT: NavCartButton
 *
 * RUOLO:
 * - UI control persistente in navbar
 * - toggle del mini-cart tramite uiBus
 *
 * NOTE ARCHITETTURALI:
 * - NON è un link
 * - NON conosce lo stato open/closed
 * - emette solo intenti (cart:toggle)
 */

import { uiBus } from "@shared/lib/ui/uiBus";
import { cartStore } from "@shared/lib/cart/cart.store";
import { useEffect, useState } from "react";

export default function NavCartButton() {
  const [count, setCount] = useState(
    cartStore.getState().item ? 1 : 0
  );
  
  useEffect(() => {
    return cartStore.subscribe((s) =>
      setCount(s.item ? 1 : 0));
  }, []);

  return (
    <button
      type="button"
      className="navbar-cart-toggle"
      onClick={() => uiBus.emit("cart:toggle")}
      aria-label="Apri o chiudi carrello"
      title="Carrello"
    >
      <span className="navbar-cart-label">Carrello</span>
      <span className="navbar-cart-badge">{count}</span>
    </button>
  );
}


=== FILE: components/navbar/Navbar.tsx
LANG: tsx
SIZE:     4307 bytes
----------------------------------------
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


=== FILE: components/navbar/navbar.classes.ts
LANG: ts
SIZE:     1072 bytes
----------------------------------------
// ======================================================
// FE || components/navbar/navbar.classes.ts
// ======================================================
// NAVBAR — CLASS REGISTRY (LOCAL)
//
// Responsabilità:
// - Mappare classi semantiche navbar
// - Nessun CSS
// ======================================================

export const navbarClasses = {
    /** SHELL */
    navShell: "page-section page-section--navbar navbar-shell",
  
    /** LAYOUT */
    navLayout: "navbar-layout",
  
    /** ZONES */
    navZoneLeft: "navbar-zone navbar-zone--left",
    navZoneCenter: "navbar-zone navbar-zone--center",
    navZoneRight: "navbar-zone navbar-zone--right",
  
    /** BRAND */
    brandLink: "navbar-brand",
    brandIcon: "navbar-brand-icon",
    brandText: "navbar-brand-text",
    brandWe: "navbar-brand-we",
    brandName: "navbar-brand-name",
  
    /** NAV */
    navLink: "navbar-link",
  
    /** ACTIONS */
    logoutButton: "navbar-action navbar-action--logout",
  
    /** FUTURE HOOKS */
    cartHook: "navbar-hook navbar-hook--cart",
  };
  

=== FILE: components/policy/policyViewer.tsx
LANG: tsx
SIZE:     1496 bytes
----------------------------------------
// ======================================================
// FE || components/policy/PolicyViewer.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Viewer UNICO delle policy
// - Riutilizzato da:
//   - pagine legali
//   - checkout
//
// INVARIANTI:
// - Read-only
// - Nessuna accettazione
// - Usa SOLO policyApi
//
// ======================================================

// Viewer unico policy (general / checkout)

import { useEffect, useState } from "react";
import { fetchLatestPolicy, type PolicyDTO, type PolicyScope } from "@shared/lib/userApi/policy.user.api";

export function PolicyViewer({ scope }: { scope: PolicyScope }) {
  const [policy, setPolicy] = useState<PolicyDTO | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLatestPolicy(scope)
      .then(setPolicy)
      .catch(() => setError("Impossibile caricare la policy."));
  }, [scope]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!policy) return <p>Caricamento policy…</p>;

  return (
    <section style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>{policy.content.title}</h1>

      <p style={{ opacity: 0.6 }}>
        Versione {policy.version} · Aggiornata il{" "}
        {new Date(policy.content.updatedAt).toLocaleDateString()}
      </p>

      <article style={{ whiteSpace: "pre-wrap", marginTop: 24 }}>
        {policy.content.body}
      </article>
    </section>
  );
}


=== FILE: components/whatsapp/WhatsAppButton.tsx
LANG: tsx
SIZE:     1283 bytes
----------------------------------------
// ======================================================
// FE || components/whatsapp/WhatsAppButton.tsx
// ======================================================
//
// AI-SUPERCOMMENT
// - CTA flottante globale (WhatsApp)
// - Visibilità guidata da uiBus
// - Nessuna logica di pagina
// ======================================================

import { useEffect, useState } from "react";
import iconUrl from "./WhatsApp.png";
import { uiBus } from "@shared/lib/ui/uiBus";
import { whatsappClasses as cls } from "./whatsapp.classes";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offHide = uiBus.on("whatsapp:hide", () => setVisible(false));
    const offShow = uiBus.on("whatsapp:show", () => setVisible(true));

    return () => {
      offHide();
      offShow();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={cls.wrapper}>
      <a
        className={cls.button}
        href="https://wa.me/393801888965"
        target="_blank"
        rel="noreferrer"
        aria-label={cls.ariaLabel}
      >
        <img
          src={iconUrl}
          alt=""
          width={28}
          height={28}
          className={cls.icon}
        />
      </a>
    </div>
  );
}


=== FILE: components/whatsapp/whatsapp.classes.ts
LANG: ts
SIZE:      516 bytes
----------------------------------------
// ======================================================
// FE || components/whatsapp/whatsapp.classes.ts
// ======================================================
// WHATSAPP BUTTON — CLASS REGISTRY
// ======================================================

export const whatsappClasses = {
    /** STRUCTURE */
    wrapper: "whatsapp-wrapper",
  
    /** CTA */
    button: "whatsapp-btn wd-whatsapp-neon",
    icon: "whatsapp-icon",
  
    /** A11Y / FUTURE i18n */
    ariaLabel: "Apri chat WhatsApp",
  };
  

=== FILE: pages/buyflow/api/DataTransferObject/solution.public.dto.ts
LANG: ts
SIZE:      445 bytes
----------------------------------------
   /* AI-SUPERCOMMENT
 * RUOLO:
 * - DTO pubblico Solution lato FE
 * - SPECCHIO del DTO BE pubblico
 * - NON usa inferenze
 */

import type { OpeningHoursFE } from "@src/shared/domain/business/openingHours.types";

export type PublicSolutionDTO = {
    id: string;
    name: string;
    description: string; // 🔒 NON opzionale
    imageKey?: string;
    icon?: string;
    industries: string[];
  
  openingHours:OpeningHoursFE;
    
  };
  

=== FILE: pages/buyflow/api/publiApi/products/products.public.api.ts
LANG: ts
SIZE:     2416 bytes
----------------------------------------
/**
 * ======================================================
 * FE || src/lib/products/productsApi.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (PUBLIC)
 *
 * RUOLO:
 * - API FE per il catalogo PRODOTTI pubblico
 *
 * CONTESTO:
 * - Usata da visitor e user non admin
 *
 * RESPONSABILITÀ:
 * - Recuperare prodotti con opzioni
 * - Normalizzare dati ADMIN → PUBLIC
 *
 * NON FA:
 * - NON gestisce auth
 * - NON espone campi sensibili admin
 * - NON calcola pricing
 *
 * INVARIANTI:
 * - Nessun token
 * - Nessun dato admin-sensitive
 * - Backend = source of truth
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/publicApi/products.public.api.ts
 * - Refactor:
 *   • uso apiFetch
 *   • separazione netta public/admin DTO
 *
 * NOTE:
 * - Normalizzazione VOLUTA
 * - Protezione del dominio admin
 * ======================================================
 */
import { API_BASE } from "../../../../../../shared/lib/config";
import type { ProductVM } from "../../../../../../shared/lib/viewModels/product/Product.view-model";
import { normalizeAdminProductToPublic } from "../../../../../../shared/lib/normalizers/product.admin-to-public";

/* =========================
   FETCH ALL PRODUCTS (PUBLIC)
========================= */
export async function fetchProducts(): Promise<ProductVM[]> {
  const res = await fetch(`${API_BASE}/api/products/with-options`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Products fetch failed (${res.status})`);
  }

  const data = await res.json();

  if (!data?.ok || !Array.isArray(data.products)) {
    throw new Error("Invalid products response shape");
  }

  return data.products.map(normalizeAdminProductToPublic);
}

/* =========================
   FETCH SINGLE PRODUCT (PUBLIC)
========================= */
export async function fetchProduct(
  id: string
): Promise<ProductVM> {
  const res = await fetch(
    `${API_BASE}/api/product?id=${encodeURIComponent(id)}`,
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) {
    throw new Error(`Product fetch failed (${res.status})`);
  }

  const data = await res.json();

  if (!data?.ok || !data.product) {
    throw new Error("Invalid product response shape");
  }

  return normalizeAdminProductToPublic(data.product);
}


=== FILE: pages/buyflow/api/publiApi/solutions/solutions.public.api.ts
LANG: ts
SIZE:     1971 bytes
----------------------------------------
/**
 * ======================================================
 * FE || PUBLIC API — SOLUTIONS
 * ======================================================
 *
 * RUOLO:
 * - Accesso pubblico READ-ONLY alle Solutions
 *
 * USATO DA:
 * - Landing
 * - Catalogo
 * - Configuratore
 *
 * INVARIANTI:
 * - READ ONLY
 * - Nessuna auth
 * - Backend = source of truth
 * ======================================================
 */

import { apiFetch } from "../../../../../../shared/lib/api";

/* ======================================================
   TYPES
====================================================== */

import { type OpeningHoursFE } from "@src/shared/domain/business/openingHours.types";

export type PublicSolutionDetailDTO = {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;

  icon?: string;
  industries?: string[];
  imageKey?: string;
  productIds: string[];

  descriptionTags: string[];
  serviceTags: string[];

  openingHours:OpeningHoursFE;

  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  createdAt: string;
};

/* ======================================================
   API RESPONSES
====================================================== */

type PublicSolutionDetailResponse = {
  ok: true;
  solution: PublicSolutionDetailDTO;
};

/* ======================================================
   FETCH — SOLUTION DETAIL (CANONICAL)
====================================================== */

/**
 * 🔒 CANONICAL PUBLIC READER
 * - Usato dal Configurator (StepBusinessInfo)
 * - Usato da pagine Solution
 */
export async function getSolutionById(
  solutionId: string
): Promise<PublicSolutionDetailDTO> {
  const res = await apiFetch<PublicSolutionDetailResponse>(
    `/api/solution?id=${encodeURIComponent(solutionId)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res || !res.ok || !res.solution) {
    throw new Error("INVALID_PUBLIC_SOLUTION_RESPONSE");
  }

  return res.solution;
}


=== FILE: pages/buyflow/solutions/SolutionCard.tsx
LANG: tsx
SIZE:     1561 bytes
----------------------------------------
// ============================================================
// FE || components/solutions/SolutionCard.tsx
// ============================================================
//
// AI-SUPERCOMMENT
// - Card presentazionale di una Solution
// - Nessuna conoscenza di layout pagina
// - Navigazione delegata (click → route)
// ============================================================

import { useNavigate } from "react-router-dom";
import { solutionCardClasses as cls } from "./solutionCard.classes";

type PublicSolutionCard = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

type Props = {
  solution: PublicSolutionCard;
};

export default function SolutionCard({ solution }: Props) {
  const navigate = useNavigate();

  return (
    <article
      className={cls.card}
      onClick={() => navigate(`/solution/${solution.id}`)}
      role="button"
      tabIndex={0}
    >
      {/* ================= MEDIA ================= */}
      <div className={cls.media}>
        {solution.image && (
          <img
            src={solution.image}
            alt={solution.name}
            loading="lazy"
            className={cls.image}
          />
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className={cls.content}>
        <h3 className={cls.title}>{solution.name}</h3>

        <p className={cls.description}>
          {solution.description}
        </p>

        <span className={cls.cta}>
          Scopri di più →
        </span>
      </div>
    </article>
  );
}


=== FILE: pages/buyflow/solutions/SolutionSection.tsx
LANG: tsx
SIZE:     2629 bytes
----------------------------------------
// ============================================================
// FE || components/solutions/SolutionsSection.tsx
// ============================================================
//
// AI-SUPERCOMMENT
// - Sezione FE autonoma (data-fetch + render)
// - Nessuna conoscenza del layout di pagina
// - UI-safe (guard su description)
// ============================================================

import { useEffect, useState } from "react";
import { fetchPublicSolutions } from
  "../../../../shared/lib/publicApi/solutions/solutions.public.api";

import SolutionCard from "./SolutionCard";
import { solutionsSectionClasses as cls } from "./solutionsSection.classes";
import { t } from "@shared/aiTranslateGenerator";

type PublicSolutionCard = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

export default function SolutionsSection() {
  const [solutions, setSolutions] = useState<PublicSolutionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===========================
     LOAD SOLUTIONS (PUBLIC)
  =========================== */
  useEffect(() => {
    let cancelled = false;

    async function loadSolutions() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPublicSolutions();

        const normalized = data.map((s) => ({
          ...s,
          description: s.description ?? "",
        }));

        if (!cancelled) setSolutions(normalized);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ??
              t("solutions.error.generic")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSolutions();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={cls.section}>
      <h2 className={cls.title}>
        {t("solutions.section.title")}
      </h2>

      {loading && (
        <p className={cls.loading}>
          {t("solutions.loading")}
        </p>
      )}

      {!loading && error && (
        <p className={cls.error}>
          {error}
        </p>
      )}

      {!loading && !error && solutions.length === 0 && (
        <p className={cls.empty}>
          {t("solutions.empty")}
        </p>
      )}

      {!loading && !error && solutions.length > 0 && (
        <div className={cls.grid}>
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
            />
          ))}
        </div>
      )}
    </section>
  );
}


=== FILE: pages/buyflow/solutions/TagInput.tsx
LANG: tsx
SIZE:     2278 bytes
----------------------------------------
type TagInputProps = {
    value: string[];
    onChange: (tags: string[]) => void;
    maxVisible?: number; // default 6
  };
  // ======================================================
// FE || components/solutions/TagInput.tsx
// ======================================================

import { useState } from "react";

export function TagInput({
  value,
  onChange,
  maxVisible = 6,
}: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = slugifyTag(raw);
    if (!tag) return;
    if (value.includes(tag)) return;

    onChange([...value, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag));
  }

  return (
    <div className="tag-input">

      {/* Pills */}
      <div className="tag-pills">
        {value.slice(0, maxVisible).map(tag => (
          <span key={tag} className="pill">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}

        {value.length > maxVisible && (
          <div className="pill-scroll">
            {value.slice(maxVisible).map(tag => (
              <span key={tag} className="pill muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Aggiungi tag (es. camere sul mare)"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
        }}
        onBlur={() => addTag(input)}
      />
    </div>
  );
}
// ======================================================
// FE || utils/slugifyTag.ts
// ======================================================

export function slugifyTag(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .normalize("NFD")                 // rimuove accenti
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")     // solo lettere, numeri, spazio
      .replace(/\s+/g, "-")             // spazi → -
      .replace(/-+/g, "-")              // -- → -
      .replace(/^-|-$/g, "");           // trim -
  }
  

=== FILE: pages/buyflow/solutions/solutionCard.classes.ts
LANG: ts
SIZE:      655 bytes
----------------------------------------
// ============================================================
// FE || components/solutions/solutionCard.classes.ts
// ============================================================
// SOLUTION CARD — CLASS REGISTRY
// ============================================================

export const solutionCardClasses = {
    /** ROOT */
    card: "wd-card solution-card",
  
    /** MEDIA */
    media: "wd-card__media solution-card__media",
    image: "solution-card__img",
  
    /** CONTENT */
    content: "solution-card__content",
    title: "solution-card__title",
    description: "solution-card__description",
    cta: "solution-card__cta",
  };
  

=== FILE: pages/buyflow/solutions/solutionsSection.classes.ts
LANG: ts
SIZE:      633 bytes
----------------------------------------
// ============================================================
// FE || components/solutions/solutionsSection.classes.ts
// ============================================================
// SOLUTIONS SECTION — CLASS REGISTRY
// ============================================================

export const solutionsSectionClasses = {
    /** ROOT */
    section: "solutions-section",
    title: "solutions.section.title",
  
    /** STATES */
    loading: "solutions-section__loading",
    error: "solutions-section__error",
    empty: "solutions-section__empty",
  
    /** GRID */
    grid: "solutions-section__grid wd-grid",
  };
  

=== FILE: pages/founder/chiSiamo.classes.ts
LANG: ts
SIZE:     1300 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/founder/chiSiamo.classes.ts
// ======================================================
// CHI SIAMO — CLASS REGISTRY
//
// Responsabilità:
// - Classi semantiche pagina founder
// - Nessun CSS
// ======================================================

export const chiSiamoClasses = {
    /** PAGE */
    pageShell: "page-shell page-founder",
    pageLayout: "page-layout page-layout--vertical",
  
    /** HERO */
    heroSection: "page-section page-section--hero founder-hero",
    heroTitle: "founder-hero-title",
    heroSubtitle: "founder-hero-subtitle",
  
    /** FOUNDER */
    founderSection: "page-section page-section--founder",
    founderLayout: "founder-layout",
    founderImage: "founder-image",
    founderContent: "founder-content",
    founderName: "founder-name",
    founderRole: "founder-role",
    founderQuote: "founder-quote",
  
    /** MISSION */
    missionSection: "page-section page-section--mission",
    missionTitle: "mission-title",
    missionText: "mission-text",
  
    /** TEAM */
    teamSection: "page-section page-section--team",
    teamGrid: "team-grid",
    teamCard: "team-card",
    teamIcon: "team-icon",
    teamTitle: "team-title",
    teamText: "team-text",
  };
  

=== FILE: pages/founder/index.tsx
LANG: tsx
SIZE:     3096 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/founder/index.tsx
// ======================================================
// CHI SIAMO — MARKETING / PRE-LOGIN
//
// AI COMMENT (STRUTTURA):
// - Shell globale
// - Nessun copy hardcoded
// - i18n fallback IT
// ======================================================

import founderImg from "@src/assets/founder.png";
import { t } from "@shared/aiTranslateGenerator";
import { chiSiamoClasses as cls } from "./chiSiamo.classes";

export default function ChiSiamo() {
  return (
    <main className={cls.pageShell}>
      <div className={cls.pageLayout}>
        {/* ================= HERO ================= */}
        <header className={cls.heroSection}>
          <h1 className={cls.heroTitle}>
            {t("founder.hero.h1")}
          </h1>

          <p className={cls.heroSubtitle}>
            {t("founder.hero.subtitle")}
          </p>
        </header>

        {/* ================= FOUNDER ================= */}
        <section className={cls.founderSection}>
          <div className={cls.founderLayout}>
            <img
              src={founderImg}
              alt={t("founder.founder.name")}
              className={cls.founderImage}
            />

            <div className={cls.founderContent}>
              <h2 className={cls.founderName}>
                {t("founder.founder.name")}
              </h2>

              <h3 className={cls.founderRole}>
                {t("founder.founder.role")}
              </h3>

              <p className={cls.founderQuote}>
                {t("founder.founder.quote")}
              </p>
            </div>
          </div>
        </section>

        {/* ================= MISSION ================= */}
        <section className={cls.missionSection}>
          <h2 className={cls.missionTitle}>
            {t("founder.mission.title")}
          </h2>

          <p className={cls.missionText}>
            {t("founder.mission.text")}
          </p>
        </section>

        {/* ================= TEAM ================= */}
        <section className={cls.teamSection}>
          <div className={cls.teamGrid}>
            <div className={cls.teamCard}>
              <h3 className={cls.teamTitle}>
                {t("founder.team.coder.title")}
              </h3>
              <p className={cls.teamText}>
                {t("founder.team.coder.text")}
              </p>
            </div>

            <div className={cls.teamCard}>
              <h3 className={cls.teamTitle}>
                {t("founder.team.design.title")}
              </h3>
              <p className={cls.teamText}>
                {t("founder.team.design.text")}
              </p>
            </div>

            <div className={cls.teamCard}>
              <h3 className={cls.teamTitle}>
                {t("founder.team.comm.title")}
              </h3>
              <p className={cls.teamText}>
                {t("founder.team.comm.text")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


=== FILE: pages/home/home.classes.ts
LANG: ts
SIZE:      804 bytes
----------------------------------------
// ======================================================
// FE || pages/home/home.classes.ts
// ======================================================
// HOME PAGE — CLASS REGISTRY (LOCAL)
//
// Responsabilità:
// - Mappare classi semantiche della Home
// - Nessun CSS
// ======================================================

export const homePageClasses = {
    /** PAGE */
    pageShell: "page-shell page-home",
  
    /** LAYOUT */
    pageLayout: "page-layout page-layout--vertical",
  
    /** SECTIONS */
    heroSection: "page-section page-section--hero",
    whySection: "page-section page-section--why",
  
    /** WHY SECTION — INTERNAL */
    whyTitle: "why-title",
    whyContent: "why-content",
    whyList: "why-list",
    whyFooter: "why-footer",
    whyLinks: "why-links",
  };
  

=== FILE: pages/home/index.tsx
LANG: tsx
SIZE:     1251 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/index.tsx
// ======================================================
// MARKETING LANDING — SINGLE PAGE APPLICATION
//
// RUOLO:
// - Landing principale WebOnDay
// - Composizione verticale delle sezioni chiave
//
// STRUTTURA:
// 1. Solutions
// 2. Mission
// 3. Vision
//
// NOTE:
// - Navbar e Footer sono GLOBALI (fuori da questo file)
// - Nessuna logica nuova
// - Nessuna fetch duplicata
// ======================================================

import Solutions from "../solution/soltuionpage";
import Mission from "../mission";
import Vision from "../vision";

export default function MarketingIndex() {
  return (
    <main className="page-shell page-marketing">
      <div className="page-layout page-layout--vertical">

        {/* ================= SOLUTIONS ================= */}
        <section id="solutions">
          <Solutions />
        </section>

        {/* ================= MISSION ================= */}
        <section id="mission">
          <Mission />
        </section>

        {/* ================= VISION ================= */}
        <section id="vision">
          <Vision />
        </section>

      </div>
    </main>
  );
}


=== FILE: pages/mission/index.tsx
LANG: tsx
SIZE:     3395 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/mission/index.tsx
// ======================================================
// MISSION — MARKETING / PRE-LOGIN
//
// AI COMMENT (STRUTTURA):
// - Page shell standard
// - Roadmap data-driven via i18n
// - Nessun contenuto hardcoded
// ======================================================

import { t } from "@shared/aiTranslateGenerator";
import { missionClasses as cls } from "./mission.classes";

type RoadmapStatus = "done" | "in-progress" | "pending";

function getStepIcon(status: RoadmapStatus, index: number) {
  switch (status) {
    case "done":
      return <div className={cls.stepIconDone}>✔</div>;
    case "in-progress":
      return <div className={cls.stepIconProgress}>⏳</div>;
    default:
      return <div className={cls.stepIconPending}>{index + 1}</div>;
  }
}

export default function Mission() {
  const roadmap = Array.from({ length: 10 }).map((_, i) => ({
    text: t(`mission.roadmap.${i + 1}.text`),
    status: t(`mission.roadmap.${i + 1}.status`) as RoadmapStatus,
  }));

  return (
    <main className={cls.pageShell}>
      <div className={cls.pageLayout}>
        {/* ================= HERO ================= */}
        <header className={cls.heroSection}>
          <h1>{t("mission.hero.h1")}</h1>
          <p>{t("mission.hero.subtitle")}</p>
        </header>

        {/* ================= CORE ================= */}
        <section className={cls.section}>
          <p>{t("mission.core.p1")}</p>
          <p>{t("mission.core.p2")}</p>
        </section>

        {/* ================= REFERRAL ================= */}
        <section className={cls.section}>
          <h2>{t("mission.referral.h2")}</h2>
          <p>{t("mission.referral.p1")}</p>
          <p>{t("mission.referral.p2")}</p>
        </section>

        {/* ================= ARCHIVE ================= */}
        <section className={cls.section}>
          <h2>{t("mission.archive.h2")}</h2>
          <p>{t("mission.archive.p1")}</p>
          <p>{t("mission.archive.p2")}</p>
          <p>{t("mission.archive.p3")}</p>
        </section>

        {/* ================= ROADMAP ================= */}
        <section className={cls.roadmapSection}>
          <h2>{t("mission.roadmap.h2")}</h2>
          <p className={cls.roadmapIntro}>
            {t("mission.roadmap.intro")}
          </p>

          <ul className={cls.timelineList}>
            {roadmap.map((step, i) => (
              <li
                key={i}
                className={`${cls.timelineItem} ${
                  i % 2 === 0 ? cls.timelineLeft : cls.timelineRight
                }`}
              >
                <div className={cls.timelineIconWrapper}>
                  {getStepIcon(step.status, i)}
                </div>

                <div
                  className={`${cls.timelineCard} ${
                    i % 2 === 0
                      ? cls.timelineCardLeft
                      : cls.timelineCardRight
                  }`}
                >
                  <h3 className={cls.timelineStepTitle}>
                    Step {i + 1}
                  </h3>
                  <p className={cls.timelineStepText}>
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}


=== FILE: pages/mission/mission.classes.ts
LANG: ts
SIZE:     1131 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/mission/mission.classes.ts
// ======================================================

export const missionClasses = {
    /** PAGE */
    pageShell: "page-shell page-mission",
    pageLayout: "page-layout page-layout--vertical",
  
    /** SECTIONS */
    heroSection: "page-section page-section--hero",
    section: "page-section",
    roadmapSection: "page-section page-section--roadmap",
  
    /** ROADMAP */
    roadmapIntro: "roadmap-intro",
    timelineList: "timeline-list",
    timelineItem: "timeline-item wd-card",
    timelineLeft: "timeline-left wd",
    timelineRight: "timeline-right",
    timelineIconWrapper: "timeline-icon-wrapper",
    timelineCard: "timeline-card",
    timelineCardLeft: "timeline-card-left",
    timelineCardRight: "timeline-card-right",
    timelineStepTitle: "timeline-step-title",
    timelineStepText: "timeline-step-text",
  
    /** ICONS */
    stepIconDone: "step-icon step-icon--done",
    stepIconProgress: "step-icon step-icon--progress",
    stepIconPending: "step-icon step-icon--pending",
  };
  

=== FILE: pages/pricing/index.tsx
LANG: tsx
SIZE:      677 bytes
----------------------------------------
// FE || pages/Pricing/Price.tsx
// ======================================================
// PRICING PAGE — WEBONDAY
// ======================================================
//
// RUOLO:
// - Pagina pubblica prezzi
// - Punto di atterraggio commerciale
// - Riutilizza PricingTable come source of truth
//
// URL:
// /pricing
//
// ======================================================

import PricingTable from "../../components/Tables/PricingTabel";

export default function Price() {
  return (
    <div className="wd-table">

    

      {/* CONTENUTO */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <PricingTable />
      </main>

    </div>
  );
}


=== FILE: pages/solution/ProductCard/PreForm.tsx
LANG: tsx
SIZE:     3286 bytes
----------------------------------------
// ======================================================
// FE || BuyflowPreForm
// ======================================================
//
// RUOLO:
// - Raccolta dati MINIMI pre-login
// - Scrittura atomica PreConfiguration
// - Redirect SEMPRE a PostLoginHandoff
//
// NON FA:
// - ❌ Nessun fetch
// - ❌ Nessuna auth logic
// - ❌ Nessuna creazione Configuration
//
// SOURCE OF TRUTH:
// - PreConfigurationStore
//
// ======================================================

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { usePreConfigurationStore } from
  "@user/configurator/base_configuration/configuration/pre-configuration.store";
import type { ProductVM } from
  "@shared/lib/viewModels/product/Product.view-model";

interface Props {
  solutionId: string;
  product: ProductVM;
}

export default function BuyflowPreForm({
  solutionId,
  product,
}: Props) {
  /* =========================
     REFS / NAV
  ========================= */
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const resetSetup = useConfigurationSetupStore(s => s.reset);
  /* =========================
     STORE (WRITE ONLY)
  ========================= */
  const setPreConfig = usePreConfigurationStore(
    (s) => s.setPreConfig
  );

  /* =========================
     LOCAL STATE
  ========================= */
  const [businessName, setBusinessName] = useState("");

  /* ======================================================
     CONTINUE FLOW (CANONICAL)
  ====================================================== */
  function continueFlow() {
    const trimmed = businessName.trim();
    if (!trimmed) return;
      // 🔥 SBLOCCO STATE MACHINE
      resetSetup();
    // 🔑 PRE-CONFIG ATOMICA (UNICA RESPONSABILITÀ)
    setPreConfig({
      businessName: trimmed,
      solutionId,
      productId: product.id,
    });

    // 👉 SEMPRE HANDOFF POST-LOGIN
    navigate("/user/post-login", { replace: true });
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <aside ref={ref} className="buyflow-preform">
    <header className="buyflow-preform__head">
     
  
      <h3 className="buyflow-preform__title">
        Iniziamo dalla tua attività
      </h3>
  
      <p className="buyflow-preform__hint">
        Questo ci serve per personalizzare la configurazione.
      </p>
    </header>
  
    <div className="buyflow-preform__body">
      <label className="wd-field">
        <span className="wd-field__label">
          Nome attività
        </span>
  
        <input
          className="wd-input"
          value={businessName}
          onChange={(e) =>
            setBusinessName(e.target.value)
          }
          placeholder="Es. Pizzeria Da Mario"
          autoFocus
        />
      </label>
    </div>
  
    <footer className="buyflow-preform__footer">
      
  
      <button
        className="buyflow-preform__action"
        disabled={!businessName.trim()}
        onClick={continueFlow}
      >
        Continua
      </button>
    </footer>
  </aside>
  

  );
}


=== FILE: pages/solution/ProductCard/ProductCard.tsx
LANG: tsx
SIZE:     2963 bytes
----------------------------------------
// ======================================================
// FE || BuyFlow — ProductCard (NO PRICING)
// ======================================================
//
// RUOLO:
// - Consentire la scelta di UN prodotto
// - Avviare la configurazione BASE
//
// INVARIANTI:
// - Nessuna prezzistica
// - Nessuna option selection
// - Nessuna persistenza
//
// ======================================================
import { useState } from "react";
import type { ProductVM } from "@shared/lib/viewModels/product/Product.view-model";
import BuyflowPreForm from "./PreForm";

interface Props {
  solutionId: string;
  product: ProductVM;
}

export default function ProductCard({ solutionId, product }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`wd-card product-card ${open ? "is-active" : ""}`}>
      {/* ================= HEADER ================= */}
      <div
        className="product-card__body"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
      >
        <h2 className="product-card__title">{product.name}</h2>

        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        {/* ================= OPTIONS ================= */}
        {product.options?.length ? (
          <ul className="product-card__options">
            {product.options.map((o) => (
              <li key={o.id} className="product-card__option">
                <div className="product-card__option-head">
                  <strong>{o.label}</strong>

                  <span className="product-card__option-price">
                    {o.price === 0 ? " Incluso" : `+${o.price}€/${o.type === "yearly" ? "anno" : "mese"}`}
                  </span>
                </div>

                {o.description && (
                  <p className="product-card__option-desc">
                    {o.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {/* ================= CTA ================= */}
        <p className="product-card__hint">
          Avvia una richiesta guidata per questo prodotto
        </p>

        <button
          type="button"
          className="wd-btn wd-btn--secondary"
        >
          Contattaci
        </button>
      </div>

      {/* ================= NEXT STEP ================= */}
      {open && (
        <div
          className="product-card__panel"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="product-card__next-step">
            Nel prossimo passaggio raccoglieremo le informazioni
            essenziali per capire il tuo progetto e guidarti
            nella configurazione.
          </p>

          <BuyflowPreForm
            solutionId={solutionId}
            product={product}
          />
        </div>
      )}
    </div>
  );
}


=== FILE: pages/solution/soltuionpage/[id].tsx
LANG: tsx
SIZE:     5571 bytes
----------------------------------------
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchProducts } from "../../buyflow/api/publiApi/products/products.public.api";
import { API_BASE } from "@shared/lib/config";
import { initWhatsAppScrollWatcher } from "@shared/lib/ui/scrollWatcher";
import { t } from "@shared/aiTranslateGenerator";

import type { ProductVM } from "@shared/lib/viewModels/product/Product.view-model";
import ProductCard from "../ProductCard/ProductCard";
import { solutionDetailClasses as cls } from "../solutionDetail.classes";

/* =========================
   TIPI PUBLIC
========================= */
type PublicSolutionDetail = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  image?: {
    hero: string;
    card: string;
    fallback: string;
  };
  industries?: string[];
};

type SolutionDetailResponse =
  | {
      ok: true;
      solution: PublicSolutionDetail;
      products: ProductVM[];
    }
  | {
      ok: false;
      error: string;
    };

export default function HomeSolutionPage() {
  const { id } = useParams<{ id: string }>();

  const [solution, setSolution] =
    useState<PublicSolutionDetail | null>(null);
  const [products, setProducts] = useState<ProductVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===========================
     WHATSAPP VISIBILITY
  =========================== */
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  /* ===========================
     LOAD SOLUTION + PRODUCTS
  =========================== */
  useEffect(() => {
    if (!id) {
      setError("MISSING_SOLUTION_ID");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/solution?id=${id}`)
      .then((res) => res.json())
      .then((data: SolutionDetailResponse) => {
        if (!data.ok) {
          setError(data.error);
          return;
        }

        setSolution(data.solution);

        (async () => {
          try {
            const full = await fetchProducts();
            setProducts(full);
          } catch {
            setProducts(data.products || []);
          }
        })();
      })
      .catch(() => setError("FAILED_TO_LOAD_SOLUTION"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ===========================
     STATES
  =========================== */
  if (loading)
    return (
      <p className={cls.loading}>
        {t("solution.detail.loading")}
      </p>
    );
  
  if (error)
    return (
      <p className={cls.error}>
        {t("solution.detail.error.generic")}
      </p>
    );
  
  if (!solution) return null;

  const heroImage = solution.image?.fallback;

  return (
    <main className={cls.page}>
      {/* ================= HERO ================= */}
      <section
        className={cls.hero}
        style={{
          backgroundImage: heroImage
            ? `url(${heroImage})`
            : undefined,
        }}
      >
        <div className={cls.heroOverlay}>
          <h1 className={cls.heroTitle}>
            {t("solution.detail.hero.title", {
              solution: solution.name,
            })}
          </h1>
          <p className={cls.heroSubtitle}>
            {solution.description ||
              t("solution.detail.hero.subtitle.fallback")}
          </p>
        </div>
      </section>

      {/* ================= EXPLANATION ================= */}
      <section className={`${cls.section} ${cls.explanation}`}>
        <h2>
          {t("solution.detail.explanation.h2", {
            solution: solution.name,
          })}
        </h2>

        {solution.longDescription ? (
          <p className={cls.longDescription}>
            {solution.longDescription}
          </p>
        ) : (
          <p className={cls.longDescription}>
            {t("solution.detail.explanation.fallback", {
              solution: solution.name,
            })}
          </p>
        )}
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="section">
        <h2>{t("solution.detail.overview.h2")}</h2>
        <p>{t("solution.detail.overview.p")}</p>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className={`${cls.section}${cls.how}`}>
        <h2>{t("solution.detail.how.h2")}</h2>
        <ol className={cls.steps}>
          <li>
            <strong>
              {t("solution.detail.how.step1.title")}
            </strong>
            <br />
            {t("solution.detail.how.step1.text")}
          </li>

          <li>
            <strong>
              {t("solution.detail.how.step2.title")}
            </strong>
            <br />
            {t("solution.detail.how.step2.text")}
          </li>

          <li>
            <strong>
              {t("solution.detail.how.step3.title")}
            </strong>
            <br />
            {t("solution.detail.how.step3.text")}
          </li>
        </ol>
      </section>

      {/* ================= PRODUCTS ================= */}
      {products.length > 0 && (
        <section className="section">
          <h3>{t("solution.detail.products.h3")}</h3>

          <div className={cls.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                solutionId={solution.id}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}


=== FILE: pages/solution/soltuionpage/index.tsx
LANG: tsx
SIZE:      878 bytes
----------------------------------------
import { useEffect } from "react";

import { initWhatsAppScrollWatcher } from "@shared/lib/ui/scrollWatcher";
import { t } from "@shared/aiTranslateGenerator";

import SolutionsSection from "../../buyflow/solutions/SolutionSection";

export default function Solutions() {
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className="solutions-page">
      {/* ================= INTRO ================= */}
      <section className="solutions-intro section">
        <h1>{t("solutions.h1")}</h1>

        <p className="solutions-intro-text">
          {t("solutions.intro.p1")}
        </p>

        <p className="solutions-intro-text">
          {t("solutions.intro.p2")}
        </p>
      </section>

      {/* ================= CATALOG ================= */}
      <SolutionsSection />
    </main>
  );
}


=== FILE: pages/solution/solutionDetail.classes.ts
LANG: ts
SIZE:      959 bytes
----------------------------------------
// ============================================================
// FE || components/solutions/solutionDetail.classes.ts
// ============================================================
// SOLUTION DETAIL — CLASS REGISTRY
// ============================================================

export const solutionDetailClasses = {
    /** PAGE */
    page: "solution-page",
  
    /** GENERIC SECTION */
    section: "solution-section",
  
    /** STATES */
    loading: "solution-loading",
    error: "solution-error",
  
    /** HERO */
    hero: "solution-hero",
    heroOverlay: "solution-hero__overlay",
    heroTitle: "solution-hero__title",
    heroSubtitle: "solution-hero__subtitle",
  
    /** EXPLANATION */
    explanation: "solution-explanation",
    longDescription: "solution-long-description",
  
    /** HOW */
    how: "solution-how",
    steps: "solution-steps",
  
    /** PRODUCTS */
    productsGrid: "solution-products-grid wd-grid",
  };
  

=== FILE: pages/vision/index.tsx
LANG: tsx
SIZE:     1908 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/vision/index.tsx
// ======================================================
// VISION — MARKETING / PRE-LOGIN
//
// AI COMMENT (STRUTTURA):
// - Applicazione shell globale
// - Separazione layout / sezioni
// - Nessun contenuto modificato
// ======================================================

import { useEffect } from "react";
import { initWhatsAppScrollWatcher } from "@shared/lib/ui/scrollWatcher";
import { t } from "@shared/aiTranslateGenerator";
import { visionClasses as cls } from "./vision.classes";

export default function Vision() {
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className={cls.pageShell}>
      <div className={cls.pageLayout}>
        {/* ================= HERO ================= */}
        <section className={cls.heroSection}>
          <h1>{t("vision.hero.h1")}</h1>
          <p className={cls.heroSubtitle}>
            {t("vision.hero.subtitle")}
          </p>
        </section>

        {/* ================= VOICE ================= */}
        <section className={cls.section}>
          <h2>{t("vision.section.voice.h2")}</h2>
          <p>{t("vision.section.voice.p")}</p>
        </section>

        {/* ================= REGISTRY ================= */}
        <section className={cls.section}>
          <h2>{t("vision.section.registry.h2")}</h2>

          <p>{t("vision.section.registry.p1")}</p>
          <p>{t("vision.section.registry.p2")}</p>

          <div className={cls.sectionLinks}>
            <a href="/registro-pubblico">
              {t("vision.section.registry.link.registry")}
            </a>
            <a href="/archivio-pubblico">
              {t("vision.section.registry.link.archive")}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}


=== FILE: pages/vision/vision.classes.ts
LANG: ts
SIZE:      601 bytes
----------------------------------------
// ======================================================
// FE || marketing/pages/vision/vision.classes.ts
// ======================================================
// VISION — CLASS REGISTRY
// ======================================================

export const visionClasses = {
    /** PAGE */
    pageShell: "page-shell page-vision",
    pageLayout: "page-layout page-layout--vertical",
  
    /** SECTIONS */
    heroSection: "page-section page-section--hero",
    heroSubtitle: "page-hero-subtitle",
    section: "page-section",
  
    /** LINKS */
    sectionLinks: "section-links",
  };
  

francescomaggi@MacBook-Pro marketing % 