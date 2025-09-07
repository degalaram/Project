import { QueryClient } from "@tanstack/react-query";

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In development, check if running in Replit
  if (import.meta.env.DEV) {
    // Use current hostname with port 5000 for Replit development
    if (window.location.hostname.includes('replit.dev') || 
        window.location.hostname.includes('repl.co') || 
        window.location.hostname.includes('replit.app')) {
      return `${window.location.protocol}//${window.location.hostname}`;
    }
    return "http://localhost:5000";
  }

  // In production, use environment variable or fallback
  return import.meta.env.VITE_API_URL || "https://project-eks8.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

// API request utility function
export async function apiRequest(method: string, url: string, data?: any) {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add user-id header if user is logged in
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      (config.headers as Record<string, string>)['user-id'] = user.id;
    }
  } catch (error) {
    // Ignore localStorage errors
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Request failed: ${response.status}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use the text as error message
      errorMessage = errorText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = `${API_BASE_URL}/api/${queryKey.join("/")}`;
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(user.id && { 'user-id': user.id }),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});