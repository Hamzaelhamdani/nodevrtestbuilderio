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
    let url = `${this.baseURL}/${endpoint}`.replace(/\/+/g, '/');
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k,v]) => {
        if (v!=null) searchParams.append(k, String(v));
      });
      url += `?${searchParams.toString()}`;
    }
    
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<T>(res);
  }

  async post<T=any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`.replace(/\/+/g, '/');
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  async put<T=any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`.replace(/\/+/g, '/');
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  async delete<T=any>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`.replace(/\/+/g, '/');
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
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
