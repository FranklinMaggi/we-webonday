import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../../lib/productsApi";
import type { Product } from "../../lib/types";
import { normalizeProduct } from "../../lib/normalizers/productNormalizer";
import ProductCard from "../../components/catalog/ProductCard";
import OptionSelector from "../../components/catalog/OptionSelector";
import CartPreview from "../../components/catalog/CartPreview";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
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
        const normalized = (raw ?? []).map((p: any) => normalizeProduct(p));
        if (!cancelled) setProducts(normalized);
      } catch (err: any) {
        console.error("[Home] fetchProducts error:", err);
        if (!cancelled) setError(err?.message || "Errore caricamento prodotti");
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
    <div className="catalog">
      <h1>Catalogo WebOnDay</h1>

      {loading && <p>Caricamento prodotti…</p>}

      {!loading && error && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{error}</p>
          <button onClick={() => window.location.reload()}>Riprova</button>
        </div>
      )}

      {!loading && !error && !hasProducts && (
        <p>Nessun prodotto disponibile al momento.</p>
      )}

      {!loading && !error && hasProducts && (
        <div className="product-list">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={(prod) => {
                setSelected(prod);
                setSelectedOptions([]);
              }}
            />
          ))}
        </div>
      )}

      {selected && (
        <>
          <OptionSelector
            options={selected.options}
            selected={selectedOptions}
            onChange={setSelectedOptions}
          />

          <CartPreview product={selected} selectedOptions={selectedOptions} />
        </>
      )}
    </div>
  );
}
