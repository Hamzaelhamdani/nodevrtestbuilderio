// src/services/authService.ts
import apiClient from '../utils/apiClient'
import type { AuthUser, UserRole } from '../types/database'

export type { AuthUser, UserRole }  // <-- on ré-exporte les types

export interface LoginResponse {
  success:       boolean
  user?:         AuthUser
  token?:        string
  redirect_path?: string
  message?:      string
}

// redirections par rôle
const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':     return '/dashboard/admin'
    case 'startup':   return '/dashboard/startup'
    case 'structure': return '/dashboard/structure'
    case 'client':    return '/dashboard/client'
    default:          return '/'
  }
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload = await apiClient.post<{
      user: AuthUser
      token: string
      redirect_path?: string
      message?: string
    }>('/auth/login', { email, password })

    if (!payload.token) {
      return { success: false, message: payload.message || 'Login failed' }
    }

    apiClient.setAuthToken(payload.token)
    return {
      success:       true,
      user:          payload.user,
      token:         payload.token,
      redirect_path: payload.redirect_path ?? getRedirectPath(payload.user.role),
      message:       payload.message,
    }
  },

  async signUp(data: {
    name: string
    email: string
    password: string
    role: UserRole
  }): Promise<LoginResponse> {
    const payload = await apiClient.post<{
      user: AuthUser
      token: string
      redirect_path?: string
      message?: string
    }>('/auth/register', data)

    if (!payload.token) {
      return { success: false, message: payload.message || 'Registration failed' }
    }

    apiClient.setAuthToken(payload.token)
    return {
      success:       true,
      user:          payload.user,
      token:         payload.token,
      redirect_path: payload.redirect_path ?? getRedirectPath(payload.user.role),
      message:       payload.message,
    }
  },

  async fetchMe(): Promise<AuthUser> {
    const res = await apiClient.get<{ success: boolean; data: AuthUser; message?: string }>('/auth/me')
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Could not fetch user')
    }
    return res.data
  },

  async signOut(): Promise<void> {
    apiClient.clearAuthToken()
  },
}
