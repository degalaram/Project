import { QueryClient } from "@tanstack/react-query";

// Determine API base URL based on environment - MUST match api.ts logic exactly
const getApiBaseUrl = () => {
  // PRIORITY 1: Use environment variable if available (Cloudflare Pages with VITE_API_BASE_URL)
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('Using VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }

  // PRIORITY 2: For Replit development environment
  if (window.location.hostname.includes('replit.dev') || 
      window.location.hostname.includes('repl.co') || 
      window.location.hostname.includes('replit.app')) {
    const replitUrl = `${window.location.protocol}//${window.location.hostname}`;
    console.log('Using Replit URL:', replitUrl);
    return replitUrl;
  }

  // PRIORITY 3: For localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Using localhost URL');
    return "http://localhost:5000";
  }

  // PRIORITY 4: For Cloudflare Pages and other production deployments
  const productionUrl = "https://project-1-yxba.onrender.com";
  console.log('Using production URL:', productionUrl);
  return productionUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// API request utility function with proper authentication support
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  body?: any,
  customHeaders?: Record<string, string>
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  const options: RequestInit = {
    method,
    credentials: 'include', // CRITICAL: Required for session management
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    signal: controller.signal,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    // Prepend API base URL if it doesn't already exist
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Safe error handling - try JSON first, fallback to text
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
    }

    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        try {
          const url = `${API_BASE_URL}/api/${queryKey.join("/")}`;
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch(url, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(user.id && { 'user-id': user.id }),
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.error('Query timeout after 10 seconds:', queryKey.join('/'));
            throw new Error('Request timed out. Please check your internet connection.');
          }
          console.error('Query failed:', error);
          throw error; // Let the component handle the error properly
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes - reduce API calls
      gcTime: 10 * 60 * 1000, // 10 minutes cache - keep data longer
      refetchOnWindowFocus: false, // Reduce unnecessary API calls
      refetchOnMount: true,
      retry: (failureCount, error) => {
        // Don't retry timeout errors or 4xx errors
        if (error.message.includes('timeout') || error.message.includes('4')) return false;
        return failureCount < 1; // Reduce retries for faster response
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
