interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    console.log('🔧 API Client initialized with baseURL:', this.baseURL);
    console.log('🔧 VITE_API_URL from env:', import.meta.env.VITE_API_URL);
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    // TODO: Implement actual token storage (localStorage, cookies, etc.)
    return localStorage.getItem('auth_token');
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    // Concatenate baseURL and endpoint, ensuring no double slashes
    const fullURL = `${this.baseURL}${endpoint}`;
    const url = new URL(fullURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText || 'An error occurred',
        status: response.status,
      };

      try {
        const data = await response.json();
        error.data = data;
        // Try multiple possible error message fields
        error.message = data.error || data.message || error.message;
        console.error('API Error:', { status: response.status, data });
      } catch {
        // Response body is not JSON
        console.error('Non-JSON error response:', response.statusText);
      }

      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();

    // Unwrap API response if it follows { success: true, data: ... } pattern
    if (json.success && 'data' in json) {
      return json.data;
    }

    return json;
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, headers, ...fetchOptions } = options;

    const token = this.getAuthToken();
    const requestHeaders = new Headers({
      ...this.defaultHeaders,
      ...headers as Record<string, string>,
    });

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  }
}

export const apiClient = new ApiClient();
export type { ApiError };
