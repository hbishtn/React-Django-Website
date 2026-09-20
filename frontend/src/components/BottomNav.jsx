import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
  const location = useLocation();
  const categoryParam = new URLSearchParams(location.search).get('category');

  const isHomeActive = location.pathname === '/' && !categoryParam;
  const isClothActive = categoryParam === 'cloth';
  const isJewelryActive = categoryParam === 'jewelry';

  return (
    <>
      {/* Mobile: Floating white bottom bar (Instagram-style floating dock) */}
      <nav className="sm:hidden fixed bottom-4 left-4 right-4 bg-white rounded-full flex justify-around items-center py-2.5 z-40 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            isHomeActive ? 'bg-[#FF3F6C]/10' : ''
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF3F6C" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            <path d="M9 22V12h6v10"></path>
          </svg>
          <span className="text-[10px] font-medium text-[#FF3F6C]">Home</span>
        </Link>

        <Link
          to="/?category=cloth"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            isClothActive ? 'bg-[#FF3F6C]/10' : ''
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF3F6C" strokeWidth="1.8">
            <path d="M16 4l4 4-3 3-2-2v11H9V9L7 11l-3-3 4-4 4 2z"></path>
          </svg>
          <span className="text-[10px] font-medium text-[#FF3F6C]">Clothes</span>
        </Link>

        <Link
          to="/?category=jewelry"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            isJewelryActive ? 'bg-[#FF3F6C]/10' : ''
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF3F6C" strokeWidth="1.8">
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M8 13l-3 8h14l-3-8"></path>
          </svg>
          <span className="text-[10px] font-medium text-[#FF3F6C]">Jewelry</span>
        </Link>
      </nav>

      {/* Add bottom padding on mobile so content isn't hidden behind the floating bar */}
      <div className="sm:hidden h-20"></div>
    </>
  );
}

export default BottomNav;