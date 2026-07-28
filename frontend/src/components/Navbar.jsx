import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Cosmetic Shop
      </Link>
    </nav>
  );
}

export default Navbar;