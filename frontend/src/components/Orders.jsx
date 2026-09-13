import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/order/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setOrders(Array.isArray(data) ? data : data.results || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F6] p-6 text-center text-[#7E818C]">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F6] p-6 text-center">
        <h2 className="text-xl font-bold text-[#282C3F] mt-10">No orders yet</h2>
        <Link to="/" className="text-[#FF3F6C] hover:underline mt-4 inline-block">
          &larr; Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-4 sm:p-6">
      <h2 className="text-xl font-bold text-[#282C3F] mb-4 max-w-2xl mx-auto">My Orders</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-[#7E818C]">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm font-semibold text-[#282C3F]">Order #{order.id}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-[#282C3F]">
                  <span className="truncate pr-2">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="shrink-0">₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold text-[#282C3F]">
              <span>Total</span>
              <span>₹{order.total_price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;