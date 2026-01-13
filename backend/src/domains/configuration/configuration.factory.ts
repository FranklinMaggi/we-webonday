/**buildConfigurationId, slugify */


/* =========================
   ID HELPERS (DETERMINISTICO)
========================= */
export function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }


/**
 * ConfigurationId deterministico
 * pattern: {businessSlug}:{solutionId}
 * es: pizzeria-da-mario:website-basic
 */
export function buildConfigurationId(businessName: string, solutionId: string) {
    return `${slugify(businessName)}:${slugify(solutionId)}`;
  }
  

  