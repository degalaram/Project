import { QueryClient } from "@tanstack/react-query";

// Determine API base URL based on environment - MUST match api.ts logic exactly
const getApiBaseUrl = () => {
  // Use environment variable if available (Cloudflare Pages with VITE_API_BASE_URL)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // For Replit development environment
  if (window.location.hostname.includes('replit.dev') || 
      window.location.hostname.includes('repl.co') || 
      window.location.hostname.includes('replit.app')) {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
  
  // For localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:5000";
  }
  
  // For Cloudflare Pages deployment, use the Cloudflare Workers proxy
  if (window.location.hostname.includes('pages.dev') || 
      window.location.hostname.includes('workers.dev')) {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
  
  // For production deployment - use same origin
  return `${window.location.protocol}//${window.location.hostname}`;
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
          throw error; // Let the component handle the error properly
        }
      },
      staleTime: 1 * 60 * 1000, // 1 minute for faster updates
      cacheTime: 2 * 60 * 1000, // 2 minutes cache
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: (failureCount, error) => {
        // Don't retry if it's a 4xx error (client error)
        if (error.message.includes('4')) return false;
        return failureCount < 2; // Reduce retries for faster response
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation failed:', error);
      },
    },
  },
});
