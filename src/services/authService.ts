import apiClient from '../utils/apiClient';
import { AuthUser, UserRole, CreateStartupRequest, CreateStructureRequest } from '../types/database';

interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  country?: string;
  role: UserRole;
  startup_data?: CreateStartupRequest;
  structure_data?: CreateStructureRequest;
}

interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  redirect_path?: string;
  message?: string;
}

// Redirect paths based on user role
const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'startup':
      return '/dashboard/startup';
    case 'structure':
      return '/dashboard/structure';
    case 'client':
      return '/dashboard/client';
    default:
      return '/dashboard';
  }
};

export const authService = {
  // Sign up with role-based profile creation
  async signUp(data: SignUpData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/register', data);

      if (response.token) {
        apiClient.setAuthToken(response.token);
      }

      return {
        success: true,
        user: response.user,
        redirect_path: getRedirectPath(response.user.role),
        message: response.message,
      };
    } catch (error) {
      // Only log if it's not a network/backend error
      if (
        !(error instanceof Error) ||
        (!error.message.includes('Failed to fetch') &&
         !error.message.includes('Backend unavailable') &&
         !error.message.includes('Network connection unavailable') &&
         error.name !== 'NetworkError')
      ) {
        console.error('Sign up error:', error);
      }

      // Fallback: Demo mode account creation
      if (error instanceof Error &&
          (error.message.includes('Failed to fetch') ||
           error.message.includes('Backend unavailable'))) {
        const demoUser = {
          id: `demo-${Date.now()}`,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          is_approved: data.role === 'client',
          created_at: new Date().toISOString(),
        };

        // Create a demo JWT token
        const demoToken = btoa(JSON.stringify({
          userId: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }));

        apiClient.setAuthToken(`demo.${demoToken}.demo`);

        return {
          success: true,
          user: demoUser,
          redirect_path: getRedirectPath(demoUser.role),
          message: data.role === 'client'
            ? 'Account created successfully (Demo Mode - Backend not available)'
            : 'Account created successfully. Awaiting admin approval (Demo Mode - Backend not available)',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred during signup',
      };
    }
  },

  // Sign in with automatic redirect
  async signIn(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (response.token) {
        apiClient.setAuthToken(response.token);
      }

      return {
        success: true,
        user: response.user,
        redirect_path: getRedirectPath(response.user.role),
        message: response.message,
      };
    } catch (error) {
      // Only log if it's not a network/backend error
      if (
        !(error instanceof Error) ||
        (!error.message.includes('Failed to fetch') &&
         !error.message.includes('Backend unavailable') &&
         !error.message.includes('Network connection unavailable') &&
         error.name !== 'NetworkError')
      ) {
        console.error('Sign in error:', error);
      }

      // Fallback: Demo mode with test accounts
      if (error instanceof Error &&
          (error.message.includes('Failed to fetch') ||
           error.message.includes('Backend unavailable'))) {
        // Check for demo accounts
        const testAccounts = [
          { email: 'admin@venturesroom.com', password: 'password', role: 'admin' },
          { email: 'startup@venturesroom.com', password: 'password', role: 'startup' },
          { email: 'client@venturesroom.com', password: 'password', role: 'client' },
          { email: 'structure@venturesroom.com', password: 'password', role: 'structure' },
        ];

        const testAccount = testAccounts.find(acc => acc.email === email && acc.password === password);

        if (testAccount) {
          const demoUser = {
            id: `demo-${testAccount.role}`,
            email: testAccount.email,
            full_name: `Demo ${testAccount.role.charAt(0).toUpperCase() + testAccount.role.slice(1)}`,
            role: testAccount.role as UserRole,
            is_approved: true,
            created_at: new Date().toISOString(),
          };

          // Create a demo JWT token
          const demoToken = btoa(JSON.stringify({
            userId: demoUser.id,
            email: demoUser.email,
            role: demoUser.role,
            exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          }));

          apiClient.setAuthToken(`demo.${demoToken}.demo`);

          return {
            success: true,
            user: demoUser,
            redirect_path: getRedirectPath(demoUser.role),
            message: 'Logged in successfully (Demo Mode - Backend not available)',
          };
        }
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred during login',
      };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      apiClient.clearAuthToken();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  // Get current user with role information
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.user;
    } catch (error) {
      // Only log if it's not a backend unavailable error
      if (error instanceof Error && !error.message.includes('Backend unavailable')) {
        console.error('Error getting current user:', error);
      }

      // Check if there's a stored token (for offline mode)
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Try to decode the JWT payload for basic user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          return {
            id: payload.userId,
            email: payload.email,
            full_name: payload.email.split('@')[0],
            role: payload.role,
            is_approved: true,
            created_at: new Date().toISOString(),
          };
        } catch (decodeError) {
          // Silently handle decode errors
          localStorage.removeItem('auth_token');
        }
      }

      return null;
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<AuthUser>): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.put('/users/profile', updates);
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  },

  // Check if user has required role
  hasRole(user: AuthUser | null, requiredRole: UserRole | UserRole[]): boolean {
    if (!user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  },

  // Check if user is approved
  isApproved(user: AuthUser | null): boolean {
    if (!user) return false;
    return user.is_approved || user.role === 'client' || user.role === 'admin';
  },

  // Get user stats (for admin)
  async getUserStats(): Promise<number> {
    try {
      const response = await apiClient.get('/admin/analytics');
      return Object.values(response.users).reduce((sum: number, count: any) => sum + count, 0);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return 0;
    }
  },
};
