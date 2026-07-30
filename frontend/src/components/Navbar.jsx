import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartItems } = useCart();
  const { username, logout } = useAuth();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-orange-600 border-b-4 border-sky-400 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        Cosmetic Shop
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/cart" className="relative flex items-center">
          <img src="/icons/cart-icon.png" alt="Cart" className="w-7 h-7" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-sky-400 text-orange-900 text-xs font-bold rounded-full px-2 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>

        {username ? (
          <div className="flex items-center gap-3">
            <img
              src="/icons/user-icon.png"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-sky-300"
            />
            <span>{username}</span>
            <button onClick={handleLogout} className="hover:underline text-sky-100">
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