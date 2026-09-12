import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getEffectivePrice } from '../utils/discount';
import PriceDisplay from './PriceDisplay';
import OrderSummary from './OrderSummary';

function Cart() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const payableTotal = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item.product_detail) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F6] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FFF1F4] flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="#FF3F6C" strokeWidth="1.6">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-[#282C3F]">Your bag is empty</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          Looks like you haven't added anything yet. Explore the collection and find something you'll love.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-[#FF3F6C] text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#e6395f] transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6] pb-40 sm:pb-28 lg:pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="font-display text-2xl sm:text-3xl text-[#282C3F]">Your Bag</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
        </p>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {cartItems.map((item) => {
              const product = item.product_detail;
              const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
              const lineTotal = getEffectivePrice(product) * item.quantity;

              return (
                <div key={item.id} className="flex gap-4 p-4 sm:p-5">
                  <Link to={`/products/${product.id}`} className="shrink-0">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-[#F5F5F6]">
                      {primaryImage && (
                        <img
                          src={primaryImage.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide truncate">
                          {product.category_name}
                        </p>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-sm font-semibold text-[#282C3F] hover:text-[#FF3F6C] transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove from bag"
                        className="shrink-0 text-gray-400 hover:text-[#FF3F6C] transition-colors p-1 -m-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M4 7h16" />
                          <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                          <path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2">
                      <PriceDisplay
                        price={product.price}
                        discountPrice={product.discount_price}
                        discountEndsAt={product.discount_ends_at}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 border border-gray-200 rounded-full p-1">
                        <span className="text-xs font-semibold text-[#282C3F] px-2">
                          Qty: {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          aria-label="Add one more"
                          className="w-6 h-6 rounded-full bg-[#FFF1F4] text-[#FF3F6C] font-bold text-sm flex items-center justify-center hover:bg-[#FF3F6C] hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#282C3F]">₹{lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block lg:sticky lg:top-6">
            <OrderSummary cartItems={cartItems}>
              <Link
                to="/checkout"
                className="w-full block text-center bg-[#FF3F6C] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#e6395f] transition-colors"
              >
                Proceed to Checkout
              </Link>
            </OrderSummary>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-16 sm:bottom-0 inset-x-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <div>
          <p className="text-[11px] text-gray-500">Total amount</p>
          <p className="font-display text-lg text-[#282C3F]">₹{payableTotal.toFixed(2)}</p>
        </div>
        <Link
          to="/checkout"
          className="bg-[#FF3F6C] text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-[#e6395f] transition-colors"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
