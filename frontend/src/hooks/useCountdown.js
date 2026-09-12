import { useState, useEffect } from 'react';

function getTimeLeft(endsAt) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
}

export function useCountdown(endsAt) {
  const [timeLeft, setTimeLeft] = useState(endsAt ? getTimeLeft(endsAt) : null);

  useEffect(() => {
    if (!endsAt) return;
    setTimeLeft(getTimeLeft(endsAt));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return timeLeft;
}