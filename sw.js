// sw.js — Nizam: تشغيل الصفحة بدون إنترنت. غيّر رقم النسخة عند كل نشر جديد.
const VERSION = 'nizam-v1';
const SHELL = ["./", "index.html", "style.css", "config.js", "offline.js", "app.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "vendor/supabase.js", "vendor/fa/css/all.min.css", "vendor/fonts/cairo.css", "vendor/fa/webfonts/fa-brands-400.woff2", "vendor/fa/webfonts/fa-regular-400.woff2", "vendor/fa/webfonts/fa-solid-900.woff2", "vendor/fa/webfonts/fa-v4compatibility.woff2", "vendor/fonts/cairo-arabic-400-normal.woff2", "vendor/fonts/cairo-arabic-600-normal.woff2", "vendor/fonts/cairo-arabic-700-normal.woff2", "vendor/fonts/cairo-arabic-800-normal.woff2", "vendor/fonts/cairo-arabic-900-normal.woff2", "vendor/fonts/cairo-latin-400-normal.woff2", "vendor/fonts/cairo-latin-600-normal.woff2", "vendor/fonts/cairo-latin-700-normal.woff2", "vendor/fonts/cairo-latin-800-normal.woff2", "vendor/fonts/cairo-latin-900-normal.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;           // طلبات Supabase بتتعامل معاها offline.js
  if (r.mode === 'navigate') {                                              // الصفحة: الشبكة الأول (3 ثواني) وبعدين النسخة المخزّنة
    e.respondWith(new Promise(res => {
      const t = setTimeout(() => caches.match('index.html').then(m => m && res(m)), 3000);
      fetch(r).then(n => { clearTimeout(t); caches.open(VERSION).then(c => c.put('index.html', n.clone())); res(n); })
        .catch(() => caches.match('index.html').then(m => { clearTimeout(t); res(m || Response.error()); }));
    }));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => {
    const net = fetch(r).then(n => { if (n.ok) caches.open(VERSION).then(c => c.put(r, n.clone())); return n; }).catch(() => m);
    return m || net;
  }));
});
