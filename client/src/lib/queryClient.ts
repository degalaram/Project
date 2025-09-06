import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get API base URL from environment variable or use relative path for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://your-render-backend.onrender.com' : 'http://localhost:5000');

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Prepend API base URL if it's set and URL is relative
  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;

  // Log API calls in development for debugging
  if (import.meta.env.DEV) {
    console.log(`API ${method} ${fullUrl}`);
  }

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Prepend API base URL if it's set and URL is relative
    const url = queryKey.join("/") as string;
    const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;

    // Log API calls in development for debugging
    if (import.meta.env.DEV) {
      console.log(`API GET ${fullUrl}`);
    }

    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
