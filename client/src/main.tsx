import { createRoot } from "react-dom/client";
import { ThemeProvider } from '@/lib/theme-context';
import App from "./App";
import "./index.css";

// Disable Vite HMR completely for Replit environment
if (import.meta.hot) {
  import.meta.hot.accept = () => {};
  import.meta.hot.dispose = () => {};
  import.meta.hot.invalidate = () => {};
}

// Enhanced global error handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Full error details:', event);
  // Prevent the error from being logged to console as unhandled
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Debug environment info
console.log('🔧 Application starting...');
console.log('🌍 Environment:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  hostname: window.location.hostname,
  origin: window.location.origin
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ Root element found, creating React app...');

try {
  createRoot(rootElement).render(
    <ThemeProvider defaultTheme="system" storageKey="job-portal-theme">
      <App />
    </ThemeProvider>
  );
  console.log('✅ React app rendered successfully');
  
  // Hide loading screen after successful render
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }, 100);
} catch (error) {
  console.error('❌ Error rendering React app:', error);
  throw error;
}
