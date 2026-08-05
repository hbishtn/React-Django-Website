import { useState } from 'react';

const shades = [
  { name: 'Classic Red', hex: '#C41E3A' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Nude Beige', hex: '#D2B48C' },
  { name: 'Wine Maroon', hex: '#722F37' },
  { name: 'Baby Pink', hex: '#F4C2C2' },
  { name: 'Fuchsia', hex: '#C154C1' },
  { name: 'Peach', hex: '#FFCBA4' },
  { name: 'Deep Purple', hex: '#4B0082' },
  { name: 'Lavender', hex: '#B57EDC' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Mint Green', hex: '#98D8C8' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Mustard Yellow', hex: '#FFDB58' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Chocolate Brown', hex: '#7B3F00' },
  { name: 'Black', hex: '#0A0A0A' },
  { name: 'White', hex: '#F8F8F8' },
  { name: 'Silver Shimmer', hex: '#C0C0C0' },
  { name: 'Gold Shimmer', hex: '#D4AF37' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Magenta', hex: '#FF00A0' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Plum', hex: '#8E4585' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Charcoal Grey', hex: '#36454F' },
  { name: 'Salmon Pink', hex: '#FA8072' },
  { name: 'Berry Red', hex: '#9E1B32' },
];

function NailPaintPicker() {
  const [selected, setSelected] = useState(shades[0]);

  const whatsappMessage = encodeURIComponent(
    `Namaste! Mujhe "${selected.name}" (${selected.hex}) shade ka nail paint chahiye, kya ye available hai?`
  );

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-[#282C3F] text-center mb-8">
        Nail Paint Shades — अपना पसंदीदा रंग चुनें
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
          {shades.map((shade) => (
            <button
              key={shade.hex}
              onClick={() => setSelected(shade)}
              className={`aspect-square rounded-full border-4 transition-transform hover:scale-110 ${
                selected.hex === shade.hex ? 'border-[#282C3F] scale-110' : 'border-white'
              }`}
              style={{ backgroundColor: shade.hex, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
              title={shade.name}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center sticky top-6">
          <svg width="140" height="220" viewBox="0 0 140 220">
            <rect x="50" y="10" width="40" height="35" rx="4" fill="#282C3F" />
            <rect x="58" y="0" width="24" height="14" rx="3" fill="#282C3F" />
            <rect x="55" y="45" width="30" height="15" fill="#DDD" />
            <path
              d="M40 60 Q40 60 40 75 L35 200 Q35 215 50 215 L90 215 Q105 215 105 200 L100 75 Q100 60 100 60 Z"
              fill="white"
              stroke="#D1D5DB"
              strokeWidth="2"
            />
            <path
              d="M40 90 L36 200 Q36 213 50 213 L90 213 Q104 213 104 200 L100 90 Z"
              fill={selected.hex}
              opacity="0.9"
            />
            <rect x="44" y="90" width="6" height="110" rx="3" fill="white" opacity="0.3" />
          </svg>

          <h3 className="text-lg font-bold text-[#282C3F] mt-4">{selected.name}</h3>
          <p className="text-sm text-gray-400 mb-4">{selected.hex}</p>

          
            href={"https://wa.me/919410725209?text=" + whatsappMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            📱 WhatsApp पर उपलब्धता पूछें
          </a>
        </div>
      </div>
    </div>
  );
}

export default NailPaintPicker;