// ============================================================
// FE || components/solutions/SolutionsSection.tsx
// ============================================================
//
// AI-SUPERCOMMENT
// - Sezione FE autonoma (data-fetch + render)
// - Orchestratore funnel: selection → login / start
// - Nessuna conoscenza del layout di pagina
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@shared/lib/store/auth.store";

import { fetchPublicSolutions } from
  "../../../../shared/lib/publicApi/solutions/solutions.public.api";
import { useConfigurationSetupStore } from
  "@src/user/editor/api/type/configurator/configurationSetup.store";

import SolutionCard from "./SolutionCard";
import { solutionsSectionClasses as cls } from "./solutionsSection.classes";
import { t } from "@shared/aiTranslateGenerator";
import { UserLoginForm } from "@src/marketing/components/auth/UserLoginForm";

type PublicSolutionCard = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

export default function SolutionsSection() {
  /* ===========================
     STATE
  =========================== */
  const [solutions, setSolutions] = useState<PublicSolutionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");

  /* ===========================
     STORES / ROUTER
  =========================== */
  const navigate = useNavigate();
  const { setField } = useConfigurationSetupStore();
  const { user, ready } = useAuthStore();

  const isLogged = ready && Boolean(user);

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

  /* ===========================
     ACTIONS
  =========================== */
  function handleSelectSolution(id: string) {
    setSelectedId(id);
    setField("solutionId", id);
    setField("productId", "iscrizione-gratuita");
  }

  function handleStartConfiguration() {
    if (!businessName.trim()) return;

    setField("businessName", businessName.trim());

    navigate("/user/post-login", { replace: true });
  }

  /* ===========================
     RENDER
  =========================== */
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
        <p className={cls.error}>{error}</p>
      )}
  
      {!loading && !error && solutions.length === 0 && (
        <p className={cls.empty}>
          {t("solutions.empty")}
        </p>
      )}
  
      {!loading && !error && solutions.length > 0 && (
        <>
          {/* ================= GRID ================= */}
          <div className={cls.grid}>
            {solutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                selected={solution.id === selectedId}
                onSelect={() =>
                  handleSelectSolution(solution.id)
                }
              />
            ))}
          </div>
  
          {/* ================= GATED STEP ================= */}
          {selectedId && ready && (
            <section
              id="solution-login"
              className={cls.loginSection}
            >
              {!isLogged ? (
                <>
                  <h3 className={cls.loginTitle}>
                    {t("solutions.login.title")}
                  </h3>
  
                  <UserLoginForm
                    context="solution"
                    redirect={`/user/post-login?solution=${selectedId}`}
                  />
                </>
              ) : (
                <>
                  <div className="hero-inner">
                    <h3 className={cls.loginTitle}>
                      {t("solutions.start.title")}
                    </h3>
  
                    <div className="home-hero__form">
                      <label className="wd-field">
                        <span className="wd-field__label">
                          {t("solution.businessName.label")}
                        </span>
  
                        <input
                          className="wd-input wd-input--xl home-hero-input"
                          placeholder={t(
                            "solution.businessName.placeholder"
                          )}
                          value={businessName}
                          onChange={(e) =>
                            setBusinessName(e.target.value)
                          }
                        />
                      </label>
  
                      <button
                        className="home-hero__cta"
                        disabled={!businessName.trim()}
                        onClick={handleStartConfiguration}
                      >
                        {t("solution.startConfiguration")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}
        </>
      )}
    </section>
  );
}