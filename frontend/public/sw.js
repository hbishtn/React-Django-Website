// Minimal service worker — sirf PWA install-eligibility ke liye hai.
// Jaan-boojh kar kuch bhi cache nahi kar raha, taaki live site ka
// koi bhi data/behaviour is wajah se stale ya galat na ho.
self.addEventListener('fetch', () => {});