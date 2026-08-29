import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeroBanner({ fallbackProduct }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/featured/`)
      .then((response) => response.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []));
  }, []);

  const activeSlides = slides.length > 0 ? slides : fallbackProduct ? [fallbackProduct] : [];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const current = activeSlides[index % activeSlides.length];
  const img = current.images?.find((im) => im.is_primary) || current.images?.[0];

  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(-1);
    setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    setIndex((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <Link
      to={`/products/${current.id}`}
      className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group block"
    >
      {img && (
        <img
          key={current.id}
          src={img.image}
          alt={current.name}
          className={`w-full h-full object-cover ${direction === 1 ? 'animate-slide-right' : 'animate-slide-left'}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="bg-[#FF3F6C] text-white text-[10px] font-bold uppercase px-2 py-1 rounded">
          Featured
        </span>
        <h3 className="text-white font-bold text-lg mt-1">{current.name}</h3>
        <p className="text-white/90 text-sm">₹{current.price}</p>
      </div>

      {activeSlides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm text-white/90 flex items-center justify-center hover:bg-white/35 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm text-white/90 flex items-center justify-center hover:bg-white/35 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {activeSlides.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1">
          {activeSlides.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
export default HeroBanner;