// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { authService, LoginResponse, AuthUser } from '../services/authService';
import axios from 'axios';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Au montage, si on a un token, on le remet dans axios et on fetchMe()
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      authService.fetchMe()
        .then(me => setUser(me))
        .catch(() => {
          localStorage.removeItem('auth_token');
          delete axios.defaults.headers.common.Authorization;
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.token) {
      localStorage.setItem('auth_token', result.token);
      axios.defaults.headers.common.Authorization = `Bearer ${result.token}`;
      // recharge l’utilisateur
      const me = await authService.fetchMe();
      setUser(me);
      result.user = me;
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
