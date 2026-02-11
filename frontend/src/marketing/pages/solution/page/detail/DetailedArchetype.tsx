/* ======================================================
   FE || SOLUTION PREVIEW PAGE (CLEAN VERSION)
   RUOLO:
   - Carica preset pubblici per solutionId
   - Mostra hero semplice
   - Mostra selezione preset
   - Naviga al login con solution + preset
====================================================== */

/* =========================
   REACT / ROUTER
========================= */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* =========================
   SHARED
========================= */
import { apiFetch } from "@src/shared/lib/api";
import { initWhatsAppScrollWatcher } from "@src/shared/ui/scrollWatcher";
import { t } from "@shared/aiTranslateGenerator";

/* =========================
   TYPES
========================= */
import type { SitePresetPublicDTO } from "../../api/DataTransferObject/types/preset.types";

/* =========================
   UI
========================= */
import { solutionDetailClasses as cls } from "../../solution-with-template/solutionDetail.classes";

export default function HomeSolutionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [presets, setPresets] = useState<SitePresetPublicDTO[]>([]);
  const [activePreset, setActivePreset] =
    useState<SitePresetPublicDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const businessName = "Il tuo business"; // seed temporaneo

  /* =========================
     WHATSAPP VISIBILITY
  ========================= */
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  /* =========================
     LOAD PRESETS
  ========================= */
  useEffect(() => {
    if (!id) {
      setError("MISSING_SOLUTION_ID");
      setLoading(false);
      return;
    }

    setLoading(true);

    apiFetch<{ ok: true; presets: SitePresetPublicDTO[] }>(
      `/api/preset/list?solutionId=${id}`
    )
      .then((res) => {
        if (!res?.ok) {
          setError("FAILED_TO_LOAD_PRESETS");
          return;
        }

        setPresets(res.presets ?? []);
        setActivePreset(res.presets?.[0] ?? null);
      })
      .catch(() => {
        setError("FAILED_TO_LOAD_PRESETS");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  /* =========================
     STATES
  ========================= */
  if (loading) {
    return (
      <p className={cls.loading}>
        {t("solution.detail.loading")}
      </p>
    );
  }

  if (error) {
    return (
      <p className={cls.error}>
        {t("solution.detail.error.generic")}
      </p>
    );
  }

  if (!id) return null;

  /* =========================
     RENDER
  ========================= */
  return (
    <main className={cls.page}>
      {/* ================= HERO ================= */}
      <section
        className={cls.hero}
        style={{
          backgroundImage: activePreset?.preview?.heroImageKey
            ? `url(/r2/${activePreset.preview.heroImageKey})`
            : undefined,
        }}
      >
        <div className={cls.heroOverlay}>
          <h1 className={cls.heroTitle}>
            {businessName}
          </h1>

          <p className={cls.heroSubtitle}>
            {t("solution.preview.subtitle.fallback")}
          </p>
        </div>
      </section>

      {/* ================= PRESET STRIP ================= */}
      {presets.length > 0 && (
        <section className="solution-preset-strip">
          <h2>
            {t("solution.preview.presets.title")}
          </h2>

          <div className="preset-grid">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  setActivePreset(preset)
                }
                className={`preset-thumb ${
                  preset.id === activePreset?.id
                    ? "is-active"
                    : ""
                }`}
              >
                <img
                  src={`/r2/${preset.preview.heroImageKey}`}
                  alt={preset.name}
                  loading="lazy"
                />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          {activePreset && (
            <div style={{ marginTop: 32 }}>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/user/login?solution=${id}&preset=${activePreset.id}`
                  )
                }
              >
                {t("solution.startConfiguration")}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
