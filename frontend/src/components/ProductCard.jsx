import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-sky-200 transition-all duration-300 overflow-hidden">
        {primaryImage && (
          <img
            src={primaryImage.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-orange-600 font-bold mt-1">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;