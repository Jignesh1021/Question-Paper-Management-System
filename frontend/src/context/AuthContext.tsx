import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  profilePicture?: string;
  token?: string;
  batchId?: string;
  optionalBatches?: string[];
  teacherBatches?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if token exists in URL (from Google Auth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParams = urlParams.get('token');

    if (tokenParams) {
      // Decode JWT token logic using standard atob for payload
      try {
        const payload = JSON.parse(atob(tokenParams.split('.')[1]));
        const googleUser: User = {
          _id: payload.id,
          name: payload.name || 'Google User',
          email: payload.email || '',
          role: payload.role || 'student',
          token: tokenParams,
        };
        login(googleUser);
        window.history.replaceState({}, document.title, window.location.pathname); // clear token from URL
      } catch (e) {
        console.error("Invalid token format");
      }
    } else {
      const storedUser = localStorage.getItem('qpms_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('qpms_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qpms_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
