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
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        setLoading(false);
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, kuch error aa gaya. Try again.' }]);
        setLoading(false);
      });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl mb-3 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#FF3F6C] text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Shop Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-lg">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#FF3F6C] text-white ml-auto'
                    : 'bg-[#F5F5F6] text-[#282C3F]'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-[#F5F5F6] text-[#7E818C] px-3 py-2 rounded-lg text-sm max-w-[85%]">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-gray-200 p-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm px-3 py-2 rounded-full bg-[#F5F5F6] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#FF3F6C] text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Send
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