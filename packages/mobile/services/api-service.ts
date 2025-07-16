import { API_ENDPOINTS, buildApiUrl } from "@/config/api";

/**
 * Generic API service for making HTTP requests
 */
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = buildApiUrl(endpoint);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

export const apiService = new ApiService();

/**
 * User-related API calls
 */
export const userApi = {
  getUsers: async (): Promise<Array<{
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    role: string;
    isActive: boolean;
  }>> => {
    const response = await apiService.get<{ data: Array<{
      id: string;
      email: string;
      username: string;
      fullName: string | null;
      role: string;
      isActive: boolean;
    }>; }>(API_ENDPOINTS.users.list);
    return response.data;
  },
  getUserById: (id: string) => apiService.get(API_ENDPOINTS.users.byId(id)),
};

/**
 * Class-related API calls
 */
export const classApi = {
  getClasses: () => apiService.get(API_ENDPOINTS.classes.list),
  getClassById: (id: string) => apiService.get(API_ENDPOINTS.classes.byId(id)),
  createClass: (data: unknown) => apiService.post(API_ENDPOINTS.classes.create, data),
  joinClass: (id: string) => apiService.post(API_ENDPOINTS.classes.join(id)),
  leaveClass: (id: string) => apiService.post(API_ENDPOINTS.classes.leave(id)),
};

/**
 * Auth-related API calls
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post(API_ENDPOINTS.auth.login, credentials),
  register: (userData: unknown) =>
    apiService.post(API_ENDPOINTS.auth.register, userData),
  getProfile: (token: string) =>
    apiService.get(API_ENDPOINTS.auth.profile, { Authorization: `Bearer ${token}` }),
  refreshToken: (refreshToken: string) =>
    apiService.post(API_ENDPOINTS.auth.refresh, { refreshToken }),
};
