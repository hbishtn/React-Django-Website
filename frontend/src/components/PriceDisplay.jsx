import { useState, useEffect } from 'react';

function getTimeLeft(endsAt) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
}

function PriceDisplay({ price, discountPrice, discountEndsAt, size = 'base' }) {
  const [timeLeft, setTimeLeft] = useState(
    discountEndsAt ? getTimeLeft(discountEndsAt) : null
  );

  useEffect(() => {
    if (!discountEndsAt) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(discountEndsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [discountEndsAt]);

  // Agar timer set tha aur khatam ho gaya, to discount ab valid nahi
  const isExpired = discountEndsAt && !timeLeft;
  const hasDiscount = discountPrice && !isExpired;

  const priceSize = size === 'lg' ? 'text-2xl' : 'text-base';
  const oldPriceSize = size === 'lg' ? 'text-base' : 'text-xs';

  if (!hasDiscount) {
    return <p className={`font-bold text-[#282C3F] ${priceSize}`}>₹{price}</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-red-500 line-through ${oldPriceSize}`}>₹{price}</span>
        <span className={`font-bold text-green-600 ${priceSize}`}>₹{discountPrice}</span>
      </div>

      {timeLeft && (
        <div className="flex items-center gap-1 mt-1 text-[11px] text-[#FF3F6C] font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
