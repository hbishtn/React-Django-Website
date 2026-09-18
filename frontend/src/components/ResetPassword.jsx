import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Dono password match nahi kar rahe.');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/password-reset-confirm/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, new_password: newPassword }),
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setMessage(data.message);
          setSuccess(true);
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(data.error || 'Kuch galat ho gaya.');
        }
      })
      .catch(() => setError('Kuch galat ho gaya, dobara try karo.'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Reset Password
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

export default ResetPassword;
