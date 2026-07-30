import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cartItems } = useCart();
  const { username, logout } = useAuth();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/?search=${encodeURIComponent(searchText.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm gap-4">
      <Link to="/" className="text-2xl font-black text-[#FF3F6C] tracking-tight whitespace-nowrap">
        Cosmetic Shop
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-[#F5F5F6] border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#FF3F6C]"
        />
      </form>

      <div className="flex items-center gap-7 text-[#282C3F] font-medium">
        <Link to="/cart" className="relative flex items-center gap-1">
          <img src="/icons/cart-icon.png" alt="Cart" className="w-6 h-6" />
          <span className="text-sm hidden sm:inline">Bag</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#FF3F6C] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>

        {username ? (
          <div className="flex items-center gap-3">
            <img
              src="/icons/user-icon.png"
              alt="User"
              className="w-7 h-7 rounded-full border border-gray-300"
            />
            <span className="text-sm">{username}</span>
            <button onClick={handleLogout} className="text-sm text-[#7E818C] hover:text-[#FF3F6C]">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm hover:text-[#FF3F6C]">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;