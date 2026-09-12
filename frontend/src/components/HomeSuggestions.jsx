import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { isDiscountActive, sortByDiscountPriority } from '../utils/discount';
import { useCountdown } from '../hooks/useCountdown';

function OfferTile({ product }) {
  const hasDiscount = isDiscountActive(product);
  const timeLeft = useCountdown(product.discount_ends_at);
  const img = product.images.find((im) => im.is_primary) || product.images[0];

  return (
    <Link
      to={`/products/${product.id}`}
      className="relative rounded-2xl overflow-hidden group flex-none w-[42%] sm:w-[23%] h-40 snap-start"
    >
      {img && (
        <img
          src={img.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {hasDiscount && (
        <span className="absolute top-2 left-2 bg-[#FF3F6C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
          SALE
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white text-xs font-semibold truncate">{product.name}</p>
        {hasDiscount ? (
          <>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-white/70 text-[10px] line-through">₹{product.price}</span>
              <span className="text-[#4ADE80] text-[11px] font-bold">₹{product.discount_price}</span>
            </div>
            {timeLeft && (
              <p className="text-[#FFD166] text-[10px] font-bold mt-0.5">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </p>
            )}
          </>
        ) : (
          <p className="text-white/90 text-[11px]">₹{product.price}</p>
        )}
      </div>
    </Link>
  );
}

function HomeSuggestions({ products }) {
  const offerRow = sortByDiscountPriority(
    [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  ).slice(0, 8);

  // Featured Products section — sabse naye products pehle, sequence mein
  const featuredGrid = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 12);

  if (offerRow.length === 0 && featuredGrid.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {offerRow.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 -mx-3 sm:-mx-6 px-3 sm:px-6">
            <span className="bg-gradient-to-r from-[#FF3F6C] to-[#FF9F00] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
              🔥 Hot
            </span>
            <h2 className="text-lg font-black text-[#282C3F]">Discount Offers For You</h2>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-3 sm:-mx-6 px-3 sm:px-6 pb-1 mb-8">
            {offerRow.map((product) => (
              <OfferTile key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {featuredGrid.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#282C3F]">Featured Products</h2>
            <Link to="/" className="text-[#FF3F6C] text-sm font-semibold">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredGrid.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomeSuggestions;