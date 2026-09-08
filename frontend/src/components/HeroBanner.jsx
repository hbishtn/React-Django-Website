import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function extractDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const size = 40;
        const border = 3;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const isEdge = x < border || x >= size - border || y < border || y >= size - border;
            if (!isEdge) continue;
            const i = (y * size + x) * 4;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        resolve({ r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) });
      } catch (err) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

function HeroBanner({ fallbackProduct }) {
  const [slides, setSlides] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [bgColor, setBgColor] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/featured/`)
      .then((response) => response.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []))
      .finally(() => setLoaded(true));
  }, []);

  const activeSlides = loaded
    ? (slides.length > 0 ? slides : fallbackProduct ? [fallbackProduct] : [])
    : [];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const current = activeSlides.length > 0 ? activeSlides[index % activeSlides.length] : null;
  const img = current?.images?.find((im) => im.is_primary) || current?.images?.[0];

  useEffect(() => {
    if (!img) {
      setBgColor(null);
      return;
    }
    let cancelled = false;
    extractDominantColor(img.image).then((color) => {
      if (!cancelled) setBgColor(color);
    });
    return () => {
      cancelled = true;
    };
  }, [img?.image]);

  if (!loaded) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200">
        <div className="w-full h-full hero-shimmer" />
      </div>
    );
  }

  if (activeSlides.length === 0 || !current) return null;

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

  const goToSlide = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const bannerBackground = bgColor
    ? `linear-gradient(135deg, rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b}) 0%, rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.85) 55%, rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.65) 100%)`
    : 'linear-gradient(120deg, #FFE1EA, #FFF8F5)';

  return (
    <Link
      to={`/products/${current.id}`}
      className="relative w-full h-full flex items-center justify-between overflow-hidden group block px-5 sm:px-10"
      style={{ background: bannerBackground, transition: 'background 0.6s ease' }}
    >
      <div
        key={`text-${current.id}`}
        className={`relative z-10 max-w-[55%] sm:max-w-[45%] ${direction === 1 ? 'animate-slide-right' : 'animate-slide-left'}`}
      >
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FF3F6C]">
          Featured
        </span>
        <h3 className="text-lg sm:text-3xl font-black text-[#282C3F] mt-1 leading-tight">
          {current.name}
        </h3>
        <p className="text-[#7E818C] text-xs sm:text-sm mt-1 sm:mt-2 hidden sm:block">
          Timeless picks, just for you
        </p>
        <div className="inline-flex items-center gap-1 mt-3 sm:mt-5 bg-[#FF3F6C] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full">
          Shop Now
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {img && (
        <img
          key={`img-${current.id}`}
          src={img.image}
          alt={current.name}
          className={`relative z-10 h-[85%] sm:h-[90%] object-contain drop-shadow-xl ${direction === 1 ? 'animate-slide-right' : 'animate-slide-left'}`}
        />
      )}

      {activeSlides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 text-[#282C3F]/40 hover:text-[#282C3F]/80 transition-colors"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 text-[#282C3F]/40 hover:text-[#282C3F]/80 transition-colors"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {activeSlides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => goToSlide(e, i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-[#FF3F6C]' : 'w-1.5 bg-[#FF3F6C]/30'}`}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
export default HeroBanner;