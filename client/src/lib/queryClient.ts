import { QueryClient } from "@tanstack/react-query";

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Use environment variable if available (Cloudflare Pages with VITE_API_BASE_URL)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check for explicit API URL first
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In development, check if running in Replit
  if (import.meta.env?.DEV) {
    // Use current hostname with port 5000 for Replit development
    if (window.location.hostname.includes('replit.dev') || 
        window.location.hostname.includes('repl.co') || 
        window.location.hostname.includes('replit.app')) {
      return `${window.location.protocol}//${window.location.hostname}`;
    }
    return "http://localhost:5000";
  }

  // Default fallback - your actual Render backend URL
  return "https://project-1-yxba.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

// API request utility function
export async function apiRequest(
  method: string,
  url: string,
  body?: any,
  customHeaders?: Record<string, string>
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Prepend API base URL if it doesn't already exist
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  return fetch(fullUrl, options);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        try {
          // If no API URL is configured, return empty data instead of making failed requests
          if (!API_BASE_URL) {
            console.warn('No API URL configured, returning mock data');
            return { data: [] };
          }

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
        } catch (error) {
          console.error('Query failed:', error);
          // Return empty data instead of throwing to prevent unhandled rejections
          return { data: [] };
        }
      },
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation failed:', error);
      },
    },
  },
});
