import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/globals.css';

// ─── Security Hardening & Console Protection ────────────────────────────────
if (import.meta.env.PROD) {
  // Suppress sensitive logging in production
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

// ─── Global Error Suppression for 3rd-Party Chrome Extensions / VM Scripts ───
// Menangani error dari extension browser / performance observer yang tidak berasal dari app SIMPRESMA
// Contoh: Uncaught TypeError: Cannot read properties of undefined (reading 'startTime') at reportAllChanges
window.addEventListener('error', (event) => {
  if (
    event.message?.includes("Cannot read properties of undefined (reading 'startTime')") ||
    event.message?.includes('reportAllChanges') ||
    (event.filename && event.filename.startsWith('VM')) ||
    event.filename?.includes('chrome-extension://')
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
