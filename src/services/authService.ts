// src/services/authService.ts
import apiClient from '../utils/apiClient';
import { AuthUser, UserRole } from '../types/database';

// On ré‐exporte ici les types pour pouvoir les importer depuis authService
export type { AuthUser, UserRole };

export interface LoginResponse {
  success:        boolean;
  user?:          AuthUser;
  token?:         string;
  redirect_path?: string;
  message?:       string;
}

/**
 * Retourne la route de redirection en fonction du rôle.
 */
export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':     return '/dashboard/admin';
    case 'startup':   return '/dashboard/startup';
    case 'structure': return '/dashboard/structure';
    case 'client':    return '/dashboard/client';
    default:          return '/';
  }
};

export const authService = {
  /**
   * LOGIN
   * L’API renvoie { user?, token?, message?, redirect_path? }.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload = await apiClient.post<{
      user?:          AuthUser;
      token?:         string;
      message?:       string;
      redirect_path?: string;
    }>('/auth/login', { email, password });

    if (!payload.user) {
      return {
        success: false,
        message: payload.message || 'Login failed',
      };
    }

    if (payload.token) {
      apiClient.setAuthToken(payload.token);
    }

    return {
      success:        true,
      user:           payload.user,
      token:          payload.token,
      message:        payload.message,
      redirect_path:  payload.redirect_path ?? getRedirectPath(payload.user.role),
    };
  },

  /**
   * SIGN UP
   * L’API renvoie { user?, token?, message?, redirect_path? }.
   */
  async signUp(data: {
    name:     string;
    email:    string;
    password: string;
    role:     UserRole;
  }): Promise<LoginResponse> {
    const payload = await apiClient.post<{
      user?:          AuthUser;
      token?:         string;
      message?:       string;
      redirect_path?: string;
    }>('/auth/register', data);

    if (!payload.user) {
      return {
        success: false,
        message: payload.message || 'Registration failed',
      };
    }

    if (payload.token) {
      apiClient.setAuthToken(payload.token);
    }

    return {
      success:        true,
      user:           payload.user,
      token:          payload.token,
      message:        payload.message,
      redirect_path:  payload.redirect_path ?? getRedirectPath(payload.user.role),
    };
  },

  /**
   * fetchMe()
   * L’API renvoie { user }.
   */
  async fetchMe(): Promise<AuthUser> {
    const payload = await apiClient.get<{ user?: AuthUser }>('/auth/me');
    if (!payload.user) {
      throw new Error('Could not fetch current user');
    }
    return payload.user;
  },

  /**
   * SIGN OUT
   */
  async signOut(): Promise<void> {
    apiClient.clearAuthToken();
  },
};
