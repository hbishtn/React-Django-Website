import { useState, useRef, useEffect } from 'react';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Main aapki kis tarah help kar sakta hu skincare/makeup se related?' },
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

    const userMessage = { role: 'user', content: input };
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
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, kuch error aa gaya. Try again.' }]);
        setLoading(false);
      });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl mb-3 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#FF3F6C] text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Shop Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-lg">×</button>
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
                  <div className="flex flex-col gap-1.5 mt-2">
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
                          <p className="text-xs font-bold text-[#FF3F6C]">₹{p.price}</p>
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#FF3F6C] text-white text-2xl shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
}

export default ChatWidget;