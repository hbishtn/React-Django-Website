import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-pink-600 hover:underline">
        &larr; Back to shop
      </Link>

      <div className="max-w-3xl mx-auto mt-6 bg-white rounded-xl shadow-md overflow-hidden md:flex">
        {primaryImage && (
          <img
            src={primaryImage.image}
            alt={product.name}
            className="w-full md:w-1/2 h-80 object-cover"
          />
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-pink-600 text-xl font-semibold mt-2">₹{product.price}</p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <p className="text-sm text-gray-400 mt-4">Stock: {product.stock}</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;