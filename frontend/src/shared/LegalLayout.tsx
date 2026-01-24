import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/Legal/legal.css";

interface LegalLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

// Mappa pagine legali (immutabile)
export const legalPages = [
  { id: "statuto", title: "Statuto", path: "/legal/statuto" },
  { id: "regolamento", title: "Regolamento Interno", path: "/legal/regolamento" },
  { id: "contrattocliente", title: "Contratto Cliente", path: "/legal/contrattocliente" },
  { id: "termini", title: "Termini di Servizio", path: "/legal/termini" },
  { id: "privacy", title: "Privacy Policy", path: "/legal/privacy" },
  { id: "proprieta", title: "Proprietà Intellettuale", path: "/legal/proprietaintellettuale" },
];

export default function LegalLayout({ children, title, subtitle }: LegalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determina pagina corrente (memo: evita findIndex ad ogni render non necessario)
  const currentIndex = useMemo(() => {
    const idx = legalPages.findIndex((p) => p.path === location.pathname);
    return idx === -1 ? 0 : idx; // fallback robusto
  }, [location.pathname]);

  const [slideDirection, setSlideDirection] = useState<"left" | "right" | "none">("none");

  // Gestione timeout: evita setTimeout pendenti se l'utente naviga velocemente
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= legalPages.length) return;

      // Stop eventuali timeout precedenti: previene race di navigazione + slide state incoerente
      clearPendingTimeout();

      setSlideDirection(index > currentIndex ? "right" : "left");

      timeoutRef.current = window.setTimeout(() => {
        navigate(legalPages[index].path);
        setSlideDirection("none");
        timeoutRef.current = null;
      }, 250);
    },
    [currentIndex, navigate, clearPendingTimeout]
  );

  // Cleanup globale su unmount (evita memory leak)
  useEffect(() => {
    return () => clearPendingTimeout();
  }, [clearPendingTimeout]);

  // Frecce tastiera
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPage(currentIndex + 1);
      if (e.key === "ArrowLeft") goToPage(currentIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, goToPage]);

  // Swipe touch per mobile
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;

      if (delta > 80) goToPage(currentIndex - 1);
      if (delta < -80) goToPage(currentIndex + 1);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, goToPage]);

  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">{title || legalPages[currentIndex]?.title}</h1>
        {subtitle && <p className="legal-subtitle">{subtitle}</p>}
      </header>

      {currentIndex > 0 && (
        <button className="legal-arrow left" onClick={() => goToPage(currentIndex - 1)}>
          ❮
        </button>
      )}

      {currentIndex < legalPages.length - 1 && (
        <button className="legal-arrow right" onClick={() => goToPage(currentIndex + 1)}>
          ❯
        </button>
      )}

      <div className="legal-pagination">
        {legalPages.map((p, i) => (
          <span
            key={p.id}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => goToPage(i)}
          />
        ))}
      </div>

      <section className={`legal-content slide-${slideDirection}`}>{children}</section>

      <footer className="legal-footer">© {new Date().getFullYear()} WebOnDay S.r.l. — Documenti Legali</footer>
    </div>
  );
}
