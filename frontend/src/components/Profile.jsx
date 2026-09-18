import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarFrame, { FRAMES, FRAME_ORDER } from './AvatarFrame';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Profile() {
  const { token, username, updateAvatar } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingFrame, setSavingFrame] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/profile/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setPhone(data.phone || '');
        setEmail(data.email || '');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePictureSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    setUploading(true);
    fetch(`${import.meta.env.VITE_API_URL}/profile/update/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setProfile((prev) => ({ ...prev, profile_picture: data.profile_picture }));
        updateAvatar({ profile_picture: data.profile_picture });
      })
      .finally(() => setUploading(false));
  };

  const handleFrameSelect = (frameId) => {
    if (savingFrame) return;
    setSavingFrame(true);
    fetch(`${import.meta.env.VITE_API_URL}/profile/update/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: (() => {
        const fd = new FormData();
        fd.append('avatar_frame', frameId);
        return fd;
      })(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setProfile((prev) => ({ ...prev, avatar_frame: data.avatar_frame }));
        updateAvatar({ avatar_frame: data.avatar_frame });
      })
      .finally(() => setSavingFrame(false));
  };

  const handleInfoSave = (e) => {
    e.preventDefault();
    setSavingInfo(true);
    setInfoMessage('');

    fetch(`${import.meta.env.VITE_API_URL}/profile/update/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: (() => {
        const fd = new FormData();
        fd.append('phone', phone);
        fd.append('email', email);
        return fd;
      })(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setInfoMessage(data.error);
          return;
        }
        setInfoMessage('Details save ho gayi.');
        setProfile((prev) => ({ ...prev, phone: data.phone, email: data.email }));
      })
      .finally(() => setSavingInfo(false));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    setChangingPassword(true);

    fetch(`${import.meta.env.VITE_API_URL}/profile/change-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setPasswordError(data.error);
          return;
        }
        setPasswordMessage('Password update ho gaya.');
        setOldPassword('');
        setNewPassword('');
      })
      .finally(() => setChangingPassword(false));
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#F5F5F6] flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="font-display text-2xl sm:text-3xl text-[#282C3F]">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Apni photo, frame aur account details manage karo.
        </p>

        {/* Header card: picture + basic info + stats */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <AvatarFrame
                src={profile.profile_picture}
                username={username}
                frame={profile.avatar_frame}
                size={88}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                aria-label="Change profile picture"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#FF3F6C] text-white flex items-center justify-center shadow-sm hover:bg-[#e6395f] transition-colors disabled:opacity-60"
              >
                {uploading ? (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-9-9" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 13a3 3 0 003 3h10a3 3 0 003-3V9a3 3 0 00-3-3h-1l-1.5-2h-5L8 6H7a3 3 0 00-3 3z" />
                    <circle cx="12" cy="13" r="3.2" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePictureSelect}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-display text-xl text-[#282C3F]">{username}</p>
              <p className="text-sm text-gray-500">{profile.email || 'No email set'}</p>
              <p className="text-xs text-gray-400 mt-1">Member since {formatDate(profile.date_joined)}</p>
            </div>

            <div className="flex gap-4 sm:gap-6 justify-center sm:justify-end shrink-0">
              <div className="text-center">
                <p className="font-display text-xl text-[#282C3F]">{profile.order_count}</p>
                <p className="text-[11px] text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl text-[#282C3F]">
                  ₹{Number(profile.total_spent || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-gray-500">Spent</p>
              </div>
            </div>
          </div>

          <Link
            to="/orders"
            className="inline-block mt-4 text-xs font-semibold text-[#FF3F6C] hover:underline"
          >
            View my orders →
          </Link>
        </div>

        {/* Frame picker */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 mb-5">
          <h3 className="font-display text-lg text-[#282C3F] mb-1">Profile frame</h3>
          <p className="text-xs text-gray-500 mb-4">
            Apni photo ke around ek frame chuno — Navbar aur profile sab jagah dikhega.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {FRAME_ORDER.map((frameId) => {
              const config = FRAMES[frameId];
              const isSelected = profile.avatar_frame === frameId;
              return (
                <button
                  key={frameId}
                  onClick={() => handleFrameSelect(frameId)}
                  disabled={savingFrame}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-[#FF3F6C] bg-[#FFF1F4]'
                      : 'border-transparent hover:bg-[#F5F5F6]'
                  } disabled:opacity-60`}
                >
                  <div className="relative">
                    <AvatarFrame
                      src={profile.profile_picture}
                      username={username}
                      frame={frameId}
                      size={52}
                    />
                    {config.tier === 'premium' && (
                      <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold text-white bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full px-1.5 py-0.5 leading-none">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-600 text-center leading-tight">
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Account info */}
          <form onSubmit={handleInfoSave} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
            <h3 className="font-display text-lg text-[#282C3F] mb-4">Account details</h3>

            {infoMessage && (
              <p
                className={`text-xs font-medium rounded-lg px-3 py-2 mb-3 ${
                  infoMessage.includes('save') && !infoMessage.includes('pehle')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-[#FFF1F4] text-[#FF3F6C]'
                }`}
              >
                {infoMessage}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#282C3F] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#282C3F] mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C]"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingInfo}
              className="mt-4 w-full bg-[#282C3F] text-white text-sm font-semibold py-2.5 rounded-full hover:bg-black transition-colors disabled:opacity-60"
            >
              {savingInfo ? 'Saving…' : 'Save details'}
            </button>
          </form>

          {/* Change password */}
          <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
            <h3 className="font-display text-lg text-[#282C3F] mb-4">Change password</h3>

            {passwordMessage && (
              <p className="text-xs font-medium bg-green-50 text-green-700 rounded-lg px-3 py-2 mb-3">
                {passwordMessage}
              </p>
            )}
            {passwordError && (
              <p className="text-xs font-medium bg-[#FFF1F4] text-[#FF3F6C] rounded-lg px-3 py-2 mb-3">
                {passwordError}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#282C3F] mb-1.5">Current password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#282C3F] mb-1.5">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C]"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-4 w-full bg-[#FF3F6C] text-white text-sm font-semibold py-2.5 rounded-full hover:bg-[#e6395f] transition-colors disabled:opacity-60"
            >
              {changingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
