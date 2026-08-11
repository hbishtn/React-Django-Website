import { Link } from 'react-router-dom';

function RelatedProductCard({ product }) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:border-[#FF3F6C]/30 transition-all"
    >
      {primaryImage && (
        <img
          src={primaryImage.image}
          alt={product.name}
          className="w-full h-24 object-cover"
        />
      )}
      <div className="p-2">
        <p className="text-xs font-medium text-[#282C3F] truncate">{product.name}</p>
        <p className="text-xs font-bold text-[#FF3F6C] mt-0.5">₹{product.price}</p>
      </div>
    </Link>
  );
}

export default RelatedProductCard;