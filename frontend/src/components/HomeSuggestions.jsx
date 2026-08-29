import { Link } from 'react-router-dom';
import HeroBanner from './HeroBanner';

function HomeSuggestions({ products }) {
  const featured = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 9);

  if (featured.length === 0) return null;

  const [big, ...rest] = featured;

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-lg font-bold text-[#282C3F] mb-4">Curated For You</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Big featured tile - auto swipes through admin-selected products */}
        <HeroBanner fallbackProduct={big} />

        {/* Small tiles */}
        {rest.map((product, i) => {
          const img = product.images.find((im) => im.is_primary) || product.images[0];
          return (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="relative rounded-2xl overflow-hidden group aspect-square"
            >
              {img && (
                <img
                  src={img.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-semibold truncate">{product.name}</p>
                <p className="text-white/90 text-[11px]">₹{product.price}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HomeSuggestions;