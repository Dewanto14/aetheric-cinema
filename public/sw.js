self.addEventListener('install', (event) => {
  console.log('Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

// A simple fetch handler is required by Chrome to trigger the install prompt
self.addEventListener('fetch', (event) => {
  // We can just let the browser handle everything normally
  return;
});
