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
