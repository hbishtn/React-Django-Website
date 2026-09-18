import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [isStaff, setIsStaff] = useState(localStorage.getItem('isStaff') === 'true');
  const [profilePicture, setProfilePicture] = useState(null);
  const [avatarFrame, setAvatarFrame] = useState('none');

  const login = (newToken, newUsername, staffStatus) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('isStaff', staffStatus);
    setToken(newToken);
    setUsername(newUsername);
    setIsStaff(staffStatus);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isStaff');
    setToken(null);
    setUsername(null);
    setIsStaff(false);
    setProfilePicture(null);
    setAvatarFrame('none');
  };

  // Navbar/dropdown mein turant dikhane ke liye jab bhi Profile page par photo/frame save ho
  const updateAvatar = ({ profile_picture, avatar_frame }) => {
    if (profile_picture !== undefined) setProfilePicture(profile_picture);
    if (avatar_frame !== undefined) setAvatarFrame(avatar_frame);
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/profile/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfilePicture(data.profile_picture || null);
          setAvatarFrame(data.avatar_frame || 'none');
        }
      })
      .catch(() => {});
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isStaff,
        profilePicture,
        avatarFrame,
        login,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}