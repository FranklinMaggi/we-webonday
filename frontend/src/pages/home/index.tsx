import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../../lib/products/productsApi";
import type { ProductDTO } from "../../dto/productDTO";
import { normalizeProduct } from "../../lib/normalizers/productNormalizer";
import HomeHero from "../../components/hero/home/HomeHero"
import ProductCard from "../../components/catalog/ProductCard";
import OptionSelector from "../../components/catalog/OptionSelector";
import CartPreview from "../../components/catalog/CartPreview";

import "./home.css";

export default function Home() {
  
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [selected, setSelected] = useState<ProductDTO | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const raw = await fetchProducts();
        const normalized = (raw ?? []).map((p: any) =>
          normalizeProduct(p)
        );
        if (!cancelled) setProducts(normalized);
      } catch (err: any) {
        console.error("[Home] fetchProducts error:", err);
        if (!cancelled) {
          setError(err?.message || "Errore caricamento prodotti");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasProducts = useMemo(() => products.length > 0, [products]);

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Il tuo e-commerce pronto per vendere</h1>
          <p>
            Webonday crea siti professionali per PMI con e-commerce,
            pagamenti online e gestione ordini semplice.
          </p>
        </div>

        <div className="hero-image">
          <HomeHero/>
        </div>
      </section>

      {/* ================= CATALOGO ================= */}
      <section className="catalog">
        <h2>Catalogo Webonday</h2>

        {loading && <p>Caricamento prodotti…</p>}

        {!loading && error && (
          <div style={{ padding: 12 }}>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={() => window.location.reload()}>
              Riprova
            </button>
          </div>
        )}

        {!loading && !error && !hasProducts && (
          <p>Nessun prodotto disponibile al momento.</p>
        )}

        {!loading && !error && hasProducts && (
          <div className="product-list">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => {
                  setSelected(prod);
                  setSelectedOptions([]);
                }}
              />
            ))}
          </div>
        )}

        {/* ================= CONFIGURATORE ================= */}
        {selected && (
          <div className="product-configurator">
            <OptionSelector
              options={selected.options}
              selected={selectedOptions}
              onChange={setSelectedOptions}
            />

            <CartPreview
              product={selected}
              selectedOptions={selectedOptions}
            />
          </div>
        )}
      </section>
    </main>
  );
}
