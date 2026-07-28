import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartItems } = useCart();
  const { username, logout } = useAuth();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Cosmetic Shop
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/cart" className="relative text-lg">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-white text-pink-600 text-xs font-bold rounded-full px-2 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>

        {username ? (
          <div className="flex items-center gap-3">
            <span>Hi, {username}</span>
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;