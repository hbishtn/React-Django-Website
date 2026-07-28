import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mt-10">Your cart is empty</h2>
        <Link to="/" className="text-pink-600 hover:underline mt-4 inline-block">
          &larr; Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        {cartItems.map((item) => {
          const primaryImage = item.images.find((img) => img.is_primary) || item.images[0];

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
            >
              {primaryImage && (
                <img
                  src={primaryImage.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-pink-600 font-bold">₹{item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <span className="text-xl font-bold text-pink-600">₹{totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default Cart;