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
