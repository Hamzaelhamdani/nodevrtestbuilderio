// src/services/authService.ts
import apiClient from '../utils/apiClient';
import { AuthUser, UserRole } from '../types/database';

// On ré-exporte AuthUser et UserRole
export type { AuthUser, UserRole };

export interface LoginResponse {
  success:        boolean;
  user?:          AuthUser;
  token?:         string;
  redirect_path?: string;
  message?:       string;
}

/**
 * Retourne la route de redirection en fonction du rôle (insensible à la casse).
 */
export const getRedirectPath = (role: string): string => {
  const key = role.toLowerCase();
  if (key === 'admin') return '/dashboard/admin';
  if (key === 'startup') return '/dashboard/startup';
  // on accepte soit "supportstructure" soit l’ancien "structure"
  if (key === 'supportstructure' || key === 'structure') {
    return '/dashboard/structure';
  }
  if (key === 'client') return '/dashboard/client';
  return '/';
};

export const authService = {
  /**
   * LOGIN
   * Attendu : POST /auth/login → { user?, token?, message?, redirect_path? }
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
   * Attendu : POST /auth/register → { user?, token?, message?, redirect_path? }
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
   * Attendu : GET /auth/me → { user }
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
