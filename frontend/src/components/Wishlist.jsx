import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from './ProductCard';

function Wishlist() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F6] p-6 text-center">
        <h2 className="text-xl font-bold text-[#282C3F] mt-10">Your wishlist is empty</h2>
        <p className="text-sm text-[#7E818C] mt-2">
          Tap the ♥ on any product to save it here.
        </p>
        <Link to="/" className="text-[#FF3F6C] hover:underline mt-4 inline-block">
          &larr; Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-4 sm:p-6">
      <h2 className="text-xl font-bold text-[#282C3F] mb-4 max-w-6xl mx-auto">My Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;