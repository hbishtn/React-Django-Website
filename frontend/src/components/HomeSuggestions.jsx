import { Link } from 'react-router-dom';

function isDiscountActive(product) {
  if (!product.discount_price) return false;
  if (!product.discount_ends_at) return true;
  return new Date(product.discount_ends_at).getTime() > Date.now();
}

function discountMargin(product) {
  return Number(product.price) - Number(product.discount_price);
}

function HomeSuggestions({ products }) {
  // Pehle sabse zyada discount margin wale products dikhao. Agar discount
  // wale products kam hain, to baaki jagah recent products se bhar dete
  // hain — taaki row kabhi khali/adhuri na dikhe.
  const discounted = products
    .filter(isDiscountActive)
    .sort((a, b) => discountMargin(b) - discountMargin(a));

  const nonDiscounted = [...products]
    .filter((p) => !isDiscountActive(p))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const rest = [...discounted, ...nonDiscounted].slice(0, 8);

  if (rest.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4 -mx-3 px-3">
        <span className="bg-gradient-to-r from-[#FF3F6C] to-[#FF9F00] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
          🔥 Hot
        </span>
        <h2 className="text-lg font-black text-[#282C3F]">Discount Offers For You</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-3 px-3 pb-1">
        {rest.map((product) => {
          const img = product.images.find((im) => im.is_primary) || product.images[0];
          const hasDiscount = isDiscountActive(product);
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

              {hasDiscount && (
                <span className="absolute top-2 left-2 bg-[#FF3F6C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  SALE
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-semibold truncate">{product.name}</p>
                {hasDiscount ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[#FF8A9B] text-[10px] line-through">₹{product.price}</span>
                    <span className="text-[#4ADE80] text-[11px] font-bold">₹{product.discount_price}</span>
                  </div>
                ) : (
                  <p className="text-white/90 text-[11px]">₹{product.price}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HomeSuggestions;