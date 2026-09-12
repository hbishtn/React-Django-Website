import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getEffectivePrice } from '../utils/discount';
import OrderSummary from './OrderSummary';

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const payableTotal = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item.product_detail) * item.quantity,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const orderData = {
      full_name: fullName,
      address: address,
      phone: phone,
      total_price: payableTotal.toFixed(2),
      items: cartItems.map((item) => ({
        product: item.product_detail.id,
        quantity: item.quantity,
        price: getEffectivePrice(item.product_detail),
      })),
    };

    fetch(`${import.meta.env.VITE_API_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Order failed');
        return response.json();
      })
      .then(() => {
        clearCart();
        navigate('/');
      })
      .catch(() => {
        setError('Something went wrong while placing your order. Please try again.');
        setSubmitting(false);
      });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F6] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl text-[#282C3F]">Your bag is empty</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          Add something to your bag before checking out.
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
    <div className="min-h-screen bg-[#F5F5F6] pb-10 sm:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="font-display text-2xl sm:text-3xl text-[#282C3F] mb-6">Checkout</h2>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
            <h3 className="font-display text-lg text-[#282C3F] mb-4">Delivery details</h3>

            {error && (
              <p className="text-[#FF3F6C] text-sm font-medium bg-[#FFF1F4] rounded-lg px-3 py-2 mb-4">
                {error}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-[#282C3F] mb-1.5">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#282C3F] focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C] transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-[#282C3F] mb-1.5">
                  Delivery address
                </label>
                <textarea
                  id="address"
                  placeholder="House no., street, locality, city, pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#282C3F] focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C] transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-[#282C3F] mb-1.5">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#282C3F] focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="hidden lg:block mt-2">
              <p className="text-xs text-gray-500 mt-4">
                We'll use these details only to deliver your order and share updates about it.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 mb-4 max-h-56 overflow-y-auto">
              {cartItems.map((item) => {
                const product = item.product_detail;
                const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <div className="w-12 h-14 rounded-md overflow-hidden bg-[#F5F5F6] shrink-0">
                      {primaryImage && (
                        <img
                          src={primaryImage.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#282C3F] truncate">{product.name}</p>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-[#282C3F] shrink-0">
                      ₹{(getEffectivePrice(product) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <OrderSummary cartItems={cartItems}>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#FF3F6C] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#e6395f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing order…' : `Place order · ₹${payableTotal.toFixed(2)}`}
              </button>
            </OrderSummary>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
