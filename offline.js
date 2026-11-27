// ============================================================
// offline.js — Nizam: الشغل بدون إنترنت
//  - كل قراءة ناجحة بتتخزّن محلياً وتتعرض لو النت وقع
//  - عمليات التشغيل اليومي (طلب، حالة طلب، دفع، مصروف) بتتسجّل في طابور وتتزامن لوحدها
//  - عمليات الإدارة (منيو، موظفين، إعدادات) محتاجة اتصال
// ============================================================
(function () {
    'use strict';
    const W = typeof window !== 'undefined' ? window : globalThis;
    const MAX_OFFLINE_MS = 72 * 3600 * 1000;      // أقصى مدة يشتغل فيها الدخول بدون نت من آخر دخول أونلاين
    const COOLDOWN_MS = 10000, TIMEOUT_MS = 5000;
    const nowISO = () => new Date().toISOString();
    const r2 = n => Math.round(n * 100) / 100;

    // ---------- IndexedDB ----------
    let dbp = null;
    function db() {
        if (!dbp) dbp = new Promise((res, rej) => {
            const r = indexedDB.open('nizam-offline', 1);
            r.onupgradeneeded = () => ['cache', 'queue', 'failed', 'meta'].forEach(s => r.result.createObjectStore(s));
            r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
        });
        return dbp;
    }
    async function idb(store, mode, fn) {
        const d = await db();
        return new Promise((res, rej) => {
            const tx = d.transaction(store, mode); const req = fn(tx.objectStore(store));
            tx.oncomplete = () => res(req ? req.result : undefined); tx.onerror = tx.onabort = () => rej(tx.error);
        });
    }
    const get = (s, k) => idb(s, 'readonly', st => st.get(k));
    const put = (s, k, v) => idb(s, 'readwrite', st => st.put(v, k));
    const del = (s, k) => idb(s, 'readwrite', st => st.delete(k));
    const all = s => idb(s, 'readonly', st => st.getAll());
    const wipe = s => idb(s, 'readwrite', st => st.clear());

    // ---------- الحالة ----------
    let cfg = { url: '', key: '' }, token = null, ctx = { bizId: null, user: null, fees: { service: 10, vat: 14 } };
    let downUntil = 0, flushing = false, authStale = false, seq = 0;
    let pending = [], failedList = [];
    const menuMap = {}, orderIndex = {};
    const changeCbs = [], syncedCbs = [];
    const isDown = () => Date.now() < downUntil || (typeof navigator !== 'undefined' && navigator.onLine === false);
    const status = () => ({ online: !isDown(), pending: pending.length, failed: failedList.length, authStale, hasToken: !!token });
    function emit() { const s = status(); changeCbs.forEach(f => { try { f(s); } catch (e) {} }); renderBanner(s); }
    async function loadMirror() { try { pending = await all('queue'); failedList = await all('failed'); } catch (e) {} emit(); }
    function markDown() { downUntil = Date.now() + COOLDOWN_MS; emit(); }
    function markUp() { const was = downUntil > 0; downUntil = 0; if (was) { emit(); setTimeout(flush, 0); } }

    // ---------- شبكة ----------
    async function net(url, init) {
        const c = new AbortController(); const t = setTimeout(() => c.abort(), TIMEOUT_MS);
        try { const r = await fetch(url, Object.assign({}, init, { signal: c.signal })); markUp(); return r; }
        catch (e) { markDown(); throw e; } finally { clearTimeout(t); }
    }
    const jres = (st, body) => new Response(body === undefined || body === null ? null : (typeof body === 'string' ? body : JSON.stringify(body)),
        { status: st, headers: { 'Content-Type': 'application/json' } });
    const OFFLINE = () => jres(503, { code: 'OFFLINE', message: 'offline' });

    function parse(url, method) {
        let u; try { u = new URL(url); } catch (e) { return null; }
        const i = u.pathname.indexOf('/rest/v1/'); if (i < 0) return null;
        const rest = u.pathname.slice(i + 9), isRpc = rest.startsWith('rpc/');
        return { u, rest, table: rest.split('?')[0], isRpc, name: isRpc ? rest.slice(4) : '', method };
    }
    const hdr = (init, n) => { try { return new Headers(init.headers || {}).get(n) || ''; } catch (e) { return ''; } };

    // ---------- fetch الرئيسي (بيتحط في supabase-js) ----------
    async function offlineFetch(input, init) {
        init = init || {};
        const url = typeof input === 'string' ? input : input.url;
        const method = (init.method || (typeof input !== 'string' && input.method) || 'GET').toUpperCase();
        const p = parse(url, method);
        if (!p) return fetch(input, init);
        return (method === 'GET' || method === 'HEAD') ? read(url, init, p) : write(url, init, p);
    }

    // ---------- قراءة ----------
    async function read(url, init, p) {
        const key = url + '|' + hdr(init, 'accept');
        let res = null;
        if (token && !isDown()) { try { res = await net(url, init); } catch (e) { res = null; } }
        if (res && res.status < 500) {
            if (!res.ok) return res;
            const text = await res.clone().text();
            const old = await get('cache', key).catch(() => null);
            const emptyList = text.trim() === '[]';
            if (!(emptyList && old && old.text.trim() !== '[]')) {       // ما نمسحش بيانات سليمة بنتيجة فاضية (جلسة منتهية مثلاً)
                put('cache', key, { text, ct: res.headers.get('content-type') || 'application/json' }).catch(() => {});
            }
            return build(p, text, res.status, res.headers.get('content-type'));
        }
        const c = await get('cache', key).catch(() => null);
        if (c) return build(p, c.text, 200, c.ct);
        if (pending.length && (p.table === 'order_items' || p.table === 'expenses')) return build(p, '[]', 200, 'application/json');   // بيانات اتسجّلت أوفلاين ومالهاش نسخة سابقة
        return OFFLINE();
    }
    async function build(p, text, st, ct) {
        let out = text;
        try {
            let data = JSON.parse(text);
            if (Array.isArray(data)) {
                if (p.table === 'menu_items') data.forEach(m => { menuMap[m.id] = m; });
                if (p.table === 'orders' && p.u.searchParams.get('select') === '*') data.forEach(o => { orderIndex[o.id] = o; });
                if (pending.length) { data = overlay(p, data); out = JSON.stringify(data); }
            }
        } catch (e) { /* مش JSON — نرجّعه زي ما هو */ }
        return new Response(out, { status: st, headers: { 'Content-Type': ct || 'application/json' } });
    }

    // ---------- تطبيق العمليات المعلّقة فوق البيانات المخزّنة ----------
    function synthOrder(op) {
        let sub = 0; (op.items || []).forEach(i => { const m = menuMap[i.id]; sub += (m ? Number(m.price) : 0) * (Number(i.quantity) || 0); });
        sub = r2(sub);
        return { id: op.id, business_id: ctx.bizId, table_id: op.table, waiter_id: (ctx.user && ctx.user.id) || null, order_type: 'dine_in',
            status: 'pending', subtotal: sub, total: sub, notes: 'offline', created_at: op.at || nowISO(), _offline: true };
    }
    const orderRow = id => { const c = pending.find(o => o.type === 'create_order' && o.id === id); return c ? synthOrder(c) : (orderIndex[id] || null); };
    const payTotal = sub => r2(Number(sub || 0) * (1 + ctx.fees.service / 100) * (1 + ctx.fees.vat / 100));

    function overlay(p, rows) {
        const q = p.u.searchParams, t = p.table;
        if (t === 'orders' && q.get('select') === '*' && !q.get('id')) {
            pending.filter(o => o.type === 'create_order').forEach(o => { if (!rows.some(r => r.id === o.id)) rows.unshift(synthOrder(o)); });
            pending.forEach(o => {
                const row = rows.find(r => r.id === (o.id || o.order));
                if (!row) return;
                if (o.type === 'status') row.status = o.status;
                if (o.type === 'pay') { row.status = 'paid'; row.total = o.total; }
            });
        } else if (t === 'orders' && q.get('select') === 'total' && q.get('status') === 'eq.paid') {
            pending.filter(o => o.type === 'pay').forEach(o => rows.push({ total: o.total }));
        } else if (t === 'tables') {
            pending.forEach(o => {
                if (o.type === 'create_order') { const r = rows.find(x => x.id === o.table); if (r) r.status = 'occupied'; }
                if (o.type === 'pay' && o.tableId) { const r = rows.find(x => x.id === o.tableId); if (r) r.status = 'available'; }
                if (o.type === 'table') { const r = rows.find(x => x.id === o.id); if (r) r.status = o.status; }
            });
        } else if (t === 'order_items') {
            const oid = (q.get('order_id') || '').replace('eq.', '');
            const op = pending.find(o => o.type === 'create_order' && o.id === oid);
            if (op && rows.length === 0) (op.items || []).forEach((i, n) => {
                const m = menuMap[i.id] || { name: '—', price: 0 };
                rows.push({ id: 'local-' + oid + '-' + n, order_id: oid, menu_item_id: i.id, quantity: i.quantity, unit_price: m.price,
                    total: r2(Number(m.price) * Number(i.quantity)), notes: i.note || null, status: 'pending', menu_items: m });
            });
        } else if (t === 'expenses') {
            const sid = (q.get('shift_id') || '').replace('eq.', '');
            pending.filter(o => o.type === 'expense' && o.body.shift_id === sid).reverse()
                .forEach(o => rows.unshift({ description: o.body.description, amount: o.body.amount, created_at: o.at }));
        }
        return rows;
    }

    // ---------- كتابة ----------
    function describe(p, body) {
        const id = p.u.searchParams.get('id'), eq = id && id.startsWith('eq.') ? id.slice(3) : null;
        if (p.isRpc) {
            if (p.name === 'staff_create_order' && body) return { type: 'create_order', id: body.p_id, table: body.p_table, items: body.p_items, at: body.p_at };
            if (p.name === 'confirm_payment' && body) {
                const row = orderRow(body.p_order);
                return { type: 'pay', order: body.p_order, method: body.p_method, tableId: row && row.table_id, total: payTotal(row && row.subtotal) };
            }
            return null;
        }
        if (!body || Array.isArray(body)) return null;
        if (p.table === 'orders' && p.method === 'PATCH' && eq && Object.keys(body).join() === 'status' && body.status !== 'paid') return { type: 'status', id: eq, status: body.status };
        if (p.table === 'tables' && p.method === 'PATCH' && eq && Object.keys(body).join() === 'status') return { type: 'table', id: eq, status: body.status };
        if (p.table === 'expenses' && p.method === 'POST') return { type: 'expense', body, at: nowISO() };
        return null;
    }
    async function write(url, init, p) {
        let body = null; try { body = init.body ? JSON.parse(init.body) : null; } catch (e) {}
        if (p.isRpc && p.name === 'device_status' && body) {                      // حالة الجهاز: نخزّنها عشان فتح التطبيق بدون نت
            const k = 'ds:' + body.p_code + ':' + body.p_device;
            if (!isDown()) { try { const r = await net(url, init); if (r.ok) put('meta', k, await r.clone().text()).catch(() => {}); return r; } catch (e) {} }
            const c = await get('meta', k).catch(() => null); return c ? jres(200, c) : OFFLINE();
        }
        if (p.isRpc && p.name === 'staff_create_order' && body) {
            body.p_id = body.p_id || crypto.randomUUID(); body.p_at = body.p_at || nowISO();
            init = Object.assign({}, init, { body: JSON.stringify(body) });
        }
        if (!p.isRpc && p.table === 'expenses' && p.method === 'POST' && body && !Array.isArray(body) && !body.id) {
            body.id = crypto.randomUUID(); init = Object.assign({}, init, { body: JSON.stringify(body) });
        }
        const op = describe(p, body);
        if (!op) {                                                                 // عملية محتاجة اتصال
            if (isDown()) return OFFLINE();
            try { return await net(url, init); } catch (e) { return OFFLINE(); }
        }
        if (!isDown() && token && pending.length === 0) {                          // أونلاين وطابور فاضي: نبعت علطول
            try { return await net(url, init); } catch (e) { /* الشبكة وقعت — نسجّلها */ }
        }
        await enqueue(op);
        if (!isDown() && token) setTimeout(flush, 0);
        return op.type === 'create_order' ? jres(200, JSON.stringify(op.id))
            : op.type === 'pay' ? jres(200, String(op.total || 0)) : new Response(null, { status: op.type === 'expense' ? 201 : 204 });
    }
    async function enqueue(op) {
        if (op.type === 'status' || op.type === 'table') {                         // آخر حالة بس هي المهمة
            for (const o of pending.filter(x => x.type === op.type && x.id === op.id)) { await del('queue', o.k); }
            pending = pending.filter(x => !(x.type === op.type && x.id === op.id));
        }
        op.k = String(Date.now()).padStart(15, '0') + '-' + String(++seq).padStart(6, '0');
        await put('queue', op.k, op); pending.push(op); emit();
    }

    // ---------- المزامنة ----------
    function reqFor(op) {
        const base = cfg.url + '/rest/v1/', json = { 'Content-Type': 'application/json' };
        if (op.type === 'create_order') return [base + 'rpc/staff_create_order', 'POST', { p_table: op.table, p_items: op.items, p_id: op.id, p_at: op.at }];
        if (op.type === 'pay') return [base + 'rpc/confirm_payment', 'POST', { p_order: op.order, p_method: op.method }];
        if (op.type === 'status') return [base + 'orders?id=eq.' + encodeURIComponent(op.id), 'PATCH', { status: op.status }];
        if (op.type === 'table') return [base + 'tables?id=eq.' + encodeURIComponent(op.id), 'PATCH', { status: op.status }];
        if (op.type === 'expense') return [base + 'expenses', 'POST', op.body];
        return null;
    }
    const authHeaders = () => ({ apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json', 'x-staff-token': token });
    async function sessionValid() {
        try {
            const r = await net(cfg.url + '/rest/v1/businesses?select=id', { method: 'GET', headers: authHeaders() });
            if (r.status >= 500) return null;
            const rows = await r.json(); return Array.isArray(rows) && rows.length > 0;
        } catch (e) { return null; }
    }
    async function send(op) {
        const rq = reqFor(op); if (!rq) return { fail: 'unknown' };
        let r; try { r = await net(rq[0], { method: rq[1], headers: Object.assign(authHeaders(), { Prefer: 'return=minimal' }), body: JSON.stringify(rq[2]) }); }
        catch (e) { return 'retry'; }
        if (r.ok) return 'ok';
        let b = {}; try { b = await r.json(); } catch (e) {}
        const msg = String(b.message || '');
        if (r.status >= 500) return 'retry';
        if (r.status === 401 || msg.includes('forbidden')) return 'auth';
        if (op.type === 'expense' && (r.status === 409 || b.code === '23505')) return 'ok';
        return { fail: msg || ('HTTP ' + r.status) };
    }
    async function flush() {
        if (flushing || !pending.length || isDown()) return;
        if (!token) { authStale = true; emit(); return; }
        flushing = true; let changed = false;
        try {
            const v = await sessionValid();
            if (v === null) return;
            if (v === false) { authStale = true; emit(); return; }
            authStale = false;
            while (pending.length) {
                const op = pending[0], r = await send(op);
                if (r === 'retry') break;
                if (r === 'auth') { authStale = true; break; }
                if (r !== 'ok') { const f = Object.assign({}, op, { reason: r.fail, failedAt: nowISO() }); await put('failed', op.k, f); failedList.push(f); }
                await del('queue', op.k); pending.shift(); changed = true; emit();
            }
        } finally { flushing = false; emit(); }
        if (changed) syncedCbs.forEach(f => { try { f(); } catch (e) {} });
    }

    // ---------- دخول بدون نت ----------
    const b64 = u8 => btoa(String.fromCharCode.apply(null, u8)), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
    async function pbkdf2(pin, salt) {
        const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
        return b64(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 300000, hash: 'SHA-256' }, k, 256)));
    }
    async function saveCreds(biz, key, pin, user) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        await put('meta', 'cred:' + biz + ':' + key, { salt: b64(salt), hash: await pbkdf2(pin, salt), user, savedAt: Date.now() });
    }
    async function offlineLogin(biz, key, pin) {
        const lk = 'lock:' + biz, lock = (await get('meta', lk)) || { fails: 0, until: 0 };
        if (lock.until > Date.now()) return { error: 'locked' };
        const c = await get('meta', 'cred:' + biz + ':' + key);
        if (!c || Date.now() - c.savedAt > MAX_OFFLINE_MS) return { error: 'no_cred' };
        if ((await pbkdf2(pin, unb64(c.salt))) !== c.hash) {
            lock.fails++; if (lock.fails >= 5) { lock.until = Date.now() + 15 * 60000; lock.fails = 0; }
            await put('meta', lk, lock); return { error: 'invalid' };
        }
        await put('meta', lk, { fails: 0, until: 0 }); return { ok: true, user: c.user };
    }

    // ---------- شريط الحالة + قائمة العمليات الفاشلة ----------
    let bannerEl = null;
    const ui = typeof document !== 'undefined' && document.getElementById;
    function renderBanner(s) {
        if (!ui) return;
        const host = document.getElementById('mainApp'); if (!host) return;
        if (!bannerEl) {
            bannerEl = document.createElement('div'); bannerEl.className = 'sync-banner'; host.insertBefore(bannerEl, host.firstChild);
            bannerEl.addEventListener('click', e => {
                if (e.target.dataset.act === 'login') W.dispatchEvent(new Event('nizam-need-login'));
                if (e.target.dataset.act === 'failed') showFailed();
            });
        }
        let text = '', cls = '', btn = '';
        if (s.failed) { text = s.failed + ' عملية لم تتم'; cls = 'err'; btn = ['failed', 'مراجعة']; }
        else if (s.authStale && s.online && s.pending) { text = 'سجّل دخول بالـ PIN لإكمال المزامنة (' + s.pending + ')'; cls = 'info'; btn = ['login', 'تسجيل الدخول']; }
        else if (!s.online) { text = 'غير متصل — الشغل بيتسجّل على الجهاز' + (s.pending ? ' (' + s.pending + ' في الانتظار)' : ''); }
        else if (s.pending) { text = 'جاري المزامنة (' + s.pending + ')'; cls = 'info'; }
        bannerEl.className = 'sync-banner' + (text ? ' show ' + cls : '');
        bannerEl.textContent = text;
        if (btn) { const b = document.createElement('button'); b.dataset.act = btn[0]; b.textContent = btn[1]; bannerEl.appendChild(b); }
        document.documentElement.style.setProperty('--sync-h', text ? '30px' : '0px');
    }
    const REASONS = { table_busy: 'الطاولة اتشغلت من جهاز تاني', bad_item: 'صنف مش متاح', bad_qty: 'كمية غير صحيحة', bad_order: 'الطلب مش موجود أو اتقفل', forbidden: 'مفيش صلاحية' };
    function describeOp(o) {
        const tb = typeof tables !== 'undefined' ? tables : [];
        const n = id => { const t = tb.find(x => x.id === id); return t ? ' — طاولة ' + t.number : ''; };
        if (o.type === 'create_order') return 'طلب جديد' + n(o.table) + ' (' + (o.items || []).length + ' صنف)';
        if (o.type === 'pay') return 'دفع طلب' + n(o.tableId);
        if (o.type === 'expense') return 'مصروف: ' + String(o.body.description || '') + ' (' + o.body.amount + ')';
        return 'تحديث حالة';
    }
    function showFailed() {
        if (!ui) return;
        let ov = document.getElementById('syncPanel'); if (ov) ov.remove();
        ov = document.createElement('div'); ov.className = 'overlay show'; ov.id = 'syncPanel';
        const sh = document.createElement('div'); sh.className = 'sheet'; ov.appendChild(sh);
        const title = document.createElement('div'); title.className = 'sheet-title'; title.textContent = 'عمليات لم تتم'; sh.appendChild(title);
        failedList.forEach(o => {
            const row = document.createElement('div'); row.style.cssText = 'padding:10px 0;border-bottom:1px solid var(--border)';
            const t = document.createElement('div'); t.textContent = describeOp(o); t.style.fontWeight = '700';
            const r = document.createElement('div'); r.textContent = REASONS[o.reason] || o.reason; r.style.cssText = 'font-size:12px;color:var(--text-secondary);margin:2px 0 8px';
            const a = document.createElement('button'); a.className = 'btn btn-outline'; a.textContent = 'حذف'; a.onclick = async () => { await del('failed', o.k); failedList = failedList.filter(x => x.k !== o.k); emit(); showFailed(); };
            row.append(t, r, a); sh.appendChild(row);
        });
        const close = document.createElement('button'); close.className = 'btn btn-outline btn-block'; close.style.marginTop = '12px'; close.textContent = 'إغلاق'; close.onclick = () => ov.remove();
        sh.appendChild(close); document.body.appendChild(ov);
    }

    // ---------- واجهة برمجية ----------
    W.OfflineSync = {
        fetch: offlineFetch,
        configure(url, key) { cfg = { url, key }; },
        setToken(t) { token = t || null; if (token) { authStale = false; setTimeout(flush, 0); } emit(); },
        setContext(c) { ctx = Object.assign({}, ctx, c, { fees: Object.assign({}, ctx.fees, c && c.fees) }); },
        onChange(f) { changeCbs.push(f); }, onSynced(f) { syncedCbs.push(f); },
        flush, status, saveCreds, offlineLogin,
        isOffline: isDown,
        async clearAll() { for (const s of ['cache', 'queue', 'failed', 'meta']) await wipe(s); pending = []; failedList = []; emit(); }
    };
    if (typeof indexedDB !== 'undefined') loadMirror();
    if (W.addEventListener) {
        W.addEventListener('online', () => { downUntil = 0; emit(); flush(); });
        W.addEventListener('offline', () => emit());
    }
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof location !== 'undefined' && /^https?:$/.test(location.protocol)) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
})();
