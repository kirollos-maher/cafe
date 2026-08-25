// ============================================================
// config.js - إعدادات Supabase
// ============================================================

const SUPABASE_URL = 'https://bccuzjjnrqnmqwcypucr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_X3pnp718gcVx9-wrisvtHw_44hMVVZ_';

// إنشاء العميل وتخزينه في window ليكون متاحاً عالمياً
window.supabaseClient = null;

try {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized successfully');
    console.log('🔗 Supabase URL:', SUPABASE_URL);
} catch (e) {
    console.error('❌ Supabase initialization failed:', e);
}