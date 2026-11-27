// sw.js — Nizam: تشغيل الصفحة بدون إنترنت. غيّر رقم النسخة عند كل نشر جديد.
const VERSION = 'nizam-v2';
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

// ---------- إشعارات الطلبات (Web Push) ----------
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (_) {}
  e.waitUntil((async () => {
    const cs = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    cs.forEach(c => c.postMessage({ type: 'nizam-push', data: d }));
    if (cs.some(c => c.visibilityState === 'visible')) return;      // التطبيق ظاهر: الصفحة بتنبّه بنفسها (صوت + شريط)
    await self.registration.showNotification(d.title || 'Nizam - نظام', {
      body: d.body || '', tag: (d.type || 'n') + '-' + (d.order_id || ''), renotify: true, requireInteraction: true,
      vibrate: [250, 120, 250, 120, 250], icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', dir: 'rtl', lang: 'ar', data: d
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const d = e.notification.data || {};
  e.waitUntil((async () => {
    const cs = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (cs.length) { await cs[0].focus(); cs[0].postMessage({ type: 'nizam-open', data: d }); }
    else await clients.openWindow('./?open=' + encodeURIComponent(d.type || '') + '&t=' + encodeURIComponent(d.table_id || ''));
  })());
});
