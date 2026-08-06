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

        <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-[#282C3F]">
          <Link to="/?category=cloth" className="hover:text-[#FF3F6C]">Clothes</Link>
          <Link to="/?category=jewelry" className="hover:text-[#FF3F6C]">Jewelry</Link>
        </div>
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
            className="sm:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <Link to="/cart" className="relative flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 01-8 0"></path>
            </svg>
            <span className="text-sm hidden md:inline">{t('cart')}</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#FF3F6C] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>

          {username ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FF3F6C] flex items-center justify-center text-white text-xs font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm hidden md:inline">{username}</span>
              <button onClick={logout} className="text-sm text-[#7E818C] hover:text-[#FF3F6C] whitespace-nowrap">
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 text-sm hover:text-[#FF3F6C] whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="hidden sm:inline">{t('login')}</span>
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