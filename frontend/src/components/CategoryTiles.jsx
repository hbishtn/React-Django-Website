import { useState, useEffect } from 'react';

function Jhumka({ tilt, side }) {
  const positionClass = side === 'left' ? 'left-1' : 'right-1';
  return (
    <div
      className={`absolute ${positionClass} -bottom-7 origin-top transition-transform duration-150 ease-out pointer-events-none`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <svg width="20" height="30" viewBox="0 0 20 30">
        {/* Hook/connector */}
        <line x1="10" y1="0" x2="10" y2="4" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="10" cy="5" r="2" fill="#D4AF37" />

        {/* Dome/bell body (jhumka shape) */}
        <path
          d="M4 8 Q4 6 10 6 Q16 6 16 8 L15 16 Q15 20 10 20 Q5 20 5 16 Z"
          fill="#C2185B"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        {/* Gold dot pattern on dome */}
        <circle cx="7" cy="10" r="0.8" fill="#D4AF37" />
        <circle cx="10" cy="9.5" r="0.8" fill="#D4AF37" />
        <circle cx="13" cy="10" r="0.8" fill="#D4AF37" />
        <circle cx="7" cy="13" r="0.8" fill="#D4AF37" />
        <circle cx="10" cy="13" r="0.8" fill="#D4AF37" />
        <circle cx="13" cy="13" r="0.8" fill="#D4AF37" />

        {/* Bottom rim */}
        <ellipse cx="10" cy="20" rx="5" ry="1.3" fill="#D4AF37" />

        {/* Dangling beads */}
        <line x1="6" y1="21" x2="6" y2="25" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="6" cy="26.5" r="2" fill="#FF3F6C" />

        <line x1="10" y1="21" x2="10" y2="26" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="10" cy="28" r="2" fill="#FF3F6C" />

        <line x1="14" y1="21" x2="14" y2="25" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="14" cy="26.5" r="2" fill="#FF3F6C" />
      </svg>
    </div>
  );
}

function ChainArc() {
  return null;
}
// add category colors
const GLOW_COLORS = ['#D4AF37', '#C2185B', '#1E88E5', '#2E7D32', '#8E24AA', '#B8860B'];

function CategoryTiles({ categories, selectedCategory, onSelect, t }) {
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null) {
        const clamped = Math.max(-20, Math.min(20, e.gamma));
        setTilt(clamped * 0.6);
      }
    };

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const offset = (e.clientX - centerX) / centerX;
      setTilt(offset * 12);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto mb-0.1">
      <div className="flex gap-5 overflow-x-auto pt-1.5 pb-2 px-2 scrollbar-hide [overflow-clip-margin:20px] [overscroll-behavior-x:contain]">
        <button
          onClick={() => onSelect(null)}
          className="flex flex-col items-center gap-2 shrink-0"
        >
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center bg-[#FF3F6C] border-2 ${
              selectedCategory === null ? 'border-[#282C3F]' : 'border-transparent'
            }`}
            style={{ boxShadow: '0 0 9px 0px #FF3F6C40' }}
          >
            <svg className="w-8 h-8 z-10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M5.5 10v9a1 1 0 001 1h11a1 1 0 001-1v-9" />
              <path d="M9.5 20v-6h5v6" />
            </svg>
            <ChainArc />
            <Jhumka tilt={tilt} side="left" />
            <Jhumka tilt={tilt} side="right" />
          </div>
          <span className="text-xs text-[#282C3F] font-medium">{t('allCategories')}</span>
        </button>

        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <div
              className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                selectedCategory === category.id ? 'border-[#FF3F6C]' : 'border-gray-200'
              }`}
              style={{ boxShadow: `0 0 12px 2px ${GLOW_COLORS[index % GLOW_COLORS.length]}59` }}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F5F5F6] flex items-center justify-center">
                  <span className="text-lg font-bold text-[#7E818C]">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-[#282C3F] font-medium text-center max-w-[70px] truncate">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryTiles;