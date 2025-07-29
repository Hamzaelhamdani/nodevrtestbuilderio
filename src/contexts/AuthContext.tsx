// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, LoginResponse } from '../services/authService';
import type { AuthUser } from '../types/database';

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

  // Au montage, on essaye de récupérer l’utilisateur courant depuis le token stocké
  useEffect(() => {
    (async () => {
      try {
        const me = await authService.fetchMe();
        setUser(me);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  // login() appellera authService.login puis mettra à jour le user
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  // logout() effacera le token et remettra user à null
  const logout = async (): Promise<void> => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour récupérer le contexte facilement
export const useAuth = (): AuthContextType => useContext(AuthContext);
