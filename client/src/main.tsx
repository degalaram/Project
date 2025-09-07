import { createRoot } from "react-dom/client";
import { ThemeProvider } from '@/lib/theme-context';
import App from "./App";
import "./index.css";

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the error from being logged to console as unhandled
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="job-portal-theme">
    <App />
  </ThemeProvider>
);
