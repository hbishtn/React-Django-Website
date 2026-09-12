import { useCountdown } from '../hooks/useCountdown';

function PriceDisplay({ price, discountPrice, discountEndsAt, size = 'base' }) {
  const timeLeft = useCountdown(discountEndsAt);

  // Agar timer set tha aur khatam ho gaya, to discount ab valid nahi
  const isExpired = discountEndsAt && !timeLeft;
  const hasDiscount = discountPrice && !isExpired;

  const priceSize = size === 'lg' ? 'text-2xl' : 'text-base';
  const oldPriceSize = size === 'lg' ? 'text-base' : 'text-sm';

  if (!hasDiscount) {
    return <p className={`font-bold text-[#282C3F] ${priceSize}`}>₹{price}</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`relative inline-block font-semibold text-gray-600 ${oldPriceSize}`}>
          ₹{price}
          <span
            className="absolute left-[-2px] right-[-2px] top-1/2 h-[2px] bg-red-500"
            style={{ transform: 'translateY(-50%) rotate(-14deg)' }}
          />
        </span>
        <span className={`font-bold text-green-600 ${priceSize}`}>₹{discountPrice}</span>
      </div>

      {timeLeft && (
        <div className="flex items-center gap-1.5 mt-1.5 text-sm text-[#FF3F6C] font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          <span>
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')} left
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceDisplay;
