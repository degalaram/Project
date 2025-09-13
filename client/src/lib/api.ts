const getApiUrl = () => {
  // PRIORITY 1: Use environment variable if available (Cloudflare Pages with VITE_API_BASE_URL)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // PRIORITY 2: For Replit development environment
  if (window.location.hostname.includes('replit.dev') || 
      window.location.hostname.includes('repl.co') || 
      window.location.hostname.includes('replit.app')) {
    return `${window.location.protocol}//${window.location.hostname}`;
  }

  // PRIORITY 3: For localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:5000";
  }

  // PRIORITY 4: For Cloudflare Workers - point directly to Render backend
  if (window.location.hostname.includes('workers.dev')) {
    return "https://project-1-yxba.onrender.com";
  }

  // PRIORITY 5: For ALL other production deployments - use Render backend
  return "https://project-1-yxba.onrender.com";
};

const API_URL = getApiUrl();

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    credentials: "include", // CRITICAL: Required for session management
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

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
}
