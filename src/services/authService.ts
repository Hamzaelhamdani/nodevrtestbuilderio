// src/services/authService.ts
import apiClient from '../utils/apiClient'
import { AuthUser, UserRole } from '../types/database'

export interface LoginResponse {
  success: boolean
  user?: AuthUser
  token?: string
  redirect_path?: string
  message?: string
}

// Helper pour rediriger selon le rôle
const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'startup':
      return '/dashboard/startup'
    case 'structure':           // <— ici "structure" et non "supportstructure"
      return '/dashboard/structure'
    case 'client':
      return '/dashboard/client'
    default:
      return '/'
  }
}

export const authService = {
  // ——— LOGIN ———
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const payload = await apiClient.post<{
        user: AuthUser
        token?: string
        redirect_path?: string
        message?: string
      }>('auth/login', { email, password })

      // Si le backend renvoie un token, on l'utilise
      if (payload.token) {
        apiClient.setAuthToken(payload.token)
      }

      return {
        success: true,
        user: payload.user,
        token: payload.token,
        redirect_path:
          payload.redirect_path ?? getRedirectPath(payload.user.role),
        message: payload.message,
      }
    } catch (err: any) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Login failed',
      }
    }
  },

  // ——— SIGN UP ———
  async signUp(data: {
    name: string
    email: string
    password: string
    role: UserRole
  }): Promise<LoginResponse> {
    try {
      const payload = await apiClient.post<{
        user: AuthUser
        token: string
        redirect_path?: string
        message?: string
      }>('auth/register', data)

      if (!payload.token) {
        return {
          success: false,
          message: payload.message || 'Registration failed',
        }
      }

      apiClient.setAuthToken(payload.token)
      return {
        success: true,
        user: payload.user,
        token: payload.token,
        redirect_path:
          payload.redirect_path ?? getRedirectPath(payload.user.role),
        message: payload.message,
      }
    } catch (err: any) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Registration failed',
      }
    }
  },

  // ——— FETCH CURRENT USER ———
  async fetchMe(): Promise<AuthUser | null> {
    try {
      const res = await apiClient.get<{
        success: boolean
        data: AuthUser
        message?: string
      }>('auth/me')
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Could not fetch user')
      }
      return res.data
    } catch (error) {
      // Silently return null for auth errors (expected when not logged in)
      return null
    }
  },

  // ——— SIGN OUT ———
  async signOut(): Promise<void> {
    apiClient.clearAuthToken()
  },

  getRedirectPath,
}

// Pour pouvoir importer AuthUser et UserRole depuis ici si besoin
export type { AuthUser, UserRole }
