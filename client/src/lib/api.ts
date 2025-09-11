
const getApiUrl = () => {
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
  
  // Default fallback - your actual Render backend URL
  return "https://project-1-yxba.onrender.com";
};

const API_URL = getApiUrl();

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  return response;
}
