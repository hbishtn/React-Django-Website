function Footer() {
  return (
    <footer className="bg-[#282C3F] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand info */}
        <div>
          <h3 className="text-xl font-black text-[#FF3F6C] mb-3">Cosmetic Shop</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your beauty, delivered with care. Discover our curated range of skincare,
  makeup, and everyday essentials — crafted for every kind of glow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-gray-300">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-[#FF3F6C] transition-colors">Home</a></li>
            <li><a href="/cart" className="hover:text-[#FF3F6C] transition-colors">Cart</a></li>
            <li><a href="/login" className="hover:text-[#FF3F6C] transition-colors">Login</a></li>
            <li><a href="/signup" className="hover:text-[#FF3F6C] transition-colors">Sign Up</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-gray-300">
            Customer Service
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-[#FF3F6C] transition-colors cursor-pointer">Track Order</li>
            <li className="hover:text-[#FF3F6C] transition-colors cursor-pointer">Returns & Refunds</li>
            <li className="hover:text-[#FF3F6C] transition-colors cursor-pointer">FAQs</li>
            <li className="hover:text-[#FF3F6C] transition-colors cursor-pointer">Shipping Info</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-gray-300">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>Nail, Almora Uttarakhand, India</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <span>+91 9410725209</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <span>hbishtn@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Bisht Cosmetic Shop. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;