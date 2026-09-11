import { Link } from 'react-router-dom';

function HomeSuggestions({ products }) {
  const featured = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 9);

  if (featured.length === 0) return null;

  const [, ...rest] = featured;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4 -mx-3 px-3">
        <span className="bg-gradient-to-r from-[#FF3F6C] to-[#FF9F00] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
          🔥 Hot
        </span>
        <h2 className="text-lg font-black text-[#282C3F]">Discount Offers For You</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-3 px-3 pb-1">
        {rest.map((product, i) => {
          const img = product.images.find((im) => im.is_primary) || product.images[0];
          return (
            <Link
              key={product.id}
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