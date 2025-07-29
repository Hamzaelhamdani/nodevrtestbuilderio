// src/utils/apiClient.ts
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

  private getHeaders(): Record<string,string> {
    const headers: Record<string,string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const payload = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const err = isJson && (payload as any).error
        ? (payload as any).error
        : `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(err);
    }
    return payload as T;
  }

  async get<T=any>(endpoint: string, params?: Record<string,any>): Promise<T> {
    const url = new URL(this.baseURL + endpoint, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k,v]) => {
        if (v!=null) url.searchParams.append(k, String(v));
      });
    }
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<T>(res);
  }

  async post<T=any>(endpoint: string, data?: any): Promise<T> {
    const res = await fetch(this.baseURL + endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }
  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
export type { ApiResponse };
