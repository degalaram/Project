
import { QueryClient } from "@tanstack/react-query";

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In development, check if running in Replit
  if (import.meta.env.DEV) {
    // Use current hostname with port 5000 for Replit development
    if (window.location.hostname.includes('replit.dev') || window.location.hostname.includes('repl.co')) {
      return `${window.location.protocol}//${window.location.hostname.replace(/^\w+-/, '')}`; // Remove port prefix for Replit URLs
    }
    return "http://localhost:5000";
  }
  
  // In production, use environment variable or fallback
  return import.meta.env.VITE_API_URL || "https://project-eks8.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

// API request utility function
export async function apiRequest(method: string, url: string, data?: any) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, options);
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `HTTP error! status: ${response.status}`);
  }

  return response;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = `${API_BASE_URL}/api/${queryKey.join("/")}`;
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
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
