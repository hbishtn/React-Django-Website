export const FRAMES = {
  none: {
    label: 'No Frame',
    tier: 'free',
    ring: 'ring-2 ring-gray-200',
  },
  classic: {
    label: 'Classic Pink',
    tier: 'free',
    ring: 'ring-[3px] ring-[#FF3F6C]',
  },
  teal_ring: {
    label: 'Teal Ring',
    tier: 'free',
    ring: 'ring-[3px] ring-[#14958F]',
  },
  gold_elite: {
    label: 'Gold Elite',
    tier: 'premium',
    gradient: 'linear-gradient(135deg, #FFE9A8, #D4AF37, #FFF3CC, #D4AF37)',
    glow: '0 0 10px rgba(212,175,55,0.5)',
  },
  neon_glow: {
    label: 'Neon Glow',
    tier: 'premium',
    gradient: 'linear-gradient(135deg, #FF3F6C, #8E24AA, #1E88E5)',
    glow: '0 0 12px rgba(255,63,108,0.55)',
  },
  royal_diamond: {
    label: 'Royal Diamond',
    tier: 'premium',
    gradient: 'linear-gradient(135deg, #6A1B9A, #1E88E5, #6A1B9A, #283593)',
    glow: '0 0 12px rgba(106,27,154,0.45)',
  },
};

export const FRAME_ORDER = ['none', 'classic', 'teal_ring', 'gold_elite', 'neon_glow', 'royal_diamond'];

function AvatarFrame({ src, username = '?', frame = 'none', size = 40 }) {
  const config = FRAMES[frame] || FRAMES.none;
  const initial = username.charAt(0).toUpperCase();
  const isPremiumStyle = Boolean(config.gradient);

  const outerStyle = isPremiumStyle
    ? {
        width: size,
        height: size,
        padding: Math.max(2, Math.round(size * 0.07)),
        borderRadius: '9999px',
        background: config.gradient,
        boxShadow: config.glow,
      }
    : { width: size, height: size };

  return (
    <div
      style={outerStyle}
      className={`rounded-full shrink-0 ${isPremiumStyle ? '' : config.ring}`}
    >
      <div
        className="w-full h-full rounded-full overflow-hidden bg-[#FF3F6C] flex items-center justify-center text-white font-bold"
        style={{ fontSize: Math.round(size * 0.4) }}
      >
        {src ? (
          <img src={src} alt={username} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>
    </div>
  );
}

export default AvatarFrame;
