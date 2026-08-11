import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import RelatedProductCard from './RelatedProductCard';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { token } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  useEffect(() => {
    if (product) {
      fetch(`${import.meta.env.VITE_API_URL}/products/`)
        .then((response) => response.json())
        .then((data) => {
          const related = data
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 3);
          setRelatedProducts(related);
        });
    }
  }, [product]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/review/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    })
      .then((response) => response.json())
      .then(() => {
        setReviewSubmitted(true);
        fetch(`${import.meta.env.VITE_API_URL}/products/${id}/`)
          .then((response) => response.json())
          .then((data) => setProduct(data));
      });
  };

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

        <div className="p-6 flex-1">
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

          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-[#282C3F] mb-4">Reviews</h3>

            {token && (
              <form onSubmit={handleReviewSubmit} className="mb-6 bg-[#F5F5F6] p-4 rounded-xl">
                <p className="text-sm font-medium text-[#282C3F] mb-2">Rate this product</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-[#FF9F00]' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="bg-[#FF3F6C] text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-40"
                >
                  Submit Review
                </button>
                {reviewSubmitted && (
                  <p className="text-green-600 text-sm mt-2">Thanks for your review!</p>
                )}
              </form>
            )}

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-3">
                {product.reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#282C3F]">{review.username}</span>
                      <span className="text-[#FF9F00] text-sm">
                        {'★'.repeat(review.rating)}
                        <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-500 mt-1">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8 pl-4">
          <h3 className="text-sm font-semibold text-[#7E818C] uppercase tracking-wide mb-3">
            You May Also Like
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {relatedProducts.map((relProduct) => (
              <RelatedProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;