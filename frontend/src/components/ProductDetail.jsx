import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RelatedProductCard from './RelatedProductCard';
import LoadingScreen from './LoadingScreen';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { token, isStaff } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [colorVariants, setColorVariants] = useState([]);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}/`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
}, [id]);

  useEffect(() => {
    if (product) {
      fetch(`${import.meta.env.VITE_API_URL}/products/?page_size=100`)
        .then((response) => response.json())
        .then((data) => {
          const productList = data.results || data;
          const related = productList
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 3);
          setRelatedProducts(related);
        });
    }
  }, [product]);

  useEffect(() => {
    if (product && product.color_group) {
      fetch(`${import.meta.env.VITE_API_URL}/products/`)
        .then((response) => response.json())
        .then((data) => {
          const variants = data.filter((p) => p.color_group === product.color_group);
          setColorVariants(variants);
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

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!product) {
    return <LoadingScreen message="Wait please..." />;
}

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  const stockStatus =
    product.stock === 0
      ? { text: 'Out of stock', className: 'bg-red-50 text-red-600' }
      : product.stock <= 5
      ? { text: `Only ${product.stock} left`, className: 'bg-amber-50 text-amber-700' }
      : { text: 'In stock', className: 'bg-green-50 text-green-700' };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm overflow-hidden">
          <Link to="/" className="text-[#7E818C] hover:text-[#FF3F6C] transition-colors shrink-0">
            Home
          </Link>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="text-[#282C3F] font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10 grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex gap-3">
            {product.images.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2 w-16 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === currentImageIndex ? 'border-[#FF3F6C]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex-1 bg-[#F5F5F6] rounded-2xl overflow-hidden aspect-square">
              <img
                src={product.images[currentImageIndex]?.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282C3F" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>

                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 sm:hidden">
                    {product.images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i === currentImageIndex ? 'bg-[#FF3F6C]' : 'bg-white/70'
                        }`}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          {product.category_name && (
            <p className="text-sm text-[#FF3F6C] font-medium">{product.category_name}</p>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#282C3F] mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            {avgRating > 0 ? (
              <>
                <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                  {avgRating.toFixed(1)} ★
                </span>
                <span className="text-sm text-[#7E818C]">
                  {product.reviews.length} review{product.reviews.length > 1 ? 's' : ''}
                </span>
              </>
            ) : (
              <span className="text-sm text-[#7E818C]">No reviews yet</span>
            )}
          </div>

          <p className="text-3xl font-bold text-[#282C3F] mt-4">₹{product.price}</p>

          <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${stockStatus.className}`}>
            {stockStatus.text}
          </span>

          {colorVariants.length > 1 && (
            <div className="mt-6">
              <p className="text-sm text-[#282C3F] font-medium mb-2">Shades</p>
              <div className="flex flex-wrap gap-2.5">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => navigate(`/products/${variant.id}`)}
                    className={`w-9 h-9 rounded-full border-2 transition-transform ${
                      variant.id === product.id ? 'border-[#282C3F] scale-110' : 'border-white'
                    }`}
                    style={{ backgroundColor: variant.color_hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
                    title={variant.color_name}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full mt-8 bg-[#FF3F6C] text-white font-semibold py-3.5 rounded-xl hover:bg-[#e6355f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? 'Added ✓' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
          </button>

          {isStaff && (
            <Link
              to={`/x7k9-edit-product/${product.id}`}
              className="mt-3 block text-center border border-[#282C3F] text-[#282C3F] py-2.5 rounded-xl text-sm font-medium hover:bg-[#282C3F] hover:text-white transition-colors"
            >
              Edit Product
            </Link>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100 max-w-md">
            <h2 className="text-base font-semibold text-[#282C3F] mb-2">Details</h2>
            <p className="text-[#5B5F6B] leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-gray-100">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-[#282C3F] mb-6">Reviews</h2>

          {token && (
            <form onSubmit={handleReviewSubmit} className="mb-8 bg-[#F5F5F6] p-5 rounded-2xl">
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 bg-white"
                rows={3}
              />
              <button
                type="submit"
                disabled={rating === 0}
                className="bg-[#FF3F6C] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-40"
              >
                Submit Review
              </button>
              {reviewSubmitted && (
                <p className="text-green-600 text-sm mt-2">Thanks for your review!</p>
              )}
            </form>
          )}

          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#282C3F]">{review.username}</span>
                    <span className="text-[#FF9F00] text-sm">
                      {'★'.repeat(review.rating)}
                      <span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-[#7E818C] mt-1">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#7E818C]">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-gray-100">
          <h2 className="text-xl font-bold text-[#282C3F] mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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