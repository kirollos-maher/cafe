// ============================================================
// app.js - النسخة الكاملة الآمنة (Security Hardened)
// ⚠️ الأمان الحقيقي في Supabase RLS + Edge Functions + Views
// ============================================================

'use strict';

const supabaseClient = window.supabaseClient;

if (!supabaseClient) {
    console.error('❌ supabaseClient is not defined! Check config.js loading order.');
    document.addEventListener('DOMContentLoaded', function() {
        const errEl = document.getElementById('setupError');
        if (errEl) errEl.textContent = '⚠️ خطأ في تحميل الاتصال بقاعدة البيانات. تأكد من اتصال الإنترنت.';
    });
} else {
    console.log('✅ supabaseClient is ready in app.js');
}

// ============================================================
// CONSTANTS & GUARDS
// ============================================================
const MAX_NOTE_LENGTH = 200;
const MAX_PIN_LENGTH = 4;
const MAX_QUANTITY_PER_ITEM = 50;
const MAX_ITEMS_PER_ORDER = 100;
const MAX_LOGO_SIZE = 200 * 1024; // 200KB
const MAX_EXPENSE_AMOUNT = 10000000;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const ALLOWED_STATUSES = ['pending', 'preparing', 'ready', 'paid', 'cancelled'];
const ALLOWED_TABLE_STATUSES = ['available', 'occupied', 'reserved', 'ready_to_serve'];

// ============================================================
// TRANSLATIONS - النسخة الكاملة
// ============================================================
let currentLang = 'ar';

const translations = {
    ar: {
        'platepro': '✦ PLATE PRO ✦',
        'welcome': 'مرحباً بك',
        'business_code': 'كود النشاط التجاري',
        'continue': 'متابعة',
        'back': 'رجوع',
        'save': 'حفظ',
        'cancel': 'إلغاء',
        'close': 'إغلاق',
        'delete': 'حذف',
        'edit': 'تعديل',
        'add': 'إضافة',
        'today_performance': '📊 أداء اليوم',
        'today_revenue': '💰 إيراد اليوم',
        'active_orders': '📋 الطلبات النشطة',
        'occupied_tables': '🪑 طاولات مشغولة',
        'available_tables': '🟢 طاولات متاحة',
        'quick_actions': '⚡ إجراءات سريعة',
        'add_expense': 'إضافة مصروف',
        'close_shift': 'إقفال الشيفت',
        'open_new_shift': 'فتح شيفت جديد',
        'scan_order': '📱 امسح واطلب من مكانك',
        'all': '🍽️ الكل',
        'cart': '🛒 سلة الطلبات',
        'empty_cart': 'السلة فارغة',
        'subtotal': 'المجموع',
        'service_fee': 'رسوم الخدمة',
        'vat': 'ضريبة القيمة المضافة',
        'total': 'الإجمالي',
        'confirm_order': 'تأكيد الطلب',
        'pending': '⏳ قيد الانتظار',
        'preparing': '🔪 قيد التحضير',
        'ready': '✅ جاهز للتسليم',
        'paid': '💳 مدفوع',
        'cancelled': '❌ ملغي',
        'order': 'طلب',
        'table': 'طاولة',
        'print_receipt': '🖨️ طباعة الوصل',
        'print': 'طباعة',
        'payment': '💳 الدفع',
        'select_payment': 'اختر طريقة الدفع',
        'available': '🟢 متاحة',
        'occupied': '🟡 مشغولة',
        'reserved': '🔵 محجوزة',
        'active': '✅ نشط',
        'inactive': '⛔ موقف',
        'waiter': 'نادل',
        'chef': 'طباخ',
        'cashier': 'كاشير',
        'admin': 'أدمن',
        'settings': '⚙️ الإعدادات',
        'appearance': '🎨 المظهر',
        'dark': '🌙 داكن',
        'light': '☀️ فاتح',
        'logo': '🖼️ الشعار',
        'fees': '💰 الرسوم والضرائب',
        'service_fee_label': 'رسوم الخدمة',
        'vat_label': 'ضريبة القيمة المضافة (VAT)',
        'payment_methods': '💳 طرق الدفع',
        'employees': '👥 الموظفين',
        'switch_business': '🔄 تبديل النشاط',
        'edit_fees': 'تعديل الرسوم',
        'edit_logo': 'تعديل الشعار',
        'no_logo': 'لا يوجد شعار',
        'remove_logo': 'حذف الشعار',
        'save_logo': 'حفظ الشعار',
        'upload_logo': 'اختر صورة الشعار',
        'menu': '🍽️ المنيو',
        'manage_menu': '⚙️ إدارة المنيو',
        'add_item': 'إضافة صنف',
        'add_category': 'إضافة تصنيف',
        'item_name': 'اسم الصنف',
        'item_price': 'السعر',
        'item_desc': 'الوصف',
        'item_image': 'صورة الصنف',
        'category': 'التصنيف',
        'no_items': 'مفيش أصناف',
        'no_categories': 'مفيش تصنيفات',
        'no_employees': 'مفيش موظفين',
        'qr_code': '📱 طلب من العميل',
        'qr_label': 'QR Code الطاولات',
        'qr_sub': 'امسح للطلب من المنيو مباشرة',
        'show_qr': 'عرض QR',
        'download_qr': 'تحميل QR',
        'scan_qr': 'امسح الكود لفتح منيو العميل',
        'expense_desc': 'الوصف',
        'expense_amount': 'المبلغ',
        'add_expense_title': 'إضافة مصروف',
        'close_shift_title': 'تأكيد إقفال الشيفت',
        'shift_revenue': 'الإيراد',
        'shift_expenses': 'المصروفات',
        'today_expenses': '💸 مصروفات اليوم',
        'no_expenses': 'لا يوجد مصروفات في هذا الشيفت',
        'shift_profit': 'الصافي',
        'confirm_close': 'تأكيد الإقفال',
        'no_open_shift': 'لا يوجد شيفت مفتوح',
        'permissions': '🔐 الصلاحيات',
        'perm_dashboard': '👀 الرئيسية',
        'perm_tables': '🪑 الطاولات',
        'perm_orders': '📋 الطلبات',
        'perm_menu': '🍽️ المنيو',
        'perm_settings': '⚙️ الإعدادات',
        'perm_create_orders': '🛒 إنشاء طلبات',
        'perm_add_expense': '💰 إضافة مصروف',
        'perm_close_shift': '🔒 إقفال الشيفت',
        'perm_print_receipt': '🧾 طباعة الفواتير',
        'perm_manage_menu': '📝 إدارة المنيو',
        'perm_view_revenue': '💰 مشاهدة الإيراد',
        'perm_view_expenses': '📊 مشاهدة المصروفات',
        'employee_name': 'الاسم',
        'employee_pin': 'PIN (4 أرقام)',
        'employee_role': 'الدور',
        'add_employee': 'إضافة موظف',
        'edit_employee': 'تعديل موظف',
        'payment_method_name': 'اسم طريقة الدفع',
        'payment_method_icon': 'الأيقونة',
        'add_payment_method': 'إضافة طريقة دفع',
        'edit_payment_method': 'تعديل طريقة دفع',
        'cash': 'كاش',
        'card': 'بطاقة',
        'wallet': 'محفظة',
        'mobile_wallet': 'محفظة إلكترونية',
        'bank_transfer': 'تحويل بنكي',
        'category_name': 'اسم التصنيف',
        'category_icon': 'الأيقونة',
        'add_category_title': 'إضافة تصنيف',
        'order_created': '✅ تم إنشاء الطلب بنجاح!',
        'order_updated': '✅ تم تحديث حالة الطلب',
        'payment_success': '✅ تم الدفع بنجاح!',
        'payment_failed': '❌ فشل الدفع',
        'expense_added': '✅ تم تسجيل المصروف',
        'shift_closed': '✅ تم إقفال الشيفت',
        'shift_close_failed': '❌ فشل إقفال الشيفت',
        'item_added': '✅ تم إضافة الصنف',
        'item_updated': '✅ تم تحديث الصنف',
        'item_deleted': '✅ تم حذف الصنف',
        'category_added': '✅ تم إضافة التصنيف',
        'payment_method_added': '✅ تم إضافة طريقة الدفع',
        'employee_added': '✅ تم إضافة الموظف',
        'employee_updated': '✅ تم تحديث الموظف',
        'employee_deleted': '✅ تم حذف الموظف',
        'logo_saved': '✅ تم حفظ الشعار',
        'logo_deleted': '✅ تم حذف الشعار',
        'fees_saved': '✅ تم حفظ الإعدادات',
        'error_general': '⚠️ حدث خطأ، حاول تاني',
        'error_connection': '⚠️ حصل خطأ في الاتصال',
        'error_invalid_code': '⚠️ كود النشاط غير صحيح',
        'error_invalid_pin': '⚠️ PIN غير صحيح',
        'error_no_items': '⚠️ أضف صنف واحد على الأقل',
        'error_no_tables': '⚠️ مفيش طاولات متاحة',
        'error_permission': '⛔ ليس لديك صلاحية',
        'error_upload': '⚠️ فشل رفع الصورة',
        'recent_orders': '📜 آخر الطلبات',
        'order_details': 'تفاصيل الطلب',
        'tables': '🪑 الطاولات',
        'kitchen': '👨‍🍳 الأوردرات',
        'kitchen_orders': '📋 الأوردرات النشطة',
        'no_kitchen_orders': 'مفيش أوردرات نشطة',
        'items': 'أصناف',
        'more': 'أكثر',
        'ready_to_serve': '🛎️ جاهز للتسليم',
        'dashboard': 'الرئيسية',
        'activate': 'تفعيل',
        'qr_generated': '✅ تم توليد QR Code',
        'start_preparing': '🔪 بدء التحضير',
        'ready_for_delivery': '✅ جاهز للتسليم',
        'deliver': '🚚 تسليم',
        'delivered': '✅ تم التوصيل',
        'chef_view': '👨‍🍳 عرض المطبخ',
        'persons': 'أشخاص',
        'manage_tables': '🪑 إدارة الطاولات',
        'add_table': 'إضافة طاولة',
        'edit_table': 'تعديل طاولة',
        'delete_table': 'حذف طاولة',
        'no_tables': 'مفيش طاولات',
        'table_added': '✅ تم إضافة الطاولة',
        'table_updated': '✅ تم تحديث الطاولة',
        'table_deleted': '✅ تم حذف الطاولة',
        'delete_table_confirm': 'متأكد من حذف الطاولة؟',
        'shift_history': '📋 سجل الشيفتات',
        'no_shift_history': 'مفيش شيفتات مقفولة',
        'preparing_started': '🔪 جاري التحضير...',
        'order_ready_notification': '✅ الطلب جاهز! إشعار للويتر',
        'order_delivered': '✅ تم توصيل الطلب للعميل',
        'table_number': 'رقم الطاولة',
        'capacity': 'السعة (أشخاص)',
        'status': 'الحالة',
        'device_activated': '✅ تم تفعيل الجهاز بنجاح',
        'item_added_to_order': '✅ تم إضافة {name}',
        'item_note_placeholder': 'ملاحظة (مثال: من غير سكر)',
        'loading': 'جاري التحميل...',
        'default_item': 'صنف',
        'orders': '📋 الطلبات',
        'generate': 'توليد',
        'shift_open': '✅ شيفت مفتوح',
        'shift_closed': '🔴 شيفت مقفول',
        'menu_categories': '📂 التصنيفات',
        'rate_limited': '⚠️ محاولات كثيرة، حاول بعد دقيقة',
        'invalid_input': '⚠️ بيانات غير صالحة',
        'invalid_amount': '⚠️ مبلغ غير صالح',
        'invalid_quantity': '⚠️ كمية غير صالحة',
        'too_many_items': '⚠️ عدد الأصناف كبير جداً',
        'image_too_large': '⚠️ حجم الصورة كبير جداً (الحد 200KB)',
        'image_type_invalid': '⚠️ نوع الصورة غير مسموح',
        'storage_full': '⚠️ مساحة التخزين ممتلئة',
        'table_unavailable': '⚠️ الطاولة غير متاحة'
    },
    en: {
        'platepro': '✦ PLATE PRO ✦',
        'welcome': 'Welcome',
        'business_code': 'Business Code',
        'continue': 'Continue',
        'back': 'Back',
        'save': 'Save',
        'cancel': 'Cancel',
        'close': 'Close',
        'delete': 'Delete',
        'edit': 'Edit',
        'add': 'Add',
        'today_performance': '📊 Today\'s Performance',
        'today_revenue': '💰 Today\'s Revenue',
        'active_orders': '📋 Active Orders',
        'occupied_tables': '🪑 Occupied Tables',
        'available_tables': '🟢 Available Tables',
        'quick_actions': '⚡ Quick Actions',
        'add_expense': 'Add Expense',
        'close_shift': 'Close Shift',
        'open_new_shift': 'Open New Shift',
        'scan_order': '📱 Scan & Order from your table',
        'all': '🍽️ All',
        'cart': '🛒 Cart',
        'empty_cart': 'Cart is empty',
        'subtotal': 'Subtotal',
        'service_fee': 'Service Fee',
        'vat': 'VAT',
        'total': 'Total',
        'confirm_order': 'Confirm Order',
        'pending': '⏳ Pending',
        'preparing': '🔪 Preparing',
        'ready': '✅ Ready for Delivery',
        'paid': '💳 Paid',
        'cancelled': '❌ Cancelled',
        'order': 'Order',
        'table': 'Table',
        'print_receipt': '🖨️ Print Receipt',
        'print': 'Print',
        'payment': '💳 Payment',
        'select_payment': 'Select Payment Method',
        'available': '🟢 Available',
        'occupied': '🟡 Occupied',
        'reserved': '🔵 Reserved',
        'active': '✅ Active',
        'inactive': '⛔ Inactive',
        'waiter': 'Waiter',
        'chef': 'Chef',
        'cashier': 'Cashier',
        'admin': 'Admin',
        'settings': '⚙️ Settings',
        'appearance': '🎨 Appearance',
        'dark': '🌙 Dark',
        'light': '☀️ Light',
        'logo': '🖼️ Logo',
        'fees': '💰 Fees & Taxes',
        'service_fee_label': 'Service Fee',
        'vat_label': 'VAT',
        'payment_methods': '💳 Payment Methods',
        'employees': '👥 Employees',
        'switch_business': '🔄 Switch Business',
        'edit_fees': 'Edit Fees',
        'edit_logo': 'Edit Logo',
        'no_logo': 'No Logo',
        'remove_logo': 'Remove Logo',
        'save_logo': 'Save Logo',
        'upload_logo': 'Upload Logo Image',
        'menu': '🍽️ Menu',
        'manage_menu': '⚙️ Manage Menu',
        'add_item': 'Add Item',
        'add_category': 'Add Category',
        'item_name': 'Item Name',
        'item_price': 'Price',
        'item_desc': 'Description',
        'item_image': 'Item Image',
        'category': 'Category',
        'no_items': 'No items',
        'no_categories': 'No categories',
        'no_employees': 'No employees',
        'qr_code': '📱 Customer Order',
        'qr_label': 'Tables QR Code',
        'qr_sub': 'Scan to order directly from menu',
        'show_qr': 'Show QR',
        'download_qr': 'Download QR',
        'scan_qr': 'Scan code to open customer menu',
        'expense_desc': 'Description',
        'expense_amount': 'Amount',
        'add_expense_title': 'Add Expense',
        'close_shift_title': 'Confirm Close Shift',
        'shift_revenue': 'Revenue',
        'shift_expenses': 'Expenses',
        'today_expenses': '💸 Today\'s Expenses',
        'no_expenses': 'No expenses recorded this shift',
        'shift_profit': 'Net Profit',
        'confirm_close': 'Confirm Close',
        'no_open_shift': 'No open shift',
        'permissions': '🔐 Permissions',
        'perm_dashboard': '👀 Dashboard',
        'perm_tables': '🪑 Tables',
        'perm_orders': '📋 Orders',
        'perm_menu': '🍽️ Menu',
        'perm_settings': '⚙️ Settings',
        'perm_create_orders': '🛒 Create Orders',
        'perm_add_expense': '💰 Add Expense',
        'perm_close_shift': '🔒 Close Shift',
        'perm_print_receipt': '🧾 Print Receipt',
        'perm_manage_menu': '📝 Manage Menu',
        'perm_view_revenue': '💰 View Revenue',
        'perm_view_expenses': '📊 View Expenses',
        'employee_name': 'Name',
        'employee_pin': 'PIN (4 digits)',
        'employee_role': 'Role',
        'add_employee': 'Add Employee',
        'edit_employee': 'Edit Employee',
        'payment_method_name': 'Payment Method Name',
        'payment_method_icon': 'Icon',
        'add_payment_method': 'Add Payment Method',
        'edit_payment_method': 'Edit Payment Method',
        'cash': 'Cash',
        'card': 'Card',
        'wallet': 'Wallet',
        'mobile_wallet': 'Mobile Wallet',
        'bank_transfer': 'Bank Transfer',
        'category_name': 'Category Name',
        'category_icon': 'Icon',
        'add_category_title': 'Add Category',
        'order_created': '✅ Order created successfully!',
        'order_updated': '✅ Order status updated',
        'payment_success': '✅ Payment successful!',
        'payment_failed': '❌ Payment failed',
        'expense_added': '✅ Expense recorded',
        'shift_closed': '✅ Shift closed',
        'shift_close_failed': '❌ Failed to close shift',
        'item_added': '✅ Item added',
        'item_updated': '✅ Item updated',
        'item_deleted': '✅ Item deleted',
        'category_added': '✅ Category added',
        'payment_method_added': '✅ Payment method added',
        'employee_added': '✅ Employee added',
        'employee_updated': '✅ Employee updated',
        'employee_deleted': '✅ Employee deleted',
        'logo_saved': '✅ Logo saved',
        'logo_deleted': '✅ Logo deleted',
        'fees_saved': '✅ Settings saved',
        'error_general': '⚠️ An error occurred, please try again',
        'error_connection': '⚠️ Connection error',
        'error_invalid_code': '⚠️ Invalid business code',
        'error_invalid_pin': '⚠️ Incorrect PIN',
        'error_no_items': '⚠️ Add at least one item',
        'error_no_tables': '⚠️ No tables available',
        'error_permission': '⛔ You don\'t have permission',
        'error_upload': '⚠️ Image upload failed',
        'recent_orders': '📜 Recent Orders',
        'order_details': 'Order Details',
        'tables': '🪑 Tables',
        'kitchen': '👨‍🍳 Orders',
        'kitchen_orders': '📋 Active Orders',
        'no_kitchen_orders': 'No active orders',
        'items': 'items',
        'more': 'more',
        'ready_to_serve': '🛎️ Ready to Serve',
        'dashboard': 'Dashboard',
        'activate': 'Activate',
        'qr_generated': '✅ QR Code generated',
        'start_preparing': '🔪 Start Preparing',
        'ready_for_delivery': '✅ Ready for Delivery',
        'deliver': '🚚 Deliver',
        'delivered': '✅ Delivered',
        'chef_view': '👨‍🍳 Kitchen View',
        'persons': 'persons',
        'manage_tables': '🪑 Manage Tables',
        'add_table': 'Add Table',
        'edit_table': 'Edit Table',
        'delete_table': 'Delete Table',
        'no_tables': 'No tables',
        'table_added': '✅ Table added',
        'table_updated': '✅ Table updated',
        'table_deleted': '✅ Table deleted',
        'delete_table_confirm': 'Delete this table?',
        'shift_history': '📋 Shift History',
        'no_shift_history': 'No closed shifts',
        'preparing_started': '🔪 Preparing...',
        'order_ready_notification': '✅ Order ready! Notifying waiter',
        'order_delivered': '✅ Order delivered to customer',
        'table_number': 'Table Number',
        'capacity': 'Capacity (persons)',
        'status': 'Status',
        'device_activated': '✅ Device activated successfully',
        'item_added_to_order': '✅ {name} added',
        'item_note_placeholder': 'Note (e.g. no sugar)',
        'loading': 'Loading...',
        'default_item': 'Item',
        'orders': '📋 Orders',
        'generate': 'Generate',
        'shift_open': '✅ Shift Open',
        'shift_closed': '🔴 Shift Closed',
        'menu_categories': '📂 Categories',
        'rate_limited': '⚠️ Too many attempts, try again later',
        'invalid_input': '⚠️ Invalid input',
        'invalid_amount': '⚠️ Invalid amount',
        'invalid_quantity': '⚠️ Invalid quantity',
        'too_many_items': '⚠️ Too many items',
        'image_too_large': '⚠️ Image too large (max 200KB)',
        'image_type_invalid': '⚠️ Image type not allowed',
        'storage_full': '⚠️ Storage is full',
        'table_unavailable': '⚠️ Table is not available'
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    const langLabel = document.getElementById('langToggleLabel');
    if (langLabel) langLabel.textContent = currentLang === 'ar' ? 'English' : 'العربية';
    applyTranslations();
}

function t(key, replace = null) {
    let text = translations[currentLang][key] || key;
    if (replace) {
        for (const [k, v] of Object.entries(replace)) {
            text = text.replace(`{${k}}`, v);
        }
    }
    return text;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key) {
            const translation = t(key);
            if (translation && translation !== key) {
                el.textContent = translation;
            }
        }
    });
    renderDashboard();
    renderTables();
    renderKitchenOrders();
    renderMenuView();
    renderSettings();
    updateShiftIndicator();
}

// ============================================================
// 🛡️ SECURE UTILITIES
// ============================================================
function safeJsonParse(str, fallback = null) {
    try { return JSON.parse(str); } catch { return fallback; }
}

function sanitizeNote(raw) {
    if (raw == null) return '';
    return String(raw).trim().slice(0, MAX_NOTE_LENGTH);
}

function sanitizePin(raw) {
    if (raw == null) return '';
    const s = String(raw).trim();
    return /^\d{4}$/.test(s) ? s : '';
}

function sanitizeBusinessCode(raw) {
    if (raw == null) return '';
    return String(raw).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 20);
}

function sanitizeName(raw) {
    if (raw == null) return '';
    return String(raw).trim().replace(/[<>"'`]/g, '').slice(0, 80);
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValidUuid(id) {
    return typeof id === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function money(n) {
    const v = Number(n);
    if (!isFinite(v)) return '0';
    return v.toLocaleString('ar-EG', { maximumFractionDigits: 2 });
}

function assertFiniteNonNegative(v, name) {
    const n = Number(v);
    if (!isFinite(n) || n < 0) throw new Error(`Invalid ${name}`);
    return n;
}

// ============================================================
// 🛡️ SESSION (لبيانات حساسة في الجلسة)
// ============================================================
const Session = {
    set(key, value) {
        try { sessionStorage.setItem('pp_' + key, JSON.stringify(value)); } catch {}
    },
    get(key) {
        try { return safeJsonParse(sessionStorage.getItem('pp_' + key)); } catch { return null; }
    },
    clear() {
        try {
            Object.keys(sessionStorage).forEach(k => {
                if (k.startsWith('pp_')) sessionStorage.removeItem(k);
            });
        } catch {}
    }
};

// ============================================================
// 🛡️ RATE LIMITER (client-side - الحقيقي في السيرفر)
// ============================================================
const RateLimiter = {
    attempts: {},
    check(key, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        if (!this.attempts[key]) this.attempts[key] = [];
        this.attempts[key] = this.attempts[key].filter(t => now - t < windowMs);
        if (this.attempts[key].length >= maxAttempts) return false;
        this.attempts[key].push(now);
        return true;
    }
};

// ============================================================
// FEES STATE
// ============================================================
let serviceFeePercent = 10;
let vatPercent = 14;
let businessLogo = null;

function loadFeesSettings() {
    const saved = localStorage.getItem('platepro_service_fee');
    if (saved) {
        const v = parseFloat(saved);
        if (isFinite(v) && v >= 0 && v <= 100) serviceFeePercent = v;
    }
    const savedVat = localStorage.getItem('platepro_vat');
    if (savedVat) {
        const v = parseFloat(savedVat);
        if (isFinite(v) && v >= 0 && v <= 100) vatPercent = v;
    }
}

function saveFeesSettings() {
    const serviceInput = document.getElementById('serviceFeeInput');
    const vatInput = document.getElementById('vatInput');
    const errEl = document.getElementById('feesError');

    const service = parseFloat(serviceInput.value);
    const vat = parseFloat(vatInput.value);

    if (!isFinite(service) || service < 0 || service > 100) {
        errEl.textContent = t('invalid_input'); return;
    }
    if (!isFinite(vat) || vat < 0 || vat > 100) {
        errEl.textContent = t('invalid_input'); return;
    }

    serviceFeePercent = service;
    vatPercent = vat;
    try {
        localStorage.setItem('platepro_service_fee', service.toString());
        localStorage.setItem('platepro_vat', vat.toString());
    } catch {}

    closeSheet('settingsFeesOverlay');
    showToast(t('fees_saved'), 'success');
    renderSettings();
    updateCustomerCartUI();
}

function openFeesSettings() {
    document.getElementById('serviceFeeInput').value = serviceFeePercent;
    document.getElementById('vatInput').value = vatPercent;
    document.getElementById('feesError').textContent = '';
    openSheet('settingsFeesOverlay');
}

// ============================================================
// LOGO MANAGEMENT (مع validation)
// ============================================================
function loadLogo() {
    const saved = localStorage.getItem('platepro_logo');
    if (saved && typeof saved === 'string' && saved.startsWith('data:image/')) {
        businessLogo = saved;
        updateLogoUI();
    }
}

function updateLogoUI() {
    const container = document.getElementById('bizLogoContainer');
    const customerContainer = document.getElementById('customerLogoContainer');
    if (!container) return;
    if (businessLogo) {
        const safeLogo = escapeHtml(businessLogo).replace(/&amp;/g, '&');
        container.innerHTML = `<img src="${safeLogo}" class="logo-img" alt="Logo">`;
        if (customerContainer) {
            customerContainer.innerHTML = `<img src="${safeLogo}" class="logo-img" alt="Logo">`;
        }
    } else {
        container.innerHTML = '';
        if (customerContainer) customerContainer.innerHTML = '';
    }
}

function openLogoSettings() {
    document.getElementById('logoInput').value = '';
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('removeLogoBtn').style.display = businessLogo ? 'inline-flex' : 'none';
    document.getElementById('logoError').textContent = '';
    if (businessLogo) {
        document.getElementById('logoPreviewImg').src = businessLogo;
        document.getElementById('logoPreview').style.display = 'block';
    }
    openSheet('settingsLogoOverlay');
}

document.addEventListener('DOMContentLoaded', function() {
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const errEl = document.getElementById('logoError');
            if (!file) return;
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                errEl.textContent = t('image_type_invalid');
                e.target.value = '';
                return;
            }
            if (file.size > MAX_LOGO_SIZE) {
                errEl.textContent = t('image_too_large');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('logoPreviewImg').src = event.target.result;
                document.getElementById('logoPreview').style.display = 'block';
                document.getElementById('removeLogoBtn').style.display = 'inline-flex';
            };
            reader.readAsDataURL(file);
        });
    }

    const menuImageInput = document.getElementById('menuItemImageInput');
    if (menuImageInput) {
        menuImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                showToast(t('image_type_invalid'), 'error');
                e.target.value = '';
                return;
            }
            if (file.size > MAX_LOGO_SIZE * 5) {
                showToast(t('image_too_large'), 'error');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('menuItemImagePreviewImg').src = event.target.result;
                document.getElementById('menuItemImagePreview').style.display = 'block';
                document.getElementById('menuItemImageData').value = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
});

function saveLogo() {
    const fileInput = document.getElementById('logoInput');
    const errEl = document.getElementById('logoError');

    if (!fileInput.files.length) {
        errEl.textContent = t('error_general');
        return;
    }

    const file = fileInput.files[0];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errEl.textContent = t('image_type_invalid'); return;
    }
    if (file.size > MAX_LOGO_SIZE) {
        errEl.textContent = t('image_too_large'); return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        businessLogo = event.target.result;
        try {
            localStorage.setItem('platepro_logo', businessLogo);
        } catch {
            errEl.textContent = t('storage_full');
            return;
        }
        updateLogoUI();
        closeSheet('settingsLogoOverlay');
        showToast(t('logo_saved'), 'success');
        renderSettings();
    };
    reader.onerror = function() { errEl.textContent = t('error_upload'); };
    reader.readAsDataURL(file);
}

function removeLogo() {
    businessLogo = null;
    try { localStorage.removeItem('platepro_logo'); } catch {}
    updateLogoUI();
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('removeLogoBtn').style.display = 'none';
    document.getElementById('logoInput').value = '';
    showToast(t('logo_deleted'), 'success');
    renderSettings();
}

// ============================================================
// THEME SYSTEM
// ============================================================
function toggleTheme() {
    const currentTheme = localStorage.getItem('platepro_theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        try { localStorage.setItem('platepro_theme', 'light'); } catch {}
    } else {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('platepro_theme', 'dark'); } catch {}
    }
    updateThemeToggle();
}

function loadTheme() {
    const saved = localStorage.getItem('platepro_theme') || 'dark';
    applyTheme(saved);
}

function updateThemeToggle() {
    const currentTheme = localStorage.getItem('platepro_theme') || 'dark';
    const toggle = document.getElementById('themeToggle');
    const label = document.getElementById('themeToggleLabel');
    if (toggle) toggle.classList.toggle('active', currentTheme === 'light');
    if (label) label.textContent = currentTheme === 'dark' ? t('dark') : t('light');
}

// ============================================================
// STATE
// ============================================================
let business = null;
let deviceRecord = null;
let currentUser = null;
let tables = [];
let orders = {};
let menuItems = [];
let menuCategories = [];
let employees = [];
let paymentMethods = [];
let currentShift = null;
let shiftManuallyClosed = false;
let _orderItems = [];
let selectedPaymentMethod = null;
let orderStatus = {};
let qrGenerated = false;
let editingTableId = null;
let realtimeSubscription = null;
let shiftFilter = 'daily';

// ============================================================
// CUSTOMER PAGE STATE
// ============================================================
let customerCart = [];
let customerBusiness = null;
let customerMenuItems = [];
let customerCategories = [];
let currentCustomerFilter = 'all';
let customerBusinessId = null;

// ============================================================
// UTILITIES
// ============================================================
function showToast(msg, type = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + type;
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 2800);
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function openSheet(id) { const el = document.getElementById(id); if (el) el.classList.add('show'); }
function closeSheet(id) { const el = document.getElementById(id); if (el) el.classList.remove('show'); }

function navigateTo(viewId) {
    if (currentUser && currentUser.type !== 'owner') {
        const perms = currentUser.permissions || {};
        const viewMap = {
            'view-dashboard': 'dashboard',
            'view-tables': 'tables',
            'view-kitchen': 'orders',
            'view-menu': 'menu',
            'view-settings': 'settings',
            'view-qr': 'dashboard',
            'view-shift-history': 'dashboard',
            'view-shift-detail': 'dashboard'
        };
        const permKey = viewMap[viewId];
        if (permKey && !perms[permKey] && viewId !== 'view-qr' && viewId !== 'view-shift-history' && viewId !== 'view-shift-detail') {
            showToast(t('error_permission'), 'error');
            return;
        }
    }

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));

    updateUIByPermissions();

    if (viewId === 'view-dashboard') renderDashboard();
    if (viewId === 'view-tables') renderTables();
    if (viewId === 'view-kitchen') renderKitchenOrders();
    if (viewId === 'view-menu') { renderMenuView(); renderMenuManagement(); }
    if (viewId === 'view-settings') renderSettings();
    if (viewId === 'view-qr') generateQRCodePage();
    if (viewId === 'view-shift-history') renderShiftHistoryPage(shiftFilter);
}

function getDeviceId() {
    let id = localStorage.getItem('platepro_device_id');
    if (!id || !/^dev_[a-z0-9]{16,64}$/.test(id)) {
        const buf = new Uint8Array(24);
        crypto.getRandomValues(buf);
        id = 'dev_' + Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
        try { localStorage.setItem('platepro_device_id', id); } catch {}
    }
    return id;
}

// ============================================================
// HAMBURGER MENU
// ============================================================
function toggleHamburgerMenu() {
    const dropdown = document.getElementById('hamburgerDropdown');
    if (!dropdown) return;

    if (dropdown.classList.contains('show')) {
        closeHamburgerMenu();
        return;
    }

    const btn = document.querySelector('.hamburger-btn');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        const margin = 10;
        const dropdownWidth = Math.min(200, window.innerWidth - margin * 2);

        let left = rect.left;
        if (left + dropdownWidth > window.innerWidth - margin) {
            left = window.innerWidth - margin - dropdownWidth;
        }
        if (left < margin) left = margin;

        let top = rect.bottom + 6;
        if (top + 250 > window.innerHeight) {
            top = Math.max(margin, rect.top - 6 - 250);
        }

        dropdown.style.left = left + 'px';
        dropdown.style.top = top + 'px';
    }

    dropdown.classList.add('show');
}

function closeHamburgerMenu() {
    const dropdown = document.getElementById('hamburgerDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

window.addEventListener('resize', closeHamburgerMenu);

document.addEventListener('click', function(e) {
    const menu = document.querySelector('.hamburger-menu');
    if (menu && !menu.contains(e.target)) closeHamburgerMenu();
});

// ============================================================
// RING NOTIFICATION
// ============================================================
let audioContext = null;
let ringTimeout = null;

function initAudio() {
    try {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
        console.log('🎵 Audio initialized');
    } catch (e) {
        console.warn('⚠️ Audio not supported');
    }
}

function playRingSound(type = 'new_order') {
    try {
        if (!audioContext) initAudio();
        if (!audioContext) return;
        if (audioContext.state === 'suspended') audioContext.resume();

        const now = audioContext.currentTime;

        if (type === 'new_order') {
            const frequencies = [800, 1000, 1200, 1000, 800];
            const durations = [0.15, 0.15, 0.15, 0.15, 0.2];
            let time = now;
            frequencies.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0.25, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + durations[i]);
                osc.start(time);
                osc.stop(time + durations[i]);
                time += durations[i] + 0.05;
            });
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        } else if (type === 'order_ready') {
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.setValueAtTime(1000, now);
            osc1.frequency.setValueAtTime(1200, now + 0.1);
            osc1.frequency.setValueAtTime(1000, now + 0.2);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc1.start(now);
            osc1.stop(now + 0.3);

            setTimeout(() => {
                if (!audioContext) return;
                const now2 = audioContext.currentTime;
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.setValueAtTime(1200, now2);
                osc2.frequency.setValueAtTime(1500, now2 + 0.1);
                osc2.frequency.setValueAtTime(1200, now2 + 0.2);
                gain2.gain.setValueAtTime(0.3, now2);
                gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.3);
                osc2.start(now2);
                osc2.stop(now2 + 0.3);
            }, 400);
            if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
        }
    } catch (e) {
        console.warn('⚠️ Could not play sound:', e);
    }
}

function showRingNotification(title, message, type = 'new_order') {
    playRingSound(type);
    const el = document.getElementById('ringNotification');
    if (!el) {
        showToast(`🔔 ${title}: ${message}`, 'info');
        return;
    }
    document.getElementById('ringTitle').textContent = title;
    document.getElementById('ringSub').textContent = message;
    el.classList.add('show');
    clearTimeout(ringTimeout);
    ringTimeout = setTimeout(() => { el.classList.remove('show'); }, 5000);
    el.onclick = function() { el.classList.remove('show'); clearTimeout(ringTimeout); };
}

// ============================================================
// PERMISSIONS
// ============================================================
function hasPermission(perm) {
    if (!currentUser) return false;
    if (currentUser.type === 'owner') return true;

    if (currentUser.role === 'chef') {
        return ['orders', 'kitchen'].includes(perm);
    }
    if (currentUser.role === 'waiter') {
        return ['orders', 'tables', 'create_orders', 'print_receipt'].includes(perm);
    }
    if (currentUser.role === 'cashier') {
        return ['dashboard', 'tables', 'orders', 'payment', 'add_expense', 'print_receipt', 'view_revenue', 'view_expenses'].includes(perm) ||
            (currentUser.permissions && currentUser.permissions[perm] === true);
    }
    return currentUser.permissions && currentUser.permissions[perm] === true;
}

function updateUIByPermissions() {
    const expenseBtn = document.getElementById('dashExpenseBtn');
    const closeShiftBtn = document.getElementById('dashCloseShiftBtn');
    const revenueCard = document.querySelector('.stat-card.revenue');

    if (expenseBtn) expenseBtn.style.display = hasPermission('add_expense') ? 'flex' : 'none';
    if (closeShiftBtn) closeShiftBtn.style.display = hasPermission('close_shift') ? 'flex' : 'none';

    if (revenueCard) {
        const canViewRevenue = hasPermission('view_revenue') || currentUser?.type === 'owner';
        revenueCard.style.display = canViewRevenue ? 'block' : 'none';
    }

    const menuManageBtns = document.querySelectorAll('#view-menu .btn-primary, #view-menu .btn-outline');
    menuManageBtns.forEach(btn => {
        btn.style.display = hasPermission('manage_menu') ? 'inline-flex' : 'none';
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        const view = btn.dataset.view;
        const viewMap = {
            'view-dashboard': 'dashboard',
            'view-tables': 'tables',
            'view-kitchen': 'orders',
            'view-menu': 'menu',
            'view-settings': 'settings'
        };
        const permKey = viewMap[view];
        if (permKey) btn.style.display = hasPermission(permKey) ? 'flex' : 'none';
    });

    const qrBtn = document.querySelector('[onclick*="view-qr"]');
    if (qrBtn) qrBtn.style.display = hasPermission('dashboard') ? 'flex' : 'none';
}

async function openNewShift() {
    shiftManuallyClosed = false;
    await loadOrOpenShift();
    updateShiftIndicator();
    renderDashboard();
    renderSettings();
    if (currentShift && !currentShift.id.toString().startsWith('temp_')) {
        showToast('✅ تم فتح شيفت جديد', 'success');
    }
}

// ============================================================
// SHIFT INDICATOR
// ============================================================
function updateShiftIndicator() {
    const indicator = document.getElementById('shiftIndicator');
    const label = document.getElementById('shiftStatusLabel');
    const closeShiftBtn = document.getElementById('dashCloseShiftBtn');

    if (currentShift && currentShift.status === 'open') {
        if (indicator) {
            indicator.className = 'shift-indicator';
            if (label) {
                label.textContent = t('shift_open');
                label.style.color = 'var(--success)';
            }
            const time = new Date(currentShift.opened_at).toLocaleTimeString();
            indicator.title = `فتح في: ${time}`;
        }
        if (closeShiftBtn) {
            closeShiftBtn.className = 'btn btn-danger btn-block';
            closeShiftBtn.innerHTML = `<i class="fa-solid fa-lock"></i> <span data-i18n="close_shift">${t('close_shift')}</span>`;
            closeShiftBtn.onclick = openCloseShiftSheet;
        }
    } else {
        if (indicator) {
            indicator.className = 'shift-indicator closed';
            if (label) {
                label.textContent = t('shift_closed');
                label.style.color = 'var(--danger)';
            }
        }
        if (closeShiftBtn) {
            closeShiftBtn.className = 'btn btn-primary btn-block';
            closeShiftBtn.innerHTML = `<i class="fa-solid fa-unlock"></i> <span data-i18n="open_new_shift">${t('open_new_shift')}</span>`;
            closeShiftBtn.onclick = openNewShift;
        }
    }
}

// ============================================================
// QR CODE
// ============================================================
function generateQRCodePage() {
    if (!business) {
        showToast('⚠️ لا يوجد نشاط تجاري', 'error');
        return;
    }
    const bizId = business.id;
    const baseUrl = window.location.origin + window.location.pathname;
    const customerUrl = baseUrl + '?customer=true&biz=' + encodeURIComponent(bizId);
    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(customerUrl);
    const img = document.getElementById('qrCodeImagePage');
    if (img) img.src = qrApiUrl;
    qrGenerated = true;
    try {
        localStorage.setItem('platepro_customer_url', customerUrl);
        localStorage.setItem('platepro_business_id', bizId);
    } catch {}
    showToast(t('qr_generated'), 'success');
}

function downloadQRPage() {
    const img = document.getElementById('qrCodeImagePage');
    if (!img) return;
    const link = document.createElement('a');
    link.download = 'QR_' + (business ? business.code : 'cafe') + '.png';
    link.href = img.src;
    link.click();
}

// ============================================================
// REALTIME SYNC
// ============================================================
function getTableLabel(tableId) {
    const table = tables.find(t => t.id === tableId);
    return table ? escapeHtml(String(table.number)) : '?';
}

function startRealtimeSync() {
    if (!supabaseClient || !business) {
        console.warn('⚠️ Cannot start realtime sync: missing client or business');
        return;
    }

    if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
        realtimeSubscription = null;
    }

    console.log('🔄 Starting realtime sync for orders...');

    realtimeSubscription = supabaseClient
        .channel('orders-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `business_id=eq.${business.id}`
        }, async (payload) => {
            const rec = payload.new || payload.old;
            if (rec && rec.business_id && rec.business_id !== business.id) return;

            const { eventType, new: newRecord, old: oldRecord } = payload;

            if (eventType === 'INSERT') {
                orders[newRecord.id] = newRecord;
                if (!orderStatus[newRecord.id]) orderStatus[newRecord.id] = newRecord.status || 'pending';
                showRingNotification('🔔 طلب جديد!', `طاولة ${getTableLabel(newRecord.table_id)}`, 'new_order');
            } else if (eventType === 'UPDATE') {
                if (orders[oldRecord.id]) {
                    if (oldRecord.status !== newRecord.status && newRecord.status === 'ready') {
                        showRingNotification('🛎️ طلب جاهز!', `طاولة ${getTableLabel(newRecord.table_id)}`, 'order_ready');
                    }
                    orders[newRecord.id] = newRecord;
                    orderStatus[newRecord.id] = newRecord.status || 'pending';
                }
            } else if (eventType === 'DELETE') {
                delete orders[oldRecord.id];
                delete orderStatus[oldRecord.id];
            }

            renderDashboard();
            renderTables();
            renderKitchenOrders();
        })
        .subscribe((status) => {
            console.log('📡 Realtime subscription status:', status);
        });

    supabaseClient
        .channel('tables-changes')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'tables',
            filter: `business_id=eq.${business.id}`
        }, async (payload) => {
            const rec = payload.new || payload.old;
            if (rec && rec.business_id && rec.business_id !== business.id) return;
            await loadTables();
            renderTables();
            renderDashboard();
        })
        .subscribe();
}

function stopRealtimeSync() {
    if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
        realtimeSubscription = null;
        console.log('🔄 Realtime sync stopped');
    }
}

// ============================================================
// CUSTOMER PAGE
// ============================================================
function initCustomerPage() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('customer') === 'true') {
        document.getElementById('setupScreen').classList.remove('active');
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('customerPage').classList.add('active');
        loadCustomerData();
    }
}

async function loadCustomerData() {
    const params = new URLSearchParams(window.location.search);
    let bizId = params.get('biz');

    if (!bizId) bizId = localStorage.getItem('platepro_business_id');

    if (!bizId || !isValidUuid(bizId)) {
        document.getElementById('customerBizName').textContent = '❌ مطعم غير موجود';
        document.getElementById('customerMenuItems').innerHTML = `
            <div class="empty" style="padding:40px 16px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:40px;color:var(--danger);"></i>
                <div style="font-size:16px; font-weight:700; margin-top:8px;">رابط غير صحيح</div>
                <div style="font-size:13px; color:var(--text-muted);">تأكد من الرابط المستخدم</div>
            </div>
        `;
        return;
    }

    customerBusinessId = bizId;

    if (!supabaseClient) {
        document.getElementById('customerBizName').textContent = '⚠️ خطأ في الاتصال';
        document.getElementById('customerMenuItems').innerHTML = `
            <div class="empty" style="padding:40px 16px;">
                <i class="fa-solid fa-wifi" style="font-size:40px;color:var(--warning);"></i>
                <div style="font-size:16px; font-weight:700; margin-top:8px;">خطأ في الاتصال</div>
                <div style="font-size:13px; color:var(--text-muted);">تأكد من اتصال الإنترنت</div>
            </div>
        `;
        return;
    }

    try {
        const { data: biz, error: bizError } = await supabaseClient
            .from('businesses_public')
            .select('id, code, name, created_at')
            .eq('id', bizId)
            .maybeSingle();

        if (bizError || !biz) {
            document.getElementById('customerBizName').textContent = '❌ مطعم غير موجود';
            document.getElementById('customerMenuItems').innerHTML = `
                <div class="empty" style="padding:40px 16px;">
                    <i class="fa-solid fa-store-slash" style="font-size:40px;color:var(--danger);"></i>
                    <div style="font-size:16px; font-weight:700; margin-top:8px;">المطعم غير موجود</div>
                    <div style="font-size:13px; color:var(--text-muted);">تأكد من الكود المستخدم</div>
                </div>
            `;
            return;
        }

        customerBusiness = biz;
        document.getElementById('customerBizName').textContent = biz.name;
        document.title = biz.name + ' - Menu';

        const savedLogo = localStorage.getItem('platepro_logo');
        if (savedLogo && savedLogo.startsWith('data:image/')) {
            const logoContainer = document.getElementById('customerLogoContainer');
            if (logoContainer) {
                logoContainer.innerHTML = `<img src="${escapeHtml(savedLogo).replace(/&amp;/g, '&')}" class="logo-img" alt="Logo">`;
            }
        }

        const [itemsRes, catsRes] = await Promise.all([
            supabaseClient.from('menu_items')
                .select('*')
                .eq('business_id', bizId)
                .eq('is_active', true)
                .order('sort_order'),
            supabaseClient.from('menu_categories')
                .select('*')
                .eq('business_id', bizId)
                .eq('is_active', true)
                .order('sort_order')
        ]);

        customerMenuItems = itemsRes.data || [];
        customerCategories = catsRes.data || [];

        await renderCustomerTables();
        renderCustomerCategories();
        renderCustomerItems();
        loadFeesSettings();

        console.log('✅ Customer data loaded successfully');

    } catch (e) {
        console.error('Error loading customer data:', e);
        document.getElementById('customerBizName').textContent = '⚠️ خطأ في التحميل';
        document.getElementById('customerMenuItems').innerHTML = `
            <div class="empty" style="padding:40px 16px;">
                <i class="fa-solid fa-circle-exclamation" style="font-size:40px;color:var(--danger);"></i>
                <div style="font-size:16px; font-weight:700; margin-top:8px;">⚠️ حدث خطأ</div>
                <div style="font-size:13px; color:var(--text-muted);">حاول تحديث الصفحة</div>
            </div>
        `;
    }
}

async function renderCustomerTables() {
    if (!customerBusiness) return;
    const bizId = customerBusiness.id;
    try {
        const { data: tablesData } = await supabaseClient
            .from('tables')
            .select('*')
            .eq('business_id', bizId)
            .order('number');

        const tableSelect = document.getElementById('customerTableSelect');
        if (!tableSelect) return;

        if (tablesData && tablesData.length > 0) {
            const availableTables = tablesData.filter(t => t.status === 'available');
            if (availableTables.length > 0) {
                tableSelect.innerHTML = `<option value="">-- اختر طاولة --</option>
                    ${availableTables.map(t => `<option value="${escapeHtml(t.id)}">طاولة ${escapeHtml(String(t.number))} (${Number(t.capacity) || 4} أشخاص)</option>`).join('')}`;
            } else {
                tableSelect.innerHTML = `<option value="">⚠️ مفيش طاولات متاحة حالياً</option>`;
            }
        } else {
            tableSelect.innerHTML = `<option value="">⚠️ مفيش طاولات متاحة حالياً</option>`;
        }
    } catch (e) {
        console.error('Error loading tables:', e);
    }
}

function renderCustomerCategories() {
    const container = document.getElementById('customerCategories');
    if (!container) return;
    container.innerHTML = `<button class="btn active" onclick="filterCustomerItems('all')">${t('all')}</button>
        ${customerCategories.map(cat => `<button class="btn" onclick="filterCustomerItems('${escapeHtml(cat.id)}')"><i class="fa-solid ${escapeHtml(cat.icon || 'fa-utensils')}"></i> ${escapeHtml(cat.name)}</button>`).join('')}`;
}

function filterCustomerItems(categoryId) {
    currentCustomerFilter = categoryId;
    document.querySelectorAll('#customerCategories .btn').forEach(btn => btn.classList.remove('active'));
    const btns = document.querySelectorAll('#customerCategories .btn');
    const idx = categoryId === 'all' ? 0 : customerCategories.findIndex(c => c.id === categoryId) + 1;
    if (btns[idx]) btns[idx].classList.add('active');
    renderCustomerItems(categoryId);
}

function renderCustomerItems(categoryId) {
    const container = document.getElementById('customerMenuItems');
    if (!container) return;
    let items = customerMenuItems;
    if (categoryId && categoryId !== 'all') {
        items = items.filter(item => item.category_id === categoryId);
    }
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="empty" style="padding:40px 16px;"><i class="fa-solid fa-utensils" style="font-size:40px;"></i><div style="font-size:16px; font-weight:700; margin-top:8px;">${t('no_items')}</div><div style="font-size:13px; color:var(--text-muted);">جاري تحديث المنيو</div></div>`;
        return;
    }
    container.innerHTML = items.map(item => {
        let imageHtml = '🍽️';
        if (item.image_url && typeof item.image_url === 'string') {
            imageHtml = `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none';this.parentElement.innerHTML='🍽️'">`;
        }
        return `<div class="customer-menu-card">
            <div class="item-image">${imageHtml}</div>
            <div class="item-info">
                <div class="item-name">${escapeHtml(item.name)}</div>
                ${item.description ? `<div class="item-desc">${escapeHtml(item.description)}</div>` : ''}
                <div class="item-price">${money(item.price)} ج.م</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-xs" onclick="addToCustomerCart('${escapeHtml(item.id)}')"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>`;
    }).join('');
}

// ============================================================
// CUSTOMER CART
// ============================================================
function addToCustomerCart(itemId) {
    if (!isValidUuid(itemId)) return;
    const item = customerMenuItems.find(i => i.id === itemId);
    if (!item) return;
    const existing = customerCart.find(i => i.id === itemId);
    if (existing) {
        if (existing.quantity >= MAX_QUANTITY_PER_ITEM) {
            showCustomerToast(t('invalid_quantity')); return;
        }
        existing.quantity += 1;
    } else {
        if (customerCart.length >= MAX_ITEMS_PER_ORDER) {
            showCustomerToast(t('too_many_items')); return;
        }
        customerCart.push({ ...item, quantity: 1, note: '' });
    }
    updateCustomerCartUI();
    showCustomerToast('✅ تم إضافة ' + escapeHtml(item.name));
}

function updateCustomerCartNote(index, value) {
    const item = customerCart[index];
    if (!item) return;
    item.note = sanitizeNote(value);
}

function updateCustomerCartUI() {
    const count = customerCart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = customerCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const serviceFee = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + serviceFee) * (vatPercent / 100);
    const total = subtotal + serviceFee + vat;

    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cart = document.getElementById('customerCart');

    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = money(total);
    if (cart) cart.style.display = count > 0 ? 'block' : 'none';
}

function showCustomerCart() {
    const container = document.getElementById('customerCartItems');
    if (!container) return;
    if (customerCart.length === 0) {
        container.innerHTML = `<div class="empty">${t('empty_cart')}</div>`;
        document.getElementById('customerCartTotal').textContent = '0';
        openSheet('customerCartOverlay');
        return;
    }
    container.innerHTML = customerCart.map((item, index) =>
        `<div class="order-item">
            <div style="flex:1;">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-details">${item.quantity} × ${money(item.price)}
                    <button class="btn btn-xs" style="background:var(--danger);color:#fff;border:none;border-radius:4px;cursor:pointer;margin-right:8px;" onclick="removeFromCustomerCart(${index})"><i class="fa-solid fa-minus"></i></button>
                </div>
                <input type="text" class="item-note-input" maxlength="${MAX_NOTE_LENGTH}" placeholder="📝 ${t('item_note_placeholder')}" value="${escapeHtml(item.note || '')}" oninput="updateCustomerCartNote(${index}, this.value)">
            </div>
            <div class="item-price">${money(item.price * item.quantity)}</div>
        </div>`
    ).join('');

    const subtotal = customerCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const serviceFee = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + serviceFee) * (vatPercent / 100);
    const total = subtotal + serviceFee + vat;

    document.getElementById('cartSubtotal').textContent = money(subtotal);
    document.getElementById('serviceFeePercent').textContent = serviceFeePercent;
    document.getElementById('cartServiceFee').textContent = money(serviceFee);
    document.getElementById('vatPercent').textContent = vatPercent;
    document.getElementById('cartVat').textContent = money(vat);
    document.getElementById('customerCartTotal').textContent = money(total);

    openSheet('customerCartOverlay');
}

function removeFromCustomerCart(index) {
    customerCart.splice(index, 1);
    updateCustomerCartUI();
    showCustomerCart();
}

function showCustomerToast(msg) {
    const el = document.getElementById('customerToast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast success';
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 2000);
}

// ============================================================
// 🛡️ RPC HELPERS
// ============================================================
async function rpcSecureVerifyPin(pin, type) {
    const cleanPin = sanitizePin(pin);
    if (!cleanPin) throw new Error('INVALID_PIN');
    const { data, error } = await supabaseClient.rpc('verify_pin_secure', {
        p_business_id: business.id,
        p_pin: cleanPin,
        p_type: type
    });
    if (error) throw error;
    return data;
}

async function rpcSecureActivateDevice(code) {
    const cleanCode = sanitizeBusinessCode(code);
    if (!cleanCode) throw new Error('INVALID_CODE');
    const { data, error } = await supabaseClient.rpc('activate_device_secure', {
        p_business_id: business.id,
        p_code: cleanCode,
        p_device_id: getDeviceId()
    });
    if (error) throw error;
    return data;
}

async function rpcSecureCreateOrder(payload) {
    const { data, error } = await supabaseClient.rpc('create_order_secure', {
        p_business_id: payload.business_id,
        p_table_id: payload.table_id,
        p_items: payload.items,
        p_order_type: payload.order_type,
        p_notes: payload.notes
    });
    if (error) throw error;
    return data;
}

async function rpcSecureAddExpense(description, amount) {
    const cleanDesc = sanitizeNote(description);
    const cleanAmount = assertFiniteNonNegative(amount, 'amount');
    if (cleanAmount <= 0 || cleanAmount > MAX_EXPENSE_AMOUNT) throw new Error('INVALID_AMOUNT');
    const { data, error } = await supabaseClient.rpc('add_expense_secure', {
        p_business_id: business.id,
        p_shift_id: currentShift?.id,
        p_description: cleanDesc,
        p_amount: cleanAmount
    });
    if (error) throw error;
    return data;
}

async function rpcSecureCloseShift() {
    if (!currentShift?.id) throw new Error('NO_SHIFT');
    const { data, error } = await supabaseClient.rpc('close_shift_secure', {
        p_shift_id: currentShift.id
    });
    if (error) throw error;
    return data;
}

async function rpcSecureUpdateOrderStatus(orderId, newStatus) {
    if (!ALLOWED_STATUSES.includes(newStatus)) throw new Error('INVALID_STATUS');
    const { data, error } = await supabaseClient.rpc('update_order_status_secure', {
        p_order_id: orderId,
        p_new_status: newStatus
    });
    if (error) throw error;
    return data;
}

// ============================================================
// 🛡️ SUBMIT CUSTOMER ORDER
// ============================================================
async function submitCustomerOrder() {
    if (customerCart.length === 0) {
        document.getElementById('customerCartError').textContent = t('error_no_items');
        return;
    }
    const tableId = document.getElementById('customerTableSelect').value;
    if (!tableId || !isValidUuid(tableId)) {
        document.getElementById('customerCartError').textContent = '⚠️ اختر رقم الطاولة أولاً';
        return;
    }
    if (!customerBusiness) {
        document.getElementById('customerCartError').textContent = t('error_general');
        return;
    }

    if (!RateLimiter.check('customer_order_' + (customerBusiness.id || 'x'), 10, 60000)) {
        document.getElementById('customerCartError').textContent = t('rate_limited');
        return;
    }

    try {
        const result = await rpcSecureCreateOrder({
            business_id: customerBusiness.id,
            table_id: tableId,
            order_type: 'dine_in_qr',
            notes: '📱 طلب من العميل عبر QR',
            items: customerCart.map(i => ({
                menu_item_id: i.id,
                quantity: i.quantity,
                note: sanitizeNote(i.note)
            }))
        });

        if (!result || !result.success) {
            if (result?.error === 'TABLE_UNAVAILABLE') {
                document.getElementById('customerCartError').textContent = t('table_unavailable');
                loadCustomerData();
                return;
            }
            throw new Error('ORDER_FAILED');
        }

        customerCart = [];
        updateCustomerCartUI();
        closeSheet('customerCartOverlay');
        showCustomerToast(t('order_created'));
        document.getElementById('customerCartError').textContent = '';
        await loadCustomerData();
        try {
            localStorage.setItem('platepro_need_refresh', 'true');
            localStorage.setItem('platepro_last_order_time', Date.now().toString());
        } catch {}

    } catch (e) {
        console.error('Error submitting order:', e);
        document.getElementById('customerCartError').textContent = t('error_general');
    }
}

// ============================================================
// 🛡️ SETUP / ACTIVATION
// ============================================================
async function handleSetupContinue() {
    const code = sanitizeBusinessCode(document.getElementById('setupBusinessCode').value);
    const errEl = document.getElementById('setupError');
    errEl.textContent = '';
    if (!code) { errEl.textContent = t('error_invalid_code'); return; }

    if (!RateLimiter.check('setup_' + getDeviceId(), 5, 60000)) {
        errEl.textContent = t('rate_limited'); return;
    }

    const btn = document.getElementById('setupContinueBtn');
    btn.disabled = true;

    try {
        if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }

        const { data: biz, error } = await supabaseClient
            .from('businesses_public')
            .select('id, code, name, created_at')
            .eq('code', code)
            .maybeSingle();

        if (error || !biz) { errEl.textContent = t('error_invalid_code'); return; }

        business = biz;
        try { localStorage.setItem('platepro_business_code', code); } catch {}

        loadLogo();

        const deviceId = getDeviceId();
        const { data: dev } = await supabaseClient
            .from('devices_public')
            .select('id, business_id, device_id, is_active, revoked, expiry_date, device_label')
            .eq('business_id', biz.id)
            .eq('device_id', deviceId)
            .maybeSingle();

        if (!dev) {
            document.getElementById('activationBizName').textContent = biz.name;
            showScreen('activationScreen');
            return;
        }
        deviceRecord = dev;
        proceedToLock();
    } catch (e) {
        console.error(e);
        errEl.textContent = t('error_connection');
    } finally { btn.disabled = false; }
}

async function handleActivateDevice() {
    const code = sanitizeBusinessCode(document.getElementById('activationCodeInput').value);
    const errEl = document.getElementById('activationError');
    errEl.textContent = '';
    if (!code) { errEl.textContent = t('error_general'); return; }

    if (!RateLimiter.check('activate_' + getDeviceId(), 3, 120000)) {
        errEl.textContent = t('rate_limited'); return;
    }

    try {
        if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }

        const result = await rpcSecureActivateDevice(code);
        if (!result || !result.success) {
            errEl.textContent = 'الكود غير صحيح أو مستخدم قبل كده.';
            return;
        }

        deviceRecord = result.device;
        showToast(t('device_activated'), 'success');
        proceedToLock();
    } catch (e) {
        console.error(e);
        errEl.textContent = t('error_connection');
    }
}

function proceedToLock() {
    if (!business || !deviceRecord) return;
    document.getElementById('lockBizCode').textContent = business.code;
    document.getElementById('lockBizName').textContent = business.name;

    const expiry = deviceRecord.expiry_date ? new Date(deviceRecord.expiry_date) : null;
    const subLine = document.getElementById('subStatusLine');
    if (!subLine) return;

    if (deviceRecord.revoked || !deviceRecord.is_active) {
        subLine.textContent = 'الجهاز موقوف — تواصل مع الإدارة';
    } else if (expiry && expiry < new Date()) {
        subLine.textContent = 'الاشتراك منتهي — تواصل مع الإدارة';
    } else if (expiry) {
        const days = Math.ceil((expiry - new Date()) / 86400000);
        subLine.textContent = `متبقي ${days} يوم على الاشتراك`;
    }
    resetLockRole();
    showScreen('lockScreen');
}

function selectLockRole(role) {
    document.getElementById('lockError').textContent = '';
    document.getElementById('lockRoleChoice').style.display = 'none';
    document.getElementById('lockOwnerForm').style.display = role === 'owner' ? 'block' : 'none';
    document.getElementById('lockEmployeeForm').style.display = role === 'employee' ? 'block' : 'none';
}

function resetLockRole() {
    document.getElementById('lockError').textContent = '';
    document.getElementById('lockPinInput').value = '';
    document.getElementById('lockEmpName').value = '';
    document.getElementById('lockEmpPin').value = '';
    document.getElementById('lockOwnerForm').style.display = 'none';
    document.getElementById('lockEmployeeForm').style.display = 'none';
    document.getElementById('lockRoleChoice').style.display = 'block';
}

async function handleEmployeeUnlock() {
    const name = sanitizeName(document.getElementById('lockEmpName').value);
    const pin = sanitizePin(document.getElementById('lockEmpPin').value);
    const errEl = document.getElementById('lockError');
    errEl.textContent = '';

    if (deviceRecord?.revoked || !deviceRecord?.is_active) { errEl.textContent = t('error_general'); return; }
    if (deviceRecord?.expiry_date && new Date(deviceRecord.expiry_date) < new Date()) {
        errEl.textContent = 'الاشتراك منتهي.'; return;
    }
    if (!name || !pin) { errEl.textContent = t('error_general'); return; }

    if (!RateLimiter.check('empunlock_' + getDeviceId(), 5, 60000)) {
        errEl.textContent = t('rate_limited'); return;
    }

    if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }

    try {
        const result = await rpcSecureVerifyPin(pin, 'employee');
        if (result && result.success && result.user) {
            if (result.user.data.name.toLowerCase() !== name.toLowerCase()) {
                errEl.textContent = t('error_invalid_pin');
                return;
            }
            currentUser = { type: 'employee', ...result.user.data };
            enterMainApp();
            return;
        }
        errEl.textContent = t('error_invalid_pin');
    } catch (e) {
        console.error(e);
        errEl.textContent = t('error_connection');
    }
}

async function handleUnlock() {
    const pin = sanitizePin(document.getElementById('lockPinInput').value);
    const errEl = document.getElementById('lockError');
    errEl.textContent = '';

    if (deviceRecord?.revoked || !deviceRecord?.is_active) { errEl.textContent = t('error_general'); return; }
    if (deviceRecord?.expiry_date && new Date(deviceRecord.expiry_date) < new Date()) {
        errEl.textContent = 'الاشتراك منتهي.'; return;
    }
    if (!pin) { errEl.textContent = t('error_general'); return; }

    if (!RateLimiter.check('unlock_' + getDeviceId(), 5, 60000)) {
        errEl.textContent = t('rate_limited'); return;
    }

    if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }

    try {
        const result = await rpcSecureVerifyPin(pin, 'any');
        if (result && result.success && result.user) {
            currentUser = result.user.type === 'owner'
                ? { type: 'owner', name: 'المالك' }
                : { type: 'employee', ...result.user.data };
            enterMainApp();
            return;
        }
        errEl.textContent = t('error_invalid_pin');
    } catch (e) {
        console.error(e);
        errEl.textContent = t('error_connection');
    }
}

function lockApp() {
    currentUser = null;
    Session.clear();
    stopRealtimeSync();
    document.getElementById('lockPinInput').value = '';
    proceedToLock();
}

// ============================================================
// MAIN APP
// ============================================================
async function enterMainApp() {
    document.getElementById('headerBizName').textContent = business.name;
    document.getElementById('headerBizCode').textContent = business.code;
    showScreen('mainApp');

    loadTheme();
    loadFeesSettings();
    loadLogo();
    await loadAllData();

    await loadOrOpenShift();

    startRealtimeSync();

    document.getElementById('dashBizName').textContent = business.name;
    updateLogoUI();

    if (currentUser.type === 'owner') {
        currentUser.permissions = {
            dashboard: true, tables: true, orders: true, menu: true, settings: true,
            create_orders: true, add_expense: true, close_shift: true, print_receipt: true,
            manage_menu: true, view_revenue: true, view_expenses: true
        };
    }

    updateUIByPermissions();
    applyTranslations();
    renderDashboard();
    renderTables();
    renderKitchenOrders();
    renderMenuView();
    renderMenuManagement();
    renderSettings();
    updateShiftIndicator();

    setInterval(async () => {
        if (!shiftManuallyClosed && (!currentShift || currentShift.status !== 'open')) {
            await loadOrOpenShift();
        }
        updateShiftIndicator();
    }, 10000);

    startAutoRefresh();
}

// ============================================================
// SHIFT MANAGEMENT
// ============================================================
async function loadOrOpenShift() {
    if (!supabaseClient || !business) return null;

    try {
        let { data: shift, error } = await supabaseClient
            .from('shifts')
            .select('*')
            .eq('business_id', business.id)
            .eq('status', 'open')
            .maybeSingle();

        if (error) console.error('Error fetching shift:', error);

        if (!shift) {
            console.log('🔄 No open shift found, creating new one...');
            try {
                const { data: newShift, error: createError } = await supabaseClient
                    .from('shifts')
                    .insert({
                        business_id: business.id,
                        opened_at: new Date().toISOString(),
                        status: 'open',
                        total_revenue: 0,
                        total_expenses: 0,
                        total_profit: 0,
                        opened_by: sanitizeName(currentUser?.name || 'نظام')
                    })
                    .select()
                    .single();

                if (!createError && newShift) {
                    shift = newShift;
                    console.log(`✅ New shift opened for business: ${business.name}`);
                    showToast('✅ تم فتح شيفت جديد', 'success');
                } else {
                    console.error('Error creating shift:', createError);
                }
            } catch (e) {
                console.error('Error in shift creation:', e);
            }
        }

        if (shift) {
            currentShift = shift;
            shiftManuallyClosed = false;
            updateShiftIndicator();
            return shift;
        } else {
            currentShift = {
                id: 'temp_' + Date.now(),
                business_id: business.id,
                status: 'open',
                opened_at: new Date().toISOString(),
                opened_by: sanitizeName(currentUser?.name || 'نظام'),
                total_revenue: 0,
                total_expenses: 0,
                total_profit: 0
            };
            console.log('⚠️ Using temporary shift in memory');
            updateShiftIndicator();
            return currentShift;
        }

    } catch (e) {
        console.error('Error in loadOrOpenShift:', e);
        currentShift = {
            id: 'temp_' + Date.now(),
            business_id: business.id,
            status: 'open',
            opened_at: new Date().toISOString(),
            opened_by: sanitizeName(currentUser?.name || 'نظام'),
            total_revenue: 0,
            total_expenses: 0,
            total_profit: 0
        };
        updateShiftIndicator();
        return currentShift;
    }
}

async function closeShift() {
    if (!hasPermission('close_shift') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error');
        return null;
    }
    if (!currentShift?.id) {
        showToast('⚠️ لا يوجد شيفت مفتوح', 'warning');
        return null;
    }

    if (currentShift.id.toString().startsWith('temp_')) {
        showToast('⚠️ هذا شيفت مؤقت، سيتم إنشاء شيفت جديد تلقائياً', 'warning');
        currentShift = null;
        shiftManuallyClosed = true;
        updateShiftIndicator();
        return { revenue: 0, totalExpenses: 0, profit: 0 };
    }

    try {
        const result = await rpcSecureCloseShift();
        showToast(`✅ تم إقفال الشيفت - الإيراد: ${money(result.revenue)}`, 'success');
        currentShift = null;
        shiftManuallyClosed = true;
        updateShiftIndicator();
        renderDashboard();
        renderSettings();
        return result;
    } catch (e) {
        console.error('Error closing shift:', e);
        showToast(t('shift_close_failed'), 'error');
        throw e;
    }
}

async function openCloseShiftSheet() {
    if (!hasPermission('close_shift') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error');
        return;
    }

    if (!currentShift) {
        await loadOrOpenShift();
        if (!currentShift) {
            showToast(t('no_open_shift'), 'warning');
            return;
        }
    }

    if (!supabaseClient) return;

    try {
        const { data: completedOrders } = await supabaseClient
            .from('orders')
            .select('total')
            .eq('business_id', business.id)
            .eq('status', 'paid')
            .gte('created_at', currentShift.opened_at);

        const revenue = (completedOrders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        const { data: expenses } = await supabaseClient
            .from('expenses')
            .select('amount')
            .eq('shift_id', currentShift.id);

        const totalExpenses = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
        const profit = revenue - totalExpenses;

        document.getElementById('closeShiftSummary').innerHTML = `
            <div class="list-row">
                <div class="row-title">📅 تاريخ الفتح</div>
                <div class="row-value mono">${new Date(currentShift.opened_at).toLocaleString()}</div>
            </div>
            <div class="list-row">
                <div class="row-title">👤 فتح بواسطة</div>
                <div class="row-value mono">${escapeHtml(currentShift.opened_by || 'نظام')}</div>
            </div>
            <div class="list-row">
                <div class="row-title">📋 الطلبات المدفوعة</div>
                <div class="row-value mono">${completedOrders?.length || 0}</div>
            </div>
            <div class="list-row">
                <div class="row-title">${t('shift_revenue')}</div>
                <div class="row-value mono" style="color:var(--success);">${money(revenue)}</div>
            </div>
            <div class="list-row">
                <div class="row-title">${t('shift_expenses')}</div>
                <div class="row-value mono" style="color:var(--danger);">${money(totalExpenses)}</div>
            </div>
            <div class="list-row" style="border-bottom: 2px solid var(--primary); padding-bottom: 12px;">
                <div class="row-title" style="font-size:16px; font-weight:800;">${t('shift_profit')}</div>
                <div class="row-value mono" style="font-size:18px; color:var(--primary-dark);">${money(profit)}</div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:8px; text-align:center;">
                ⚠️ تأكد من تحصيل جميع المدفوعات قبل الإقفال
            </div>
        `;

        document.getElementById('confirmCloseShiftBtn').onclick = async function() {
            const btn = this;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإقفال...';
            try {
                await closeShift();
                closeSheet('closeShiftOverlay');
                renderDashboard();
                renderSettings();
                updateShiftIndicator();
            } catch (e) {
                showToast(t('shift_close_failed'), 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = `<span data-i18n="confirm_close">${t('confirm_close')}</span>`;
            }
        };

        openSheet('closeShiftOverlay');
    } catch (e) {
        console.error('Error in openCloseShiftSheet:', e);
        showToast(t('error_general'), 'error');
    }
}

// ============================================================
// SHIFT HISTORY
// ============================================================
async function renderShiftHistoryPage(filter = 'daily') {
    const container = document.getElementById('shiftHistoryListPage');
    if (!container) return;

    if (!supabaseClient || !business) {
        container.innerHTML = `<div class="empty">${t('loading')}</div>`;
        return;
    }

    try {
        let startDate;
        const now = new Date();

        if (filter === 'daily') {
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
        } else if (filter === 'weekly') {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
        } else if (filter === 'monthly') {
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
        } else {
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
        }

        const { data: shifts, error } = await supabaseClient
            .from('shifts')
            .select('*')
            .eq('business_id', business.id)
            .eq('status', 'closed')
            .gte('closed_at', startDate.toISOString())
            .order('closed_at', { ascending: false });

        if (error) throw error;

        if (!shifts || shifts.length === 0) {
            container.innerHTML = `<div class="empty"><i class="fa-solid fa-clock"></i> لا توجد شيفتات ${filter === 'daily' ? 'اليوم' : filter === 'weekly' ? 'هذا الأسبوع' : 'هذا الشهر'}</div>`;
            return;
        }

        container.innerHTML = shifts.map(shift => `
            <div class="shift-card" onclick="viewShiftDetail('${escapeHtml(shift.id)}')">
                <div class="shift-card-header">
                    <div class="shift-card-date">${new Date(shift.closed_at).toLocaleDateString('ar-EG')}</div>
                    <span class="badge badge-gold">${new Date(shift.closed_at).toLocaleTimeString('ar-EG')}</span>
                </div>
                <div class="shift-card-stats">
                    <span>💰 <span class="revenue">${money(shift.total_revenue || 0)}</span></span>
                    <span>📈 ${money(shift.total_profit || 0)}</span>
                    <span>👤 ${escapeHtml(shift.closed_by || 'نظام')}</span>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error('Error loading shift history:', e);
        container.innerHTML = `<div class="empty">⚠️ حدث خطأ في تحميل السجل</div>`;
    }
}

function filterShiftHistory(filter) {
    shiftFilter = filter;
    document.querySelectorAll('#shiftFilterTabs .btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderShiftHistoryPage(filter);
}

// ============================================================
// SHIFT DETAIL
// ============================================================
async function viewShiftDetail(shiftId) {
    if (!supabaseClient || !business || !isValidUuid(shiftId)) return;

    try {
        const { data: shift, error: shiftError } = await supabaseClient
            .from('shifts').select('*').eq('id', shiftId).eq('business_id', business.id).single();

        if (shiftError) throw shiftError;

        const { data: ordersData, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*, order_items(*, menu_items(*))')
            .eq('business_id', business.id)
            .gte('created_at', shift.opened_at)
            .lte('created_at', shift.closed_at || new Date().toISOString())
            .order('created_at', { ascending: true });

        if (ordersError) throw ordersError;

        document.getElementById('shiftDetailDate').textContent = new Date(shift.closed_at).toLocaleDateString('ar-EG');
        document.getElementById('shiftDetailMeta').textContent =
            `🕐 ${new Date(shift.opened_at).toLocaleTimeString('ar-EG')} - ${new Date(shift.closed_at).toLocaleTimeString('ar-EG')} · 👤 ${escapeHtml(shift.closed_by || 'نظام')}`;

        document.getElementById('detailRevenue').textContent = money(shift.total_revenue || 0);
        document.getElementById('detailOrders').textContent = ordersData?.length || 0;

        const uniqueTables = new Set(ordersData?.map(o => o.table_id) || []);
        document.getElementById('detailTables').textContent = uniqueTables.size || 0;

        const ordersContainer = document.getElementById('shiftDetailOrders');

        if (!ordersData || ordersData.length === 0) {
            ordersContainer.innerHTML = `<div class="empty">لا توجد طلبات في هذا الشيفت</div>`;
        } else {
            const tableOrders = {};
            ordersData.forEach(order => {
                if (!tableOrders[order.table_id]) tableOrders[order.table_id] = [];
                tableOrders[order.table_id].push(order);
            });

            const tableIds = Object.keys(tableOrders).filter(isValidUuid);
            const { data: tablesData } = await supabaseClient.from('tables').select('*').in('id', tableIds);

            const tableMap = {};
            (tablesData || []).forEach(t => { tableMap[t.id] = t; });

            ordersContainer.innerHTML = Object.entries(tableOrders).map(([tableId, ords]) => {
                const table = tableMap[tableId];
                const tableNumber = escapeHtml(String(table?.number || '?'));
                const totalForTable = ords.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

                const timeGroups = {};
                ords.forEach(order => {
                    const hour = new Date(order.created_at).getHours();
                    const timeKey = `${hour}:00 - ${hour + 1}:00`;
                    if (!timeGroups[timeKey]) timeGroups[timeKey] = [];
                    timeGroups[timeKey].push(order);
                });

                let timeHtml = '';
                Object.entries(timeGroups).forEach(([timeKey, timeOrders]) => {
                    const items = timeOrders.map(o =>
                        (o.order_items || []).map(item =>
                            `${Number(item.quantity) || 0}× ${escapeHtml(item.menu_items?.name || 'صنف')}`
                        ).join('، ')
                    ).join(' | ');

                    timeHtml += `
                        <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:8px 12px; margin-bottom:6px;">
                            <div style="display:flex; justify-content:space-between; font-size:13px;">
                                <span style="font-weight:700;">🕐 ${escapeHtml(timeKey)}</span>
                                <span style="color:var(--text-muted);">${timeOrders.length} طلبات</span>
                            </div>
                            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                                ${items || 'لا توجد تفاصيل'}
                            </div>
                        </div>
                    `;
                });

                return `
                    <div class="table-order-item">
                        <div class="order-header">
                            <div>
                                <div class="order-table">🪑 طاولة ${tableNumber}</div>
                                <div class="order-time">${ords.length} طلبات · ${money(totalForTable)}</div>
                            </div>
                            <div class="order-total">${money(totalForTable)}</div>
                        </div>
                        <div style="margin-top:8px;">${timeHtml}</div>
                    </div>
                `;
            }).join('');
        }

        navigateTo('view-shift-detail');

    } catch (e) {
        console.error('Error loading shift detail:', e);
        showToast('⚠️ حدث خطأ في تحميل التفاصيل', 'error');
    }
}

// ============================================================
// AUTO REFRESH
// ============================================================
let refreshInterval = null;

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
        const needRefresh = localStorage.getItem('platepro_need_refresh');
        if (needRefresh === 'true') {
            console.log('🔄 New order detected, refreshing data...');
            try {
                await loadActiveOrders();
                await loadTables();
                renderTables();
                renderKitchenOrders();
                renderDashboard();
                try { localStorage.removeItem('platepro_need_refresh'); } catch {}
                showToast('📱 طلب جديد من العميل!', 'info');
            } catch (e) {
                console.error('Error refreshing data:', e);
            }
        }
    }, 3000);
}

// ============================================================
// LOAD ALL DATA
// ============================================================
async function loadAllData() {
    await loadTables();
    await loadActiveOrders();
    await Promise.all([
        loadMenuItems(),
        loadMenuCategories(),
        loadEmployees(),
        loadPaymentMethods()
    ]);
}

// ============================================================
// DATA LOADERS
// ============================================================
async function loadTables() {
    if (!supabaseClient || !business) return;
    let { data } = await supabaseClient.from('tables').select('*').eq('business_id', business.id).order('number');
    if (!data || data.length === 0) {
        const seed = Array.from({ length: 8 }, (_, i) => ({
            business_id: business.id,
            number: i + 1,
            capacity: 4,
            status: 'available'
        }));
        const { data: created } = await supabaseClient.from('tables').insert(seed).select();
        data = created || [];
    }
    tables = data;
}

async function loadMenuItems() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient.from('menu_items').select('*').eq('business_id', business.id).eq('is_active', true).order('sort_order');
    menuItems = data || [];
}

async function loadMenuCategories() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient.from('menu_categories').select('*').eq('business_id', business.id).eq('is_active', true).order('sort_order');
    menuCategories = data || [];
}

async function loadEmployees() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient
        .from('employees_public')
        .select('id, business_id, name, role, permissions, is_active, created_at')
        .eq('business_id', business.id)
        .order('created_at');
    employees = data || [];
}

async function loadPaymentMethods() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient.from('payment_methods').select('*').eq('business_id', business.id).eq('is_active', true);
    if (data && data.length > 0) {
        paymentMethods = data;
        return;
    }
    const defaults = [
        { business_id: business.id, name: 'كاش', icon: 'fa-money-bill-wave', color: 'badge-success' },
        { business_id: business.id, name: 'بطاقة ائتمان', icon: 'fa-credit-card', color: 'badge-gold' },
        { business_id: business.id, name: 'محفظة إلكترونية', icon: 'fa-wallet', color: 'badge-info' }
    ];
    const { data: created } = await supabaseClient.from('payment_methods').insert(defaults).select();
    paymentMethods = created || defaults;
}

async function loadActiveOrders() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('business_id', business.id)
        .in('status', ['pending', 'preparing', 'ready', 'paid'])
        .order('created_at', { ascending: false });

    orders = {};
    (data || []).forEach(order => {
        orders[order.id] = order;
        if (!orderStatus[order.id]) orderStatus[order.id] = order.status || 'pending';
    });
    return data || [];
}

// ============================================================
// DASHBOARD
// ============================================================
async function renderDashboard() {
    const activeOrders = Object.values(orders).filter(o => !['completed', 'cancelled', 'paid'].includes(o.status));
    const occupiedTables = tables.filter(t => ['occupied', 'ready_to_serve'].includes(t.status));
    const availableTables = tables.filter(t => t.status === 'available');

    let revenue = 0;
    let totalExpenses = 0;
    let expensesList = [];

    if (supabaseClient && currentShift && !currentShift.id.toString().startsWith('temp_')) {
        const { data: completedOrders, error: revenueError } = await supabaseClient
            .from('orders')
            .select('total')
            .eq('business_id', business.id)
            .eq('status', 'paid')
            .gte('created_at', currentShift.opened_at);

        if (revenueError) {
            console.error('❌ Error loading revenue:', revenueError.message || revenueError);
        } else {
            revenue = (completedOrders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        }

        const { data: expenses, error: expensesError } = await supabaseClient
            .from('expenses')
            .select('description, amount, created_at')
            .eq('shift_id', currentShift.id)
            .order('created_at', { ascending: false });

        if (expensesError) {
            console.error('❌ Error loading expenses:', expensesError.message || expensesError);
        } else {
            expensesList = expenses || [];
            totalExpenses = expensesList.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        }
    } else if (currentShift && currentShift.id.toString().startsWith('temp_')) {
        console.warn('⚠️ temp shift - revenue/expenses not tracked');
    }

    const canViewRevenue = hasPermission('view_revenue') || currentUser?.type === 'owner';
    const revenueCard = document.querySelector('.stat-card.revenue');
    if (revenueCard) revenueCard.style.display = canViewRevenue ? 'block' : 'none';

    const canViewExpenses = hasPermission('view_expenses') || currentUser?.type === 'owner';
    const expensesCard = document.getElementById('dashExpensesCard');
    const expensesListEl = document.getElementById('dashExpensesList');

    if (expensesCard) expensesCard.style.display = canViewExpenses ? 'block' : 'none';
    if (expensesListEl) {
        const expensesSectionTitle = expensesListEl.previousElementSibling;
        if (!canViewExpenses) {
            expensesListEl.style.display = 'none';
            if (expensesSectionTitle) expensesSectionTitle.style.display = 'none';
        } else {
            expensesListEl.style.display = 'block';
            if (expensesSectionTitle) expensesSectionTitle.style.display = 'block';
            expensesListEl.innerHTML = expensesList.length
                ? expensesList.map(e => `
                    <div class="list-row">
                        <div class="row-title">${escapeHtml(e.description || '-')}</div>
                        <div class="row-value mono" style="color:var(--danger);">${money(Number(e.amount) || 0)}</div>
                    </div>
                `).join('')
                : `<div class="empty" style="padding:12px;">${t('no_expenses')}</div>`;
        }
    }

    document.getElementById('dashRevenue').textContent = money(revenue);
    document.getElementById('dashExpenses').textContent = money(totalExpenses);
    document.getElementById('dashActiveOrders').textContent = activeOrders.length;
    document.getElementById('dashOccupiedTables').textContent = occupiedTables.length;
    document.getElementById('dashAvailableTables').textContent = availableTables.length;
}

// ============================================================
// TABLES
// ============================================================
async function renderTables() {
    const grid = document.getElementById('tablesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const table of tables) {
        try {
            const activeOrder = Object.values(orders).find(o =>
                o.table_id === table.id && !['completed', 'cancelled', 'paid'].includes(o.status)
            );

            let finalStatus = table.status;

            if (activeOrder) {
                finalStatus = activeOrder.status === 'ready' ? 'ready_to_serve' : 'occupied';
                if (table.status !== finalStatus) {
                    await supabaseClient.from('tables').update({ status: finalStatus }).eq('id', table.id);
                    table.status = finalStatus;
                }
            } else if (['occupied', 'ready_to_serve'].includes(table.status)) {
                finalStatus = 'available';
                await supabaseClient.from('tables').update({ status: 'available' }).eq('id', table.id);
                table.status = 'available';
            } else if (table.status === 'reserved') {
                finalStatus = 'reserved';
            }

            const statusMap = {
                available: { label: t('available'), class: 'available' },
                occupied: { label: t('occupied'), class: 'occupied' },
                reserved: { label: t('reserved'), class: 'reserved' },
                ready_to_serve: { label: t('ready_to_serve'), class: 'ready_to_serve' }
            };

            const s = statusMap[finalStatus] || statusMap.available;

            const card = document.createElement('div');
            card.className = `table-card ${s.class}`;
            card.onclick = () => openTableSheet(table.id);

            const badge = finalStatus !== 'available'
                ? `<span class="table-badge ${finalStatus === 'ready_to_serve' ? 'badge-ready-table' : ''}">${escapeHtml(s.label)}</span>`
                : '';

            card.innerHTML = `${badge}<div class="table-num">${escapeHtml(String(table.number))}</div>
                <div class="table-status">${escapeHtml(s.label)}</div>
                <div class="table-capacity">${Number(table.capacity) || 4} ${t('persons')}</div>`;
            grid.appendChild(card);
        } catch (error) {
            console.error('Error rendering table:', error);
        }
    }
}

// ============================================================
// KITCHEN
// ============================================================
function renderKitchenOrders() {
    const isChef = currentUser?.role === 'chef' || currentUser?.type === 'owner' || hasPermission('orders');

    const el = document.getElementById('kitchenOrdersList');
    if (!el) return;

    if (!isChef) {
        el.innerHTML = `<div class="empty"><i class="fa-solid fa-lock"></i>${t('error_permission')}</div>`;
        return;
    }

    const kitchenOrders = Object.values(orders).filter(o => ['pending', 'preparing'].includes(o.status));

    if (kitchenOrders.length === 0) {
        el.innerHTML = `<div class="empty"><i class="fa-solid fa-utensils"></i>${t('no_kitchen_orders')}</div>`;
        return;
    }

    el.innerHTML = kitchenOrders.map(order => {
        const table = tables.find(t => t.id === order.table_id);
        const orderItems = order.order_items || [];
        const itemCount = orderItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

        let itemsPreview = '';
        if (orderItems.length > 0) {
            itemsPreview = orderItems.slice(0, 3).map(item =>
                `${Number(item.quantity) || 0}× ${escapeHtml(item.menu_items?.name || t('default_item'))}`
            ).join('، ');
            if (orderItems.length > 3) itemsPreview += ` +${orderItems.length - 3} ${t('more')}`;
        }
        const hasNotes = orderItems.some(item => item.notes);

        const statusLabelMap = { pending: t('pending'), preparing: t('preparing') };
        const statusBadge = order.status === 'pending' ? 'badge-warning' : 'badge-info';

        return `<div class="list-row" onclick="viewKitchenOrder('${escapeHtml(order.id)}')" style="cursor:pointer; border-bottom:2px solid var(--border); padding:14px 4px;">
            <div>
                <div class="row-title" style="font-size:16px;">${t('table')} ${escapeHtml(String(table?.number || '?'))} ${hasNotes ? '📝' : ''}</div>
                <div class="row-sub">${itemCount} ${t('items')} · ${itemsPreview}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                <span class="badge ${statusBadge}">${statusLabelMap[order.status] || escapeHtml(order.status)}</span>
                <span style="font-size:11px; color:var(--text-muted);">${new Date(order.created_at).toLocaleTimeString()}</span>
            </div>
        </div>`;
    }).join('');
}

// ============================================================
// VIEW KITCHEN ORDER
// ============================================================
async function viewKitchenOrder(orderId) {
    if (!isValidUuid(orderId)) return;
    window._activeKitchenOrderId = orderId;
    const order = Object.values(orders).find(o => o.id === orderId);
    if (!order) return;

    const { data: items } = await supabaseClient
        .from('order_items')
        .select('*, menu_items(*)')
        .eq('order_id', orderId);

    const table = tables.find(t => t.id === order.table_id);
    const body = document.getElementById('kitchenOrderBody');
    if (!body) return;

    let itemsHtml = '';
    if (items && items.length > 0) {
        itemsHtml = items.map(item =>
            `<div class="order-item" style="padding:8px 0;">
                <div>
                    <div class="item-name" style="font-size:16px;">${escapeHtml(item.menu_items?.name || t('default_item'))}</div>
                    <div class="item-details" style="font-size:14px; color:var(--text-secondary);">${Number(item.quantity) || 0} ×</div>
                    ${item.notes ? `<div class="item-note-display item-note-kitchen">📝 ${escapeHtml(item.notes)}</div>` : ''}
                </div>
            </div>`
        ).join('');
    }

    let actionButtons = '';
    if (order.status === 'pending') {
        actionButtons = `<button class="btn btn-primary btn-block" onclick="startPreparing('${escapeHtml(orderId)}')"><i class="fa-solid fa-utensils"></i> ${t('start_preparing')}</button>`;
    } else if (order.status === 'preparing') {
        actionButtons = `<button class="btn btn-success btn-block" onclick="markAsReady('${escapeHtml(orderId)}')"><i class="fa-solid fa-check"></i> ${t('ready_for_delivery')}</button>`;
    }

    body.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span class="badge badge-gold" style="font-size:14px;">${t('table')} ${escapeHtml(String(table?.number || '?'))}</span>
        <span class="badge ${order.status === 'pending' ? 'badge-warning' : 'badge-info'}" style="font-size:14px;">${order.status === 'pending' ? t('pending') : t('preparing')}</span>
    </div>
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px;">${itemsHtml}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${actionButtons}
        <button class="btn btn-ghost" style="flex:1;" onclick="closeSheet('kitchenOrderOverlay')">${t('close')}</button>
    </div>`;

    openSheet('kitchenOrderOverlay');
}

// ============================================================
// ORDER WORKFLOW
// ============================================================
async function startPreparing(orderId) {
    if (!isValidUuid(orderId)) { showToast(t('error_general'), 'error'); return; }
    if (currentUser?.role !== 'chef' && currentUser?.type !== 'owner' && !hasPermission('orders')) {
        showToast(t('error_permission'), 'error'); return;
    }
    try {
        await rpcSecureUpdateOrderStatus(orderId, 'preparing');
        orderStatus[orderId] = 'preparing';
        showToast(t('preparing_started'), 'info');
        await loadActiveOrders();
        renderKitchenOrders();
        renderTables();
        renderDashboard();
        closeSheet('kitchenOrderOverlay');
    } catch (e) {
        console.error(e);
        showToast(t('error_general'), 'error');
    }
}

async function markAsReady(orderId) {
    if (!isValidUuid(orderId)) { showToast(t('error_general'), 'error'); return; }
    if (currentUser?.role !== 'chef' && currentUser?.type !== 'owner' && !hasPermission('orders')) {
        showToast(t('error_permission'), 'error'); return;
    }
    try {
        await rpcSecureUpdateOrderStatus(orderId, 'ready');
        orderStatus[orderId] = 'ready';

        const order = Object.values(orders).find(o => o.id === orderId);
        const table = tables.find(t => t.id === order?.table_id);

        showToast(`✅ تم تجهيز طلب طاولة ${escapeHtml(String(table?.number || '?'))}`, 'success');

        await loadActiveOrders();
        renderKitchenOrders();
        renderTables();
        renderDashboard();
        closeSheet('kitchenOrderOverlay');

    } catch (e) {
        console.error(e);
        showToast(t('error_general'), 'error');
    }
}

// ============================================================
// TABLE SHEET
// ============================================================
function openTableSheet(tableId) {
    if (!isValidUuid(tableId)) return;
    window._activeTableId = tableId;
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const activeOrder = Object.values(orders).find(o =>
        o.table_id === tableId && !['completed', 'cancelled', 'paid'].includes(o.status)
    );

    if (!activeOrder) {
        if (!hasPermission('create_orders')) {
            showToast(t('error_permission'), 'error');
            return;
        }

        if (['occupied', 'ready_to_serve'].includes(table.status)) {
            supabaseClient.from('tables').update({ status: 'available' }).eq('id', tableId).then(() => {}, () => {});
            table.status = 'available';
        }

        document.getElementById('tableSheetTitle').textContent = `${t('table')} ${table.number} (${table.capacity || 4} ${t('persons')})`;
        const body = document.getElementById('tableSheetBody');

        body.innerHTML = `<div class="section-title">${t('menu')}</div>
            <div class="menu-quick-add" id="menuItemsForTable">
                ${menuItems.length === 0 ? '<div class="empty" style="padding:10px;">' + t('no_items') + '</div>' : ''}
            </div>
            <div id="tableOrderItems"></div>
            <div style="display:flex;gap:8px;margin-top:12px;">
                <button class="btn btn-primary" style="flex:1;" onclick="createOrder('${escapeHtml(tableId)}')"><i class="fa-solid fa-check"></i> ${t('confirm_order')}</button>
                <button class="btn btn-ghost" style="flex:1;" onclick="closeSheet('tableOverlay')">${t('cancel')}</button>
            </div>
            <div class="error-text" id="tableSheetError"></div>`;

        const menuContainer = document.getElementById('menuItemsForTable');
        if (menuItems.length > 0 && menuContainer) {
            menuItems.slice(0, 12).forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline btn-sm';
                btn.textContent = `${item.name} ${money(item.price)}`;
                btn.onclick = () => addItemToOrder(item);
                menuContainer.appendChild(btn);
            });
        }

        _orderItems = [];
        renderTableOrderItems();
        openSheet('tableOverlay');
        return;
    }

    const status = orderStatus[activeOrder.id] || activeOrder.status || 'pending';
    const isReady = status === 'ready';
    const isPaid = status === 'paid';

    const subtotal = Number(activeOrder.subtotal) || Number(activeOrder.total) || 0;
    const serviceFee = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + serviceFee) * (vatPercent / 100);
    const total = subtotal + serviceFee + vat;

    let actionButtons = '';
    const isCashier = currentUser?.role === 'cashier' || currentUser?.type === 'owner' || hasPermission('payment');

    if (isReady && !isPaid && isCashier) {
        if (hasPermission('print_receipt')) {
            actionButtons = `<button class="btn btn-success" style="flex:1;" onclick="printReceipt('${escapeHtml(activeOrder.id)}')"><i class="fa-solid fa-print"></i> ${t('print_receipt')}</button>
                <button class="btn btn-primary" style="flex:1;" onclick="showPaymentSheet('${escapeHtml(activeOrder.id)}')"><i class="fa-solid fa-credit-card"></i> ${t('payment')}</button>`;
        } else {
            actionButtons = `<button class="btn btn-ghost" style="flex:1;" disabled><i class="fa-solid fa-print"></i> ${t('error_permission')}</button>
                <button class="btn btn-primary" style="flex:1;" onclick="showPaymentSheet('${escapeHtml(activeOrder.id)}')"><i class="fa-solid fa-credit-card"></i> ${t('payment')}</button>`;
        }
    } else if (isPaid) {
        actionButtons = `<button class="btn btn-success" style="flex:1;" disabled><i class="fa-solid fa-check"></i> ${t('paid')}</button>`;
    } else if (!isReady && !isPaid) {
        if (currentUser?.role === 'chef' || currentUser?.type === 'owner' || hasPermission('orders')) {
            actionButtons = `<button class="btn btn-primary" style="flex:1;" onclick="startPreparing('${escapeHtml(activeOrder.id)}')"><i class="fa-solid fa-utensils"></i> ${t('start_preparing')}</button>`;
        } else {
            actionButtons = `<button class="btn btn-ghost" style="flex:1;" disabled><i class="fa-solid fa-clock"></i> ${t('pending')}</button>`;
        }
    }

    const statusBadgeMap = {
        pending: 'badge-warning',
        preparing: 'badge-info',
        ready: 'badge-ready-table',
        paid: 'badge-paid',
        cancelled: 'badge-cancelled'
    };
    const statusLabelMap = {
        pending: t('pending'),
        preparing: t('preparing'),
        ready: t('ready_to_serve'),
        paid: t('paid'),
        cancelled: t('cancelled')
    };

    document.getElementById('tableSheetTitle').textContent = `${t('table')} ${table.number} (${table.capacity || 4} ${t('persons')})`;
    const body = document.getElementById('tableSheetBody');

    body.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span class="badge badge-gold">${t('order')} #${escapeHtml(activeOrder.id.slice(0, 8))}</span>
        <span class="badge ${statusBadgeMap[status] || 'badge-warning'}">${statusLabelMap[status] || escapeHtml(status)}</span>
    </div>
    <div id="orderItemsList"><div class="empty" style="padding:10px;">${t('loading')}</div></div>

    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 14px;margin:8px 0;">
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:var(--text-secondary);">
            <span>${t('subtotal')}</span>
            <span>${money(subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:var(--text-secondary);">
            <span>${t('service_fee')} (${serviceFeePercent}%)</span>
            <span>${money(serviceFee)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:var(--text-secondary);">
            <span>${t('vat')} (${vatPercent}%)</span>
            <span>${money(vat)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0 0 0;border-top:2px solid var(--border);font-weight:700;font-size:16px;color:var(--text-primary);">
            <span>${t('total')}</span>
            <span style="color:var(--primary-dark);">${money(total)}</span>
        </div>
    </div>

    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        ${actionButtons}
        <button class="btn btn-ghost" style="flex:1;" onclick="closeSheet('tableOverlay')">${t('back')}</button>
    </div>
    <div class="error-text" id="tableSheetError"></div>`;

    loadOrderItems(activeOrder.id);
    openSheet('tableOverlay');
}

async function loadOrderItems(orderId) {
    if (!isValidUuid(orderId)) return;
    const container = document.getElementById('orderItemsList');
    if (!container) return;
    try {
        const { data: items } = await supabaseClient
            .from('order_items')
            .select('*, menu_items(*)')
            .eq('order_id', orderId);

        if (!items || items.length === 0) {
            container.innerHTML = `<div class="empty" style="padding:10px;">${t('no_items')}</div>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="order-item" style="padding:8px 0; border-bottom:1px solid var(--border);">
                <div style="flex:1;">
                    <div class="item-name">${escapeHtml(item.menu_items?.name || t('default_item'))}</div>
                    <div class="item-details">${Number(item.quantity) || 0} × ${money(item.unit_price)}</div>
                    ${item.notes ? `<div class="item-note-display">📝 ${escapeHtml(item.notes)}</div>` : ''}
                </div>
                <div class="item-price">${money(item.total)}</div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = `<div class="empty">${t('error_general')}</div>`;
    }
}

// ============================================================
// ORDER CREATION
// ============================================================
function addItemToOrder(item) {
    if (!item || !item.id) return;
    const existing = _orderItems.find(i => i.menu_item_id === item.id && !i.note);
    if (existing) {
        if (existing.quantity >= MAX_QUANTITY_PER_ITEM) {
            showToast(t('invalid_quantity'), 'error'); return;
        }
        existing.quantity += 1;
        existing.total = existing.quantity * existing.unit_price;
    } else {
        if (_orderItems.length >= MAX_ITEMS_PER_ORDER) {
            showToast(t('too_many_items'), 'error'); return;
        }
        _orderItems.push({
            menu_item_id: item.id,
            name: item.name,
            unit_price: item.price,
            quantity: 1,
            total: item.price,
            note: ''
        });
    }
    renderTableOrderItems();
    showToast(t('item_added_to_order', { name: escapeHtml(item.name) }), 'success');
}

function updateTableOrderItemNote(index, value) {
    const item = _orderItems[index];
    if (!item) return;
    item.note = sanitizeNote(value);
}

function addTableOrderItem(index) {
    const item = _orderItems[index];
    if (!item) return;
    if (item.quantity >= MAX_QUANTITY_PER_ITEM) {
        showToast(t('invalid_quantity'), 'error'); return;
    }
    item.quantity += 1;
    item.total = item.quantity * item.unit_price;
    renderTableOrderItems();
}

function removeTableOrderItem(index) {
    const item = _orderItems[index];
    if (!item) return;
    if (item.quantity > 1) {
        item.quantity -= 1;
        item.total = item.quantity * item.unit_price;
    } else {
        _orderItems.splice(index, 1);
    }
    renderTableOrderItems();
}

function renderTableOrderItems() {
    const container = document.getElementById('tableOrderItems');
    if (!container) return;

    if (_orderItems.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:12px;">لم يتم إضافة أي صنف</div>';
        return;
    }

    const total = _orderItems.reduce((sum, i) => sum + i.total, 0);
    container.innerHTML = `${_orderItems.map((item, index) =>
        `<div class="order-item">
            <div style="flex:1;">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-details">
                    ${item.quantity} × ${money(item.unit_price)}
                    <button class="btn btn-xs" style="background:var(--danger);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:8px;" onclick="removeTableOrderItem(${index})"><i class="fa-solid fa-minus"></i></button>
                    <button class="btn btn-xs" style="background:var(--success);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;" onclick="addTableOrderItem(${index})"><i class="fa-solid fa-plus"></i></button>
                </div>
                <input type="text" class="item-note-input" maxlength="${MAX_NOTE_LENGTH}" placeholder="📝 ${t('item_note_placeholder')}" value="${escapeHtml(item.note || '')}" oninput="updateTableOrderItemNote(${index}, this.value)">
            </div>
            <div class="item-price">${money(item.total)}</div>
        </div>`
    ).join('')}
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid var(--border);margin-top:8px;font-weight:700;font-size:16px;">
        <span>${t('subtotal')}</span>
        <span style="color:var(--primary-dark);">${money(total)}</span>
    </div>`;
}

// ============================================================
// CREATE ORDER (secure via RPC)
// ============================================================
async function createOrder(tableId) {
    const errEl = document.getElementById('tableSheetError');
    if (errEl) errEl.textContent = '';

    if (!hasPermission('create_orders')) {
        if (errEl) errEl.textContent = t('error_permission');
        return;
    }

    if (!isValidUuid(tableId)) { if (errEl) errEl.textContent = t('error_general'); return; }
    if (!_orderItems.length) { if (errEl) errEl.textContent = t('error_no_items'); return; }
    if (_orderItems.length > MAX_ITEMS_PER_ORDER) { if (errEl) errEl.textContent = t('too_many_items'); return; }

    for (const it of _orderItems) {
        if (!isValidUuid(it.menu_item_id)) { if (errEl) errEl.textContent = t('error_general'); return; }
        if (!Number.isInteger(it.quantity) || it.quantity <= 0 || it.quantity > MAX_QUANTITY_PER_ITEM) {
            if (errEl) errEl.textContent = t('invalid_quantity');
            return;
        }
    }

    const btn = document.querySelector('#tableOverlay .btn-primary');
    if (btn) btn.disabled = true;

    try {
        const result = await rpcSecureCreateOrder({
            business_id: business.id,
            table_id: tableId,
            order_type: 'dine_in',
            notes: 'طلب من الكاشير',
            items: _orderItems.map(i => ({
                menu_item_id: i.menu_item_id,
                quantity: i.quantity,
                note: sanitizeNote(i.note)
            }))
        });

        if (!result || !result.success) {
            if (result?.error === 'TABLE_UNAVAILABLE' && errEl) {
                errEl.textContent = t('table_unavailable');
            } else {
                throw new Error('ORDER_FAILED');
            }
            return;
        }

        showToast(t('order_created'), 'success');
        closeSheet('tableOverlay');
        _orderItems = [];
        await loadActiveOrders();
        await loadTables();
        renderTables();
        renderKitchenOrders();
        renderDashboard();
    } catch (e) {
        console.error(e);
        if (errEl) errEl.textContent = t('error_general');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ============================================================
// PAYMENT & RECEIPT
// ============================================================
function showPaymentSheet(orderId) {
    if (!isValidUuid(orderId)) return;
    window._activePaymentOrderId = orderId;
    if (!hasPermission('payment') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error'); return;
    }
    const container = document.getElementById('paymentMethodsList');
    if (!container) return;

    if (paymentMethods.length === 0) {
        container.innerHTML = `<div class="empty">${t('payment_methods')}</div>`;
    } else {
        container.innerHTML = paymentMethods.map(pm => `
            <button class="btn btn-outline btn-block" style="margin-bottom:8px; justify-content:flex-start;" onclick="selectPaymentMethod('${escapeHtml(pm.id)}')">
                <i class="fa-solid ${escapeHtml(pm.icon || 'fa-money-bill')}"></i>
                <span style="margin-right:8px;">${escapeHtml(pm.name)}</span>
            </button>
        `).join('');
    }
    openSheet('paymentOverlay');
}

function selectPaymentMethod(pmId) {
    if (!isValidUuid(pmId)) return;
    selectedPaymentMethod = pmId;
    confirmPayment();
}

async function confirmPayment() {
    const orderId = window._activePaymentOrderId;
    if (!isValidUuid(orderId) || !isValidUuid(selectedPaymentMethod)) {
        showToast(t('payment_failed'), 'error'); return;
    }
    try {
        const { error } = await supabaseClient.rpc('pay_order_secure', {
            p_order_id: orderId,
            p_payment_method_id: selectedPaymentMethod
        });
        if (error) throw error;
        showToast(t('payment_success'), 'success');
        closeSheet('paymentOverlay');
        closeSheet('tableOverlay');
        await loadActiveOrders();
        await loadTables();
        renderTables();
        renderKitchenOrders();
        renderDashboard();
    } catch (e) {
        console.error(e);
        showToast(t('payment_failed'), 'error');
    }
}

function printReceipt(orderId) {
    if (!isValidUuid(orderId)) return;
    if (!hasPermission('print_receipt') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error'); return;
    }
    const order = Object.values(orders).find(o => o.id === orderId);
    if (!order) return;
    const table = tables.find(t => t.id === order.table_id);
    const subtotal = Number(order.subtotal) || Number(order.total) || 0;
    const serviceFee = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + serviceFee) * (vatPercent / 100);
    const total = subtotal + serviceFee + vat;

    const win = window.open('', '_blank', 'width=400,height=600');
    if (!win) { showToast(t('error_general'), 'error'); return; }
    win.document.write(`
        <html dir="rtl"><head><title>Receipt</title>
        <style>body{font-family:Arial;padding:16px;} h2{text-align:center;} table{width:100%;} .total{font-weight:bold;border-top:1px solid #000;padding-top:8px;}</style>
        </head><body>
        <h2>${escapeHtml(business?.name || '')}</h2>
        <div>طاولة: ${escapeHtml(String(table?.number || '?'))}</div>
        <div>طلب: #${escapeHtml(orderId.slice(0, 8))}</div>
        <hr>
        <div>المجموع: ${money(subtotal)}</div>
        <div>رسوم الخدمة (${serviceFeePercent}%): ${money(serviceFee)}</div>
        <div>ضريبة (${vatPercent}%): ${money(vat)}</div>
        <div class="total">الإجمالي: ${money(total)}</div>
        </body></html>
    `);
    win.document.close();
    win.print();
}

// ============================================================
// EXPENSE
// ============================================================
function openExpenseSheet() {
    if (!hasPermission('add_expense') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error'); return;
    }
    document.getElementById('expenseDesc').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseError').textContent = '';
    openSheet('expenseOverlay');
}

async function addExpense() {
    if (!hasPermission('add_expense') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error'); return;
    }
    const desc = sanitizeNote(document.getElementById('expenseDesc').value);
    const amount = Number(document.getElementById('expenseAmount').value);
    const errEl = document.getElementById('expenseError');
    errEl.textContent = '';

    if (!desc) { errEl.textContent = '⚠️ أدخل وصف المصروف'; return; }
    if (!isFinite(amount) || amount <= 0 || amount > MAX_EXPENSE_AMOUNT) {
        errEl.textContent = t('invalid_amount'); return;
    }

    try {
        await rpcSecureAddExpense(desc, amount);
        closeSheet('expenseOverlay');
        showToast(t('expense_added'), 'success');
        document.getElementById('expenseDesc').value = '';
        document.getElementById('expenseAmount').value = '';
        renderDashboard();
    } catch (e) {
        console.error(e);
        errEl.textContent = t('error_general');
    }
}

// ============================================================
// MENU MANAGEMENT
// ============================================================
function renderMenuView() {
    const container = document.getElementById('menuList');
    if (!container) return;

    if (!menuItems || menuItems.length === 0) {
        container.innerHTML = `<div class="empty">${t('no_items')}</div>`;
        return;
    }

    container.innerHTML = menuItems.map(item => `
        <div class="list-row">
            <div>
                <div class="row-title">${escapeHtml(item.name)}</div>
                <div class="row-sub">${escapeHtml(item.description || '')}</div>
            </div>
            <div class="row-value mono">${money(item.price)}</div>
        </div>
    `).join('');
}

function renderMenuManagement() {
    const container = document.getElementById('menuManagementList');
    if (!container) return;
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') {
        container.innerHTML = `<div class="empty">${t('error_permission')}</div>`;
        return;
    }
    if (!menuItems || menuItems.length === 0) {
        container.innerHTML = `<div class="empty">${t('no_items')}</div>`;
        return;
    }
    container.innerHTML = menuItems.map(item => `
        <div class="list-row">
            <div>
                <div class="row-title">${escapeHtml(item.name)}</div>
                <div class="row-sub">${money(item.price)}</div>
            </div>
            <button class="btn btn-ghost btn-xs" onclick="deleteMenuItem('${escapeHtml(item.id)}')"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

async function deleteMenuItem(itemId) {
    if (!isValidUuid(itemId)) return;
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error'); return;
    }
    try {
        const { error } = await supabaseClient.from('menu_items').update({ is_active: false }).eq('id', itemId).eq('business_id', business.id);
        if (error) throw error;
        await loadMenuItems();
        renderMenuView();
        renderMenuManagement();
        showToast(t('item_deleted'), 'success');
    } catch (e) {
        console.error(e);
        showToast(t('error_general'), 'error');
    }
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
    const bizName = document.getElementById('settingsBizName');
    const bizCode = document.getElementById('settingsBizCode');
    if (bizName) bizName.textContent = business?.name || '';
    if (bizCode) bizCode.textContent = business?.code || '';

    const empList = document.getElementById('employeesList');
    if (empList) {
        if (!hasPermission('settings') && currentUser?.type !== 'owner') {
            empList.innerHTML = `<div class="empty">${t('error_permission')}</div>`;
        } else if (!employees || employees.length === 0) {
            empList.innerHTML = `<div class="empty">${t('no_employees')}</div>`;
        } else {
            empList.innerHTML = employees.map(e => `
                <div class="list-row">
                    <div>
                        <div class="row-title">${escapeHtml(e.name)}</div>
                        <div class="row-sub">${escapeHtml(e.role || '')}</div>
                    </div>
                    <span class="badge ${e.is_active ? 'badge-success' : 'badge-cancelled'}">${e.is_active ? t('active') : t('inactive')}</span>
                </div>
            `).join('');
        }
    }

    const pmList = document.getElementById('paymentMethodsListSettings');
    if (pmList) {
        if (!paymentMethods || paymentMethods.length === 0) {
            pmList.innerHTML = `<div class="empty">${t('payment_methods')}</div>`;
        } else {
            pmList.innerHTML = paymentMethods.map(pm => `
                <div class="list-row">
                    <div class="row-title"><i class="fa-solid ${escapeHtml(pm.icon || 'fa-money-bill')}"></i> ${escapeHtml(pm.name)}</div>
                </div>
            `).join('');
        }
    }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // init audio on first click (required by browsers)
    document.body.addEventListener('click', function once() {
        initAudio();
        document.body.removeEventListener('click', once);
    }, { once: true });

    initCustomerPage();
});
