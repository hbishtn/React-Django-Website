import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Cosmetic Shop
      </Link>
      <Link to="/cart" className="relative text-lg">
        🛒 Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-4 bg-white text-pink-600 text-xs font-bold rounded-full px-2 py-0.5">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;