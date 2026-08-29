import { useState, useRef, useEffect } from 'react';

const MASCOTS = {
  Tingu: { body: '#5BC8F5', dark: '#1565C0', bell: '#FFC107', bellDark: '#F57F17' },
  Pinku: { body: '#F06292', dark: '#AD1457', bell: '#FFD54F', bellDark: '#F9A825' },
  Lofu: { body: '#FF9F43', dark: '#E65100', bell: '#FFF176', bellDark: '#F9A825' },
  Chikku: { body: '#66BB6A', dark: '#2E7D32', bell: '#FFCC80', bellDark: '#EF6C00' },
  Moku: { body: '#AB7FE0', dark: '#5E35B1', bell: '#FFE082', bellDark: '#F9A825' },
};

const ANIM_DELAYS = {
  Tingu: { eyes: '0s', mouth: '0.4s' },
  Pinku: { eyes: '0.6s', mouth: '1.3s' },
  Lofu: { eyes: '1.2s', mouth: '0.1s' },
  Chikku: { eyes: '1.8s', mouth: '2.1s' },
  Moku: { eyes: '2.4s', mouth: '1.6s' },
};

function MascotIcon({ name, size = 64 }) {
  const c = MASCOTS[name];
  const delay = ANIM_DELAYS[name] || { eyes: '0s', mouth: '0s' };
  function MascotSVG({ children, size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64">
        <defs>
            <filter id="mascotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
            </filter>
        </defs>
        <g filter="url(#mascotGlow)">{children}</g>
        </svg>
    );
    }

  if (name === 'Tingu') {
    return (
      <MascotSVG size={size}>
        <circle cx="32" cy="30" r="27" fill={c.body} stroke={c.dark} strokeWidth="1.5" />
        <ellipse cx="32" cy="40" rx="17" ry="15" fill="white" />
        <g className="mascot-eyes" style={{ animationDelay: delay.eyes }}>
          <circle cx="24" cy="20" r="5" fill="white" />
          <circle cx="24" cy="21" r="2.2" fill="#1E293B" />
          <circle cx="25" cy="20" r="0.7" fill="white" />
          <circle cx="40" cy="20" r="5" fill="white" />
          <circle cx="40" cy="21" r="2.2" fill="#1E293B" />
          <circle cx="41" cy="20" r="0.7" fill="white" />
        </g>
        <circle cx="32" cy="30" r="3" fill="#D32F2F" />
        <line x1="10" y1="26" x2="22" y2="27" stroke="#1E293B" strokeWidth="1" />
        <line x1="10" y1="31" x2="22" y2="31" stroke="#1E293B" strokeWidth="1" />
        <line x1="42" y1="27" x2="54" y2="26" stroke="#1E293B" strokeWidth="1" />
        <line x1="42" y1="31" x2="54" y2="31" stroke="#1E293B" strokeWidth="1" />
        <g className="mascot-mouth mascot-mouth-tingu" style={{ animationDelay: delay.mouth }}>
          <path d="M22 34 Q32 42 42 34" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <circle cx="32" cy="47" r="4" fill={c.bell} stroke={c.bellDark} strokeWidth="1" />
        <line x1="24" y1="47" x2="40" y2="47" stroke={c.bellDark} strokeWidth="1" />
      </MascotSVG>
    );
  }

  if (name === 'Pinku') {
    return (
      <MascotSVG size={size}>
        <circle cx="32" cy="30" r="27" fill={c.body} stroke={c.dark} strokeWidth="1.5" />
        <ellipse cx="32" cy="40" rx="17" ry="15" fill="white" />
        <g className="mascot-eyes" style={{ animationDelay: delay.eyes }}>
          <path d="M18 20 Q24 16 30 20" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M34 20 Q40 16 46 20" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
        <circle cx="18" cy="27" r="4" fill="#FFAFC5" opacity="0.7" />
        <circle cx="46" cy="27" r="4" fill="#FFAFC5" opacity="0.7" />
        <circle cx="32" cy="30" r="2.5" fill="#D32F2F" />
        <g className="mascot-mouth mascot-mouth-pinku" style={{ animationDelay: delay.mouth }}>
          <path d="M27 37 Q32 40 37 37" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <circle cx="32" cy="47" r="4" fill={c.bell} stroke={c.bellDark} strokeWidth="1" />
        <line x1="24" y1="47" x2="40" y2="47" stroke={c.bellDark} strokeWidth="1" />
      </MascotSVG>
    );
  }

  if (name === 'Lofu') {
    return (
      <MascotSVG size={size}>
        <circle cx="32" cy="30" r="27" fill={c.body} stroke={c.dark} strokeWidth="1.5" />
        <ellipse cx="32" cy="40" rx="17" ry="15" fill="white" />
        <g className="mascot-eyes" style={{ animationDelay: delay.eyes }}>
          <path d="M19 20 Q24 15 29 20" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="41" cy="20" r="5" fill="white" />
          <circle cx="41" cy="21" r="2.2" fill="#1E293B" />
          <circle cx="42" cy="20" r="0.7" fill="white" />
        </g>
        <circle cx="30" cy="30" r="2.8" fill="#D32F2F" />
        <g className="mascot-mouth mascot-mouth-lofu" style={{ animationDelay: delay.mouth }}>
          <path d="M20 35 Q32 46 46 33" stroke="#1E293B" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>
        <circle cx="32" cy="47" r="4" fill={c.bell} stroke={c.bellDark} strokeWidth="1" />
        <line x1="24" y1="47" x2="40" y2="47" stroke={c.bellDark} strokeWidth="1" />
      </MascotSVG>
    );
  }

  if (name === 'Chikku') {
    return (
      <MascotSVG size={size}>
        <circle cx="32" cy="30" r="27" fill={c.body} stroke={c.dark} strokeWidth="1.5" />
        <ellipse cx="32" cy="40" rx="17" ry="15" fill="white" />
        <path d="M32 3 Q36 -2 40 3" stroke={c.dark} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="2" r="2" fill={c.body} stroke={c.dark} strokeWidth="1" />
        <g className="mascot-eyes" style={{ animationDelay: delay.eyes }}>
          <ellipse cx="24" cy="22" rx="5" ry="2.5" fill="#1E293B" />
          <ellipse cx="40" cy="22" rx="5" ry="2.5" fill="#1E293B" />
        </g>
        <circle cx="32" cy="30" r="2.5" fill="#D32F2F" />
        <g className="mascot-mouth mascot-mouth-chikku" style={{ animationDelay: delay.mouth }}>
          <line x1="27" y1="38" x2="37" y2="38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="32" cy="47" r="4" fill={c.bell} stroke={c.bellDark} strokeWidth="1" />
        <line x1="24" y1="47" x2="40" y2="47" stroke={c.bellDark} strokeWidth="1" />
      </MascotSVG>
    );
  }

  if (name === 'Moku') {
    return (
      <MascotSVG size={size}>
        <circle cx="32" cy="30" r="27" fill={c.body} stroke={c.dark} strokeWidth="1.5" />
        <ellipse cx="32" cy="40" rx="17" ry="15" fill="white" />
        <circle cx="20" cy="14" r="2" fill="white" opacity="0.6" />
        <circle cx="46" cy="16" r="1.5" fill="white" opacity="0.6" />
        <circle cx="44" cy="10" r="1.2" fill="white" opacity="0.6" />
        <line x1="19" y1="19" x2="27" y2="22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="19" x2="37" y2="22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <g className="mascot-eyes" style={{ animationDelay: delay.eyes }}>
          <ellipse cx="24" cy="26" rx="3.5" ry="2" fill="#1E293B" />
          <ellipse cx="40" cy="26" rx="3.5" ry="2" fill="#1E293B" />
        </g>
        <circle cx="32" cy="30" r="2.5" fill="#D32F2F" />
        <g className="mascot-mouth mascot-mouth-moku" style={{ animationDelay: delay.mouth }}>
          <line x1="26" y1="38" x2="38" y2="38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="32" cy="47" r="4" fill={c.bell} stroke={c.bellDark} strokeWidth="1" />
        <line x1="24" y1="47" x2="40" y2="47" stroke={c.bellDark} strokeWidth="1" />
      </MascotSVG>
    );
  }

  return null;
}
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMascot, setSelectedMascot] = useState('Tingu');
  const [showMascotPicker, setShowMascotPicker] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Main aapki kis tarah help kar sakta hu skincare/makeup se related?', products: [] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, products: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, products: data.products || [] },
        ]);
        setLoading(false);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, kuch error aa gaya. Try again.', products: [] },
        ]);
        setLoading(false);
      });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl mb-3 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#FF3F6C] text-white px-4 py-3 flex justify-between items-center relative">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7">
                <MascotIcon name={selectedMascot} size={28} />
              </div>
              <span className="font-semibold text-sm">{selectedMascot}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMascotPicker(!showMascotPicker)}
                className="text-white text-xs bg-white/20 px-2 py-1 rounded-full"
              >
                Change ▾
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white text-lg">x</button>
            </div>

            {showMascotPicker && (
              <div className="absolute top-12 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-2 grid grid-cols-3 gap-2 z-10">
                {Object.keys(MASCOTS).map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedMascot(name);
                      setShowMascotPicker(false);
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-lg ${
                      selectedMascot === name ? 'bg-[#F5F5F6]' : ''
                    }`}
                  >
                    <div className="w-9 h-9">
                      <MascotIcon name={name} size={36} />
                    </div>
                    <span className="text-[10px] text-[#282C3F] mt-1">{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#FF3F6C] text-white ml-auto'
                      : 'bg-[#F5F5F6] text-[#282C3F]'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.products && msg.products.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2 max-w-[85%]">
                    {msg.products.map((p) => (
                      <a
                        key={p.id}
                        href={`/products/${p.id}`}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5 hover:border-[#FF3F6C] transition-colors"
                      >
                        {p.image && (
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-[#282C3F]">{p.name}</p>
                          <p className="text-xs font-bold text-[#FF3F6C]">Rs.{p.price}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="bg-[#F5F5F6] text-[#7E818C] px-3 py-2 rounded-lg text-sm max-w-[85%]">
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-gray-200 p-2 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 text-sm px-3 py-2 rounded-full bg-[#F5F5F6] focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#FF3F6C] text-white w-9 h-9 rounded-full flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16">
        <MascotIcon name={selectedMascot} size={64} />
      </button>
    </div>
  );
}

export default ChatWidget;