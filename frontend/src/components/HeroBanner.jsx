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
// 6 vivid glow colors — har slide pe cycle karenge, dark neutral base pe
// glow karte hue (zyada eye-catching)
const GLOW_COLORS = [
  '#38BDF8', // sky blue
  '#4ADE80', // light green
  '#F472B6', // light pink
  '#FACC15', // light yellow
  '#F87171', // light red
  '#A78BFA', // light purple
];

function lighten(color, amount = 0.7) {
  return {
    r: Math.round(color.r + (255 - color.r) * amount),
    g: Math.round(color.g + (255 - color.g) * amount),
    b: Math.round(color.b + (255 - color.b) * amount),
  };
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
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

  const glowColor = GLOW_COLORS[index % GLOW_COLORS.length];
  const glowRgb = hexToRgb(glowColor);
  const productTint = bgColor ? lighten(bgColor, 0.6) : { r: 255, g: 236, b: 240 };

  // Pure white/light base — koi dark background nahi. Sirf ek vivid
  // glow color text ke peeche se radiate karta hai, aur product photo
  // ka apna color halka sa image side pe blend hota hai
  const bannerBackground = `radial-gradient(circle at 15% 45%, rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.55), transparent 60%), radial-gradient(circle at 85% 60%, rgba(${productTint.r}, ${productTint.g}, ${productTint.b}, 0.45), transparent 55%), #FFFFFF`;

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
        <span
          className="text-[10px] sm:text-xs font-bold uppercase tracking-widest"
          style={{ color: glowColor }}
        >
          Featured
        </span>
        <h3 className="font-display italic text-xl sm:text-4xl font-bold text-[#2E2530] mt-1 leading-tight tracking-wide">
          {current.name}
        </h3>
        <p className="font-display italic text-[#7A6E75] text-xs sm:text-base mt-1 sm:mt-2 hidden sm:block">
          Elegance, curated for you
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
          className={`relative z-10 h-[85%] sm:h-[90%] object-contain ${direction === 1 ? 'animate-slide-right' : 'animate-slide-left'}`}
          style={{ filter: `drop-shadow(10px 12px 22px rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.45))` }}
        />
      )}

      {activeSlides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 text-[#2E2530]/40 hover:text-[#2E2530]/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 text-[#2E2530]/40 hover:text-[#2E2530]/80 transition-colors"
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
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5' : 'w-1.5 bg-[#2E2530]/25'}`}
              style={i === index ? { backgroundColor: glowColor } : undefined}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
export default HeroBanner;