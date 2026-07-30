import { Link } from 'react-router-dom';
import { useState } from 'react';

const accentColors = ['#FF3F6C', '#14958F', '#FF9F00'];

function ProductCard({ product, index = 0 }) {
  const [wishlisted, setWishlisted] = useState(false);
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const accent = accentColors[index % accentColors.length];

  const isNew =
    (new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24) <= 7;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted(!wishlisted);
        }}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
      >
        <span className={wishlisted ? 'text-[#FF3F6C]' : 'text-gray-300'}>
          ♥
        </span>
      </button>

      {isNew && (
        <span className="absolute top-2 left-2 z-10 bg-[#14958F] text-white text-[10px] font-bold uppercase px-2 py-1 rounded">
          New
        </span>
      )}

      <Link to={`/products/${product.id}`}>
        {primaryImage && (
          <img
            src={primaryImage.image}
            alt={product.name}
            className="w-full h-56 object-cover"
          />
        )}
        <div className="h-0.5 w-full" style={{ backgroundColor: accent }} />

        <div className="p-3">
          <h3 className="text-sm text-[#282C3F] font-semibold truncate">
            {product.name}
          </h3>
          <p className="text-xs text-[#7E818C] mt-0.5">{product.category_name}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#282C3F] font-bold">₹{product.price}</span>
          </div>

          {lowStock && (
            <p className="text-[#FF9F00] text-xs font-semibold mt-1">
              Only {product.stock} left!
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;