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
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response;
}
