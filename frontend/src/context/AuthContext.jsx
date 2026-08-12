import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [isStaff, setIsStaff] = useState(localStorage.getItem('isStaff') === 'true');

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
  };

  return (
    <AuthContext.Provider value={{ token, username, isStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}