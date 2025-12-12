import { useEffect, useState } from "react";
import { fetchProducts } from "../../lib/productsApi";
import type { Product } from "../../lib/types";
import ProductCard from "../../components/catalog/ProductCard";
import OptionSelector from "../../components/catalog/OptionSelector";
import CartPreview from "../../components/catalog/CartPreview";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchProducts().then((x) => console.log("NORMALIZED:", x));
  }, []);

  return (
    <div className="catalog">
      <h1>Our Products</h1>

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

      {selected && (
        <>
          <OptionSelector
            options={selected.options}
            selected={selectedOptions}
            onChange={setSelectedOptions}
          />
          <CartPreview
            product={selected}
            selectedOptions={selectedOptions}
          />
        </>
      )}
    </div>
  );
}
