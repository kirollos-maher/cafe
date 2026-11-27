// ============================================================
// config.js - إعدادات Supabase (نسخة مؤمّنة)
// مفتاح الـ publishable مصمم يكون عام؛ الحماية الحقيقية في RLS (ملف security.sql)
// ============================================================
const SUPABASE_URL = 'https://bccuzjjnrqnmqwcypucr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_X3pnp718gcVx9-wrisvtHw_44hMVVZ_';

// مفتاح VAPID العام لإشعارات الطلبات (من: npx web-push generate-vapid-keys) — لو فاضي الإشعارات الخارجية مش هتشتغل
window.VAPID_PUBLIC_KEY = 'BEu-7YPT4Dkn55K9lADn2zzCtSYg6lP6kSFrF_06m_QJG6i3XMigdN7y3ut8tAdasITLnkIoJsk-W-y1T6--RSk';

// منع فتح الصفحة داخل iframe (Clickjacking). الأفضل كمان تضيف header: Content-Security-Policy: frame-ancestors 'none' من الاستضافة.
if (window.top !== window.self) {
    document.documentElement.style.display = 'none';
}

// كل جلسة موظف ليها توكن بيتبعت في header، والـ RLS على السيرفر بتقرأه
window.makeClient = function (token) {
    if (window.OfflineSync) { OfflineSync.configure(SUPABASE_URL, SUPABASE_ANON_KEY); OfflineSync.setToken(token); }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: { headers: token ? { 'x-staff-token': token } : {}, fetch: window.OfflineSync ? window.OfflineSync.fetch : undefined }
    });
};

try {
    window.supabaseClient = window.makeClient(null);
} catch (e) {
    window.supabaseClient = null;
}
