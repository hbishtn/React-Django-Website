import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const { cartItems } = useCart();
  const { username, logout } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchText.trim() ? `/?search=${encodeURIComponent(searchText.trim())}` : '/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm">
      <Link to="/" className="text-2xl font-black text-[#FF3F6C] tracking-tight whitespace-nowrap">
        Cosmetic Shop
      </Link>

      <button
        onClick={toggleLang}
        className="px-3 py-1.5 text-xs font-bold rounded-full border border-gray-300 text-[#282C3F] hover:border-[#FF3F6C] transition-colors whitespace-nowrap"
      >
        {lang === 'en' ? 'हिं' : 'EN'}
      </button>

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <input
          type="text"
          placeholder={t('search')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-[#F5F5F6] border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#FF3F6C]"
        />
      </form>

      <div className="flex items-center gap-6 text-[#282C3F] font-medium">
        <Link to="/cart" className="relative flex items-center gap-1">
          <img src="/icons/cart-icon.png" alt="Cart" className="w-6 h-6" />
          <span className="text-sm hidden sm:inline">{t('cart')}</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#FF3F6C] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>

        {username ? (
          <div className="flex items-center gap-3">
            <img src="/icons/user-icon.png" alt="User" className="w-7 h-7 rounded-full border border-gray-300" />
            <span className="text-sm">{username}</span>
            <button onClick={logout} className="text-sm text-[#7E818C] hover:text-[#FF3F6C]">
              {t('logout')}
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm hover:text-[#FF3F6C]">
            {t('login')}
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;