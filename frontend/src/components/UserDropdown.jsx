import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AvatarFrame from './AvatarFrame';

function UserDropdown() {
  const { username, logout, isStaff, profilePicture, avatarFrame } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} aria-label="Account menu">
        <AvatarFrame src={profilePicture} username={username} frame={avatarFrame} size={32} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <AvatarFrame src={profilePicture} username={username} frame={avatarFrame} size={36} />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-[#282C3F] truncate">{username}</p>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#282C3F] hover:bg-[#F5F5F6] flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My Profile
            </Link>

            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#282C3F] hover:bg-[#F5F5F6] flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 12V8H6a2 2 0 010-4h12v4"></path>
                <path d="M4 6v12a2 2 0 002 2h14v-4"></path>
                <path d="M18 12a2 2 0 000 4h4v-4z"></path>
              </svg>
              My Orders
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#282C3F] hover:bg-[#F5F5F6] flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
              </svg>
              My Wishlist
            </Link>

            {isStaff && (
              <Link
                to="/x7k9-quick-add"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm text-[#282C3F] hover:bg-[#F5F5F6] flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Product
              </Link>
            )}

            {isStaff && (
              <Link
                to="/x7k9-manage-users"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm text-[#282C3F] hover:bg-[#F5F5F6] flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 010 7.75"></path>
                </svg>
                Manage Users
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;