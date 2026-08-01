import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product_detail.price * item.quantity,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const orderData = {
      full_name: fullName,
      address: address,
      phone: phone,
      total_price: totalPrice.toFixed(2),
      items: cartItems.map((item) => ({
        product: item.product_detail.id,
        quantity: item.quantity,
        price: item.product_detail.price,
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
      .catch(() => setError('Something went wrong. Please try again.'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Checkout</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6"
      >
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          required
        />
        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          rows={3}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          required
        />

        <div className="flex justify-between items-center mb-4 text-lg font-semibold text-gray-800">
          <span>Total</span>
          <span className="text-pink-600">₹{totalPrice.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition-colors"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;