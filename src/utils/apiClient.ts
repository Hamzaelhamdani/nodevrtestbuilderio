// API client utility for making HTTP requests to the backend

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const error = isJson && data.error ? data.error : `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(error);
    }

    return data;
  }

  private async handleNetworkError(error: any, endpoint: string): Promise<never> {
    // Only log network errors once per session to avoid spam
    const errorKey = `network_error_${endpoint}`;
    if (!sessionStorage.getItem(errorKey)) {
      console.warn(`Backend API unavailable at ${endpoint}. Running in demo mode.`);
      sessionStorage.setItem(errorKey, 'logged');
    }
    throw error;
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return new Promise<T>((resolve, reject) => {
      // Create manual timeout
      const timeoutId = setTimeout(() => {
        const errorKey = `network_timeout_${endpoint}`;
        if (!sessionStorage.getItem(errorKey)) {
          sessionStorage.setItem(errorKey, 'logged');
        }
        reject(new Error('Backend unavailable'));
      }, 5000);

      // Make the fetch request
      fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      })
        .then(response => {
          clearTimeout(timeoutId);
          return this.handleResponse<T>(response);
        })
        .then(data => resolve(data))
        .catch(error => {
          clearTimeout(timeoutId);
          // Suppress all network-related errors silently
          const errorKey = `network_error_${endpoint}`;
          if (!sessionStorage.getItem(errorKey)) {
            sessionStorage.setItem(errorKey, 'logged');
          }
          // Always reject with a clean error message
          reject(new Error('Backend unavailable'));
        });
    });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Create manual timeout
      const timeoutId = setTimeout(() => {
        const errorKey = `network_timeout_${endpoint}`;
        if (!sessionStorage.getItem(errorKey)) {
          sessionStorage.setItem(errorKey, 'logged');
        }
        reject(new Error('Backend unavailable'));
      }, 5000);

      // Make the fetch request
      fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
      })
        .then(response => {
          clearTimeout(timeoutId);
          return this.handleResponse<T>(response);
        })
        .then(data => resolve(data))
        .catch(error => {
          clearTimeout(timeoutId);
          // Suppress all network-related errors silently
          const errorKey = `network_error_${endpoint}`;
          if (!sessionStorage.getItem(errorKey)) {
            sessionStorage.setItem(errorKey, 'logged');
          }
          // Always reject with a clean error message
          reject(new Error('Backend unavailable'));
        });
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const errorKey = `network_timeout_${endpoint}`;
        if (!sessionStorage.getItem(errorKey)) {
          sessionStorage.setItem(errorKey, 'logged');
        }
        reject(new Error('Backend unavailable'));
      }, 5000);

      fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
      })
        .then(response => {
          clearTimeout(timeoutId);
          return this.handleResponse<T>(response);
        })
        .then(data => resolve(data))
        .catch(error => {
          clearTimeout(timeoutId);
          const errorKey = `network_error_${endpoint}`;
          if (!sessionStorage.getItem(errorKey)) {
            sessionStorage.setItem(errorKey, 'logged');
          }
          reject(new Error('Backend unavailable'));
        });
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const errorKey = `network_timeout_${endpoint}`;
        if (!sessionStorage.getItem(errorKey)) {
          sessionStorage.setItem(errorKey, 'logged');
        }
        reject(new Error('Backend unavailable'));
      }, 5000);

      fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      })
        .then(response => {
          clearTimeout(timeoutId);
          return this.handleResponse<T>(response);
        })
        .then(data => resolve(data))
        .catch(error => {
          clearTimeout(timeoutId);
          const errorKey = `network_error_${endpoint}`;
          if (!sessionStorage.getItem(errorKey)) {
            sessionStorage.setItem(errorKey, 'logged');
          }
          reject(new Error('Backend unavailable'));
        });
    });
  }

  // Set auth token
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Clear auth token
  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
