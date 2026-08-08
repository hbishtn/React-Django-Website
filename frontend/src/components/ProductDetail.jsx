import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-pink-600 hover:underline">
        &larr; Back to shop
      </Link>

      <div className="max-w-3xl mx-auto mt-6 bg-white rounded-xl shadow-md overflow-hidden md:flex">
        <div className="relative w-full md:w-1/2">
          <img
            src={product.images[currentImageIndex]?.image}
            alt={product.name}
            className="w-full h-80 object-cover"
          />

          {product.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? product.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282C3F" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === product.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282C3F" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {product.images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  ></div>
                ))}
              </div>
            </>
          )}
        </div>

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