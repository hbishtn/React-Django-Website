import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product_detail.price * item.quantity,
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
          const product = item.product_detail;
          const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
            >
              {primaryImage && (
                <img
                  src={primaryImage.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-pink-600 font-bold">₹{product.price}</p>
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

      <Link
        to="/checkout"
        className="max-w-2xl mx-auto mt-4 block text-center bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition-colors"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default Cart;