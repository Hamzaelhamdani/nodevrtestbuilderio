import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthUser, LoginResponse } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false, message: 'Not initialized' }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await authService.fetchMe();
        setUser(me);
      } catch (error) {
        // Silently handle authentication errors on initial load
        // This is expected when user is not logged in
        setUser(null);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
