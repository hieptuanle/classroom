/**
 * API configuration based on environment
 */
export const API_CONFIG = {
  development: "http://localhost:4000",
  test: "http://localhost:4000",
  production: "https://classroom.thtech.dev",
} as const;

/**
 * Get the current environment
 */
const getEnvironment = (): keyof typeof API_CONFIG => {
  if (__DEV__) {
    return "development";
  }

  return "production";
};

/**
 * Get the base API URL for the current environment
 */
export const getApiBaseUrl = (): string => {
  const env = getEnvironment();
  return API_CONFIG[env];
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",
    profile: "/api/v1/auth/profile",
    refresh: "/api/v1/auth/refresh",
  },

  // Classes endpoints
  classes: {
    list: "/api/v1/classes",
    create: "/api/v1/classes",
    byId: (id: string) => `/api/v1/classes/${id}`,
    join: (id: string) => `/api/v1/classes/${id}/join`,
    leave: (id: string) => `/api/v1/classes/${id}/leave`,
  },

  // Users endpoints
  users: {
    list: "/api/v1/users",
    byId: (id: string) => `/api/v1/users/${id}`,
  },
} as const;

/**
 * Build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint}`;
};
