import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    fetch(`${import.meta.env.VITE_API_URL}/password-reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message || 'Reset link bhej diya gaya hai, agar email registered hai.');
        setSubmitted(true);
      })
      .catch(() => setMessage('Kuch galat ho gaya, dobara try karo.'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Apna email daalo, hum reset link bhej denge.
        </p>

        {message && (
          <p className="text-sm text-center text-green-600 mb-4">{message}</p>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          <Link to="/login" className="text-pink-600 hover:underline">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
