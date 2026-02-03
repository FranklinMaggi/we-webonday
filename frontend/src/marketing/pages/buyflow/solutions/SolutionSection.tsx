// ============================================================
// FE || components/solutions/SolutionsSection.tsx
// ============================================================
//
// AI-SUPERCOMMENT
// - Sezione FE autonoma (data-fetch + render)
// - Orchestratore funnel: selection → login
// - Nessuna conoscenza del layout di pagina
// ============================================================

import { useEffect, useState } from "react";
import { fetchPublicSolutions } from
  "../../../../shared/lib/publicApi/solutions/solutions.public.api";
import { useConfigurationSetupStore } from "@src/shared/domain/user/configurator/configurationSetup.store";
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
  const [solutions, setSolutions] = useState<PublicSolutionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setField } = useConfigurationSetupStore();
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
        <>
          {/* ================= GRID ================= */}
          <div className={cls.grid}>
  {solutions.map((solution) => (
    <SolutionCard
      key={solution.id}
      solution={solution}
      selected={solution.id === selectedId}
      onSelect={() => {
        setSelectedId(solution.id);
        setField("solutionId", solution.id);
        setField("productId", "iscrizione-gratuita");
      }}
    />
  ))}
</div>

          {/* ================= LOGIN (GATED) ================= */}
          {selectedId && (
            <section
              id="solution-login"
              className={cls.loginSection}
            >
              <h3 className={cls.loginTitle}>
                {t("solutions.login.title")}
              </h3>

              <UserLoginForm
                context="solution"
                redirect={`/user/post-login?solution=${selectedId}`}
              />
            </section>
          )}
        </>
      )}
    </section>
  );
}