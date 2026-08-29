import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function LoginPromptModal() {
  const { showLoginPrompt, setShowLoginPrompt } = useCart();

  if (!showLoginPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
        <button
          onClick={() => setShowLoginPrompt(false)}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-[#7E818C] hover:bg-gray-100 text-lg"
        >
          &times;
        </button>

        <p className="text-[#282C3F] font-bold text-lg mb-1">Please Login</p>
        <p className="text-[#7E818C] text-sm mb-5">
          
        </p>

        <div className="flex flex-col gap-2">
          <Link
            to="/login"
            onClick={() => setShowLoginPrompt(false)}
            className="w-full py-2.5 rounded-lg bg-[#FF3F6C] text-white font-bold text-sm"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setShowLoginPrompt(false)}
            className="w-full py-2.5 rounded-lg border border-gray-300 text-[#282C3F] font-bold text-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPromptModal;