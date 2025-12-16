import type { ProductDTO } from "../../lib/types";
import { eur } from "../../utils/format";

interface Props {
  product: ProductDTO;
  onSelect: (product: ProductDTO) => void;
}

export default function ProductCard({ product, onSelect }: Props) {
  return (
    <div className="product-card card">
      <div className="product-card__body">
        <h2 className="product-card__title">{product.title}</h2>

        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        <div className="product-card__price">
          {eur.format(product.basePrice)}
        </div>
      </div>

      <div className="product-card__footer">
        <button
          className="btn btn-primary"
          onClick={() => onSelect(product)}
        >
          Configura
        </button>
      </div>
    </div>
  );
}
