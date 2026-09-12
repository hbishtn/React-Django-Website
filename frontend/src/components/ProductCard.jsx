import { Link } from 'react-router-dom';
import { useState } from 'react';
import PriceDisplay from './PriceDisplay';

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  const isNew =
    (new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24) <= 7;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted(!wishlisted);
        }}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill={wishlisted ? '#FF3F6C' : 'none'}
          stroke={wishlisted ? '#FF3F6C' : '#9CA3AF'}
          strokeWidth="2"
        >
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
        </svg>
      </button>

      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F6]">
          {primaryImage && (
            <img
              src={primaryImage.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {isNew && (
            <span className="absolute top-2 left-2 bg-[#14958F] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
              New
            </span>
          )}

          {product.discount_price && (
            <span className="absolute bottom-2 left-2 bg-[#FF3F6C] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
              Sale
            </span>
          )}
        </div>

        <div className="p-2.5 sm:p-3">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide truncate">
            {product.category_name}
          </p>
          <h3 className="text-sm text-[#282C3F] font-semibold truncate mt-0.5">
            {product.name}
          </h3>

          <div className="mt-1.5">
            <PriceDisplay
              price={product.price}
              discountPrice={product.discount_price}
              discountEndsAt={product.discount_ends_at}
            />
          </div>

          {lowStock && (
            <p className="text-[#FF9F00] text-[11px] font-semibold mt-1">
              Only {product.stock} left!
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;