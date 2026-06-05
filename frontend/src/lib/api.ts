const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    return `http://${hostname}:5030/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030/api';
};

const API_BASE = getApiBase();

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(token?: string, extraHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers: this.getHeaders(token, fetchOptions.headers as Record<string, string>),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, token?: string) {
    return this.request<T>(endpoint, { method: 'GET', token });
  }

  post<T>(endpoint: string, data?: any, token?: string) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), token });
  }

  put<T>(endpoint: string, data?: any, token?: string) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), token });
  }

  delete<T>(endpoint: string, token?: string) {
    return this.request<T>(endpoint, { method: 'DELETE', token });
  }

  async upload<T>(endpoint: string, file: File, directory: string, token?: string): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}${endpoint}/${directory}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }
}

export const api = new ApiClient(API_BASE);
export default api;
