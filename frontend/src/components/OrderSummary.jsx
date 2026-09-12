import { getEffectivePrice } from '../utils/discount';

function OrderSummary({ cartItems, children }) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const mrpTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product_detail.price) * item.quantity,
    0
  );

  const payableTotal = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item.product_detail) * item.quantity,
    0
  );

  const savings = mrpTotal - payableTotal;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
      <h3 className="font-display text-lg text-[#282C3F] mb-4">Price details</h3>

      <div className="space-y-3 text-sm text-[#282C3F]">
        <div className="flex justify-between">
          <span>Total MRP ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          <span>₹{mrpTotal.toFixed(2)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-[#14958F] font-medium">
            <span>Discount on MRP</span>
            <span>&minus;₹{savings.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span className="text-[#14958F] font-medium">Free</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 my-4" />

      <div className="flex justify-between items-baseline">
        <span className="font-semibold text-[#282C3F]">Total amount</span>
        <span className="font-display text-2xl text-[#282C3F]">₹{payableTotal.toFixed(2)}</span>
      </div>

      {savings > 0 && (
        <p className="text-[#14958F] text-xs font-semibold mt-2">
          You're saving ₹{savings.toFixed(2)} on this order
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}

      <div className="flex items-center gap-4 mt-5 pt-5 border-t border-gray-100 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="10" width="16" height="10" rx="1.5" />
            <path d="M8 10V7a4 4 0 018 0v3" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 7h11v9H3z" />
            <path d="M14 11h4l3 3v2h-7z" />
            <circle cx="7" cy="18" r="1.6" />
            <circle cx="17.5" cy="18" r="1.6" />
          </svg>
          <span>Fast delivery</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
