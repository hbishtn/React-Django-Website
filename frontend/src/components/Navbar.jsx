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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchText.trim() ? `/?search=${encodeURIComponent(searchText.trim())}` : '/');
    setShowMobileSearch(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link to="/" className="text-xl sm:text-2xl font-black text-[#FF3F6C] tracking-tight whitespace-nowrap">
          Bisht Cosmetic
        </Link>

        <button
          onClick={toggleLang}
          className="hidden sm:block px-3 py-1.5 text-xs font-bold rounded-full border border-gray-300 text-[#282C3F] hover:border-[#FF3F6C] transition-colors whitespace-nowrap"
        >
          {lang === 'en' ? 'हिं' : 'EN'}
        </button>

        <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-md">
          <input
            type="text"
            placeholder={t('search')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-[#F5F5F6] border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#FF3F6C]"
          />
        </form>

        <div className="flex-1 sm:flex-none" />

        <div className="flex items-center gap-4 sm:gap-6 text-[#282C3F] font-medium">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="sm:hidden text-lg"
          >
            🔍
          </button>

          <Link to="/cart" className="relative flex items-center gap-1">
            <img src="/icons/cart-icon.png" alt="Cart" className="w-6 h-6" />
            <span className="text-sm hidden md:inline">{t('cart')}</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#FF3F6C] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>

          {username ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/icons/user-icon.png" alt="User" className="w-7 h-7 rounded-full border border-gray-300" />
              <span className="text-sm hidden md:inline">{username}</span>
              <button onClick={logout} className="text-sm text-[#7E818C] hover:text-[#FF3F6C] whitespace-nowrap">
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm hover:text-[#FF3F6C] whitespace-nowrap">
              {t('login')}
            </Link>
          )}
        </div>
      </div>

      {showMobileSearch && (
        <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3">
          <input
            type="text"
            placeholder={t('search')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
            className="w-full bg-[#F5F5F6] border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#FF3F6C]"
          />
        </form>
      )}
    </nav>
  );
}

export default Navbar;