// ============================================================
// app.js - Plate Pro (نسخة آمنة + مختصرة بدون فقدان وظيفة)
// ============================================================

const supabaseClient = window.supabaseClient;

if (!supabaseClient) {
    console.error('❌ supabaseClient is not defined! Check config.js loading order.');
    document.addEventListener('DOMContentLoaded', function () {
        const errEl = document.getElementById('setupError');
        if (errEl) errEl.textContent = '⚠️ خطأ في تحميل الاتصال بقاعدة البيانات. تأكد من اتصال الإنترنت.';
    });
} else {
    console.log('✅ supabaseClient is ready in app.js');
}

// ============================================================
// TRANSLATIONS
// ============================================================
let currentLang = 'ar';

const translations = {
    ar: {
        'platepro': '✦ PLATE PRO ✦', 'welcome': 'مرحباً بك', 'business_code': 'كود النشاط التجاري',
        'continue': 'متابعة', 'back': 'رجوع', 'save': 'حفظ', 'cancel': 'إلغاء', 'close': 'إغلاق',
        'delete': 'حذف', 'edit': 'تعديل', 'add': 'إضافة',
        'today_performance': '📊 أداء اليوم', 'today_revenue': '💰 إيراد اليوم',
        'active_orders': '📋 الطلبات النشطة', 'occupied_tables': '🪑 طاولات مشغولة',
        'available_tables': '🟢 طاولات متاحة', 'quick_actions': '⚡ إجراءات سريعة',
        'add_expense': 'إضافة مصروف', 'close_shift': 'إقفال الشيفت', 'open_new_shift': 'فتح شيفت جديد',
        'scan_order': '📱 امسح واطلب من مكانك', 'all': '🍽️ الكل', 'cart': '🛒 سلة الطلبات',
        'empty_cart': 'السلة فارغة', 'subtotal': 'المجموع', 'service_fee': 'رسوم الخدمة',
        'vat': 'ضريبة القيمة المضافة', 'total': 'الإجمالي', 'confirm_order': 'تأكيد الطلب',
        'pending': '⏳ قيد الانتظار', 'preparing': '🔪 قيد التحضير', 'ready': '✅ جاهز للتسليم',
        'paid': '💳 مدفوع', 'cancelled': '❌ ملغي', 'order': 'طلب', 'table': 'طاولة',
        'print_receipt': '🖨️ طباعة الوصل', 'print': 'طباعة', 'payment': '💳 الدفع',
        'select_payment': 'اختر طريقة الدفع', 'available': '🟢 متاحة', 'occupied': '🟡 مشغولة',
        'reserved': '🔵 محجوزة', 'active': '✅ نشط', 'inactive': '⛔ موقف',
        'waiter': 'نادل', 'chef': 'طباخ', 'cashier': 'كاشير', 'admin': 'أدمن',
        'settings': '⚙️ الإعدادات', 'appearance': '🎨 المظهر', 'dark': '🌙 داكن', 'light': '☀️ فاتح',
        'logo': '🖼️ الشعار', 'fees': '💰 الرسوم والضرائب',
        'service_fee_label': 'رسوم الخدمة', 'vat_label': 'ضريبة القيمة المضافة (VAT)',
        'payment_methods': '💳 طرق الدفع', 'employees': '👥 الموظفين', 'switch_business': '🔄 تبديل النشاط',
        'edit_fees': 'تعديل الرسوم', 'edit_logo': 'تعديل الشعار', 'no_logo': 'لا يوجد شعار',
        'remove_logo': 'حذف الشعار', 'save_logo': 'حفظ الشعار', 'upload_logo': 'اختر صورة الشعار',
        'menu': '🍽️ المنيو', 'manage_menu': '⚙️ إدارة المنيو', 'add_item': 'إضافة صنف',
        'add_category': 'إضافة تصنيف', 'item_name': 'اسم الصنف', 'item_price': 'السعر',
        'item_desc': 'الوصف', 'item_image': 'صورة الصنف', 'category': 'التصنيف',
        'no_items': 'مفيش أصناف', 'no_categories': 'مفيش تصنيفات', 'no_employees': 'مفيش موظفين',
        'qr_code': '📱 طلب من العميل', 'qr_label': 'QR Code الطاولات',
        'qr_sub': 'امسح للطلب من المنيو مباشرة', 'show_qr': 'عرض QR', 'download_qr': 'تحميل QR',
        'scan_qr': 'امسح الكود لفتح منيو العميل', 'expense_desc': 'الوصف', 'expense_amount': 'المبلغ',
        'add_expense_title': 'إضافة مصروف', 'close_shift_title': 'تأكيد إقفال الشيفت',
        'shift_revenue': 'الإيراد', 'shift_expenses': 'المصروفات', 'today_expenses': '💸 مصروفات اليوم',
        'no_expenses': 'لا يوجد مصروفات في هذا الشيفت', 'shift_profit': 'الصافي',
        'confirm_close': 'تأكيد الإقفال', 'no_open_shift': 'لا يوجد شيفت مفتوح',
        'permissions': '🔐 الصلاحيات', 'perm_dashboard': '👀 الرئيسية', 'perm_tables': '🪑 الطاولات',
        'perm_orders': '📋 الطلبات', 'perm_menu': '🍽️ المنيو', 'perm_settings': '⚙️ الإعدادات',
        'perm_create_orders': '🛒 إنشاء طلبات', 'perm_add_expense': '💰 إضافة مصروف',
        'perm_close_shift': '🔒 إقفال الشيفت', 'perm_print_receipt': '🧾 طباعة الفواتير',
        'perm_manage_menu': '📝 إدارة المنيو', 'perm_view_revenue': '💰 مشاهدة الإيراد',
        'perm_view_expenses': '📊 مشاهدة المصروفات',
        'employee_name': 'الاسم', 'employee_pin': 'PIN (4 أرقام)', 'employee_role': 'الدور',
        'add_employee': 'إضافة موظف', 'edit_employee': 'تعديل موظف',
        'payment_method_name': 'اسم طريقة الدفع', 'payment_method_icon': 'الأيقونة',
        'add_payment_method': 'إضافة طريقة دفع', 'edit_payment_method': 'تعديل طريقة دفع',
        'cash': 'كاش', 'card': 'بطاقة', 'wallet': 'محفظة', 'mobile_wallet': 'محفظة إلكترونية',
        'bank_transfer': 'تحويل بنكي', 'category_name': 'اسم التصنيف', 'category_icon': 'الأيقونة',
        'add_category_title': 'إضافة تصنيف', 'order_created': '✅ تم إنشاء الطلب بنجاح!',
        'order_updated': '✅ تم تحديث حالة الطلب', 'payment_success': '✅ تم الدفع بنجاح!',
        'payment_failed': '❌ فشل الدفع', 'expense_added': '✅ تم تسجيل المصروف',
        'shift_closed': '✅ تم إقفال الشيفت', 'shift_close_failed': '❌ فشل إقفال الشيفت',
        'item_added': '✅ تم إضافة الصنف', 'item_updated': '✅ تم تحديث الصنف',
        'item_deleted': '✅ تم حذف الصنف', 'category_added': '✅ تم إضافة التصنيف',
        'payment_method_added': '✅ تم إضافة طريقة الدفع', 'employee_added': '✅ تم إضافة الموظف',
        'employee_updated': '✅ تم تحديث الموظف', 'employee_deleted': '✅ تم حذف الموظف',
        'logo_saved': '✅ تم حفظ الشعار', 'logo_deleted': '✅ تم حذف الشعار',
        'fees_saved': '✅ تم حفظ الإعدادات', 'error_general': '⚠️ حدث خطأ، حاول تاني',
        'error_connection': '⚠️ حصل خطأ في الاتصال', 'error_invalid_code': '⚠️ كود النشاط غير صحيح',
        'error_invalid_pin': '⚠️ PIN غير صحيح', 'error_no_items': '⚠️ أضف صنف واحد على الأقل',
        'error_no_tables': '⚠️ مفيش طاولات متاحة', 'error_permission': '⛔ ليس لديك صلاحية',
        'error_upload': '⚠️ فشل رفع الصورة', 'error_too_many_attempts': '⚠️ محاولات كثيرة — استنى دقيقة',
        'error_invalid_input': '⚠️ بيانات غير صالحة',
        'recent_orders': '📜 آخر الطلبات', 'order_details': 'تفاصيل الطلب',
        'tables': '🪑 الطاولات', 'kitchen': '👨‍🍳 الأوردرات', 'kitchen_orders': '📋 الأوردرات النشطة',
        'no_kitchen_orders': 'مفيش أوردرات نشطة', 'items': 'أصناف', 'more': 'أكثر',
        'ready_to_serve': '🛎️ جاهز للتسليم', 'dashboard': 'الرئيسية', 'activate': 'تفعيل',
        'qr_generated': '✅ تم توليد QR Code', 'start_preparing': '🔪 بدء التحضير',
        'ready_for_delivery': '✅ جاهز للتسليم', 'deliver': '🚚 تسليم', 'delivered': '✅ تم التوصيل',
        'chef_view': '👨‍🍳 عرض المطبخ', 'persons': 'أشخاص', 'manage_tables': '🪑 إدارة الطاولات',
        'add_table': 'إضافة طاولة', 'edit_table': 'تعديل طاولة', 'delete_table': 'حذف طاولة',
        'no_tables': 'مفيش طاولات', 'table_added': '✅ تم إضافة الطاولة',
        'table_updated': '✅ تم تحديث الطاولة', 'table_deleted': '✅ تم حذف الطاولة',
        'delete_table_confirm': 'متأكد من حذف الطاولة؟', 'shift_history': '📋 سجل الشيفتات',
        'no_shift_history': 'مفيش شيفتات مقفولة', 'preparing_started': '🔪 جاري التحضير...',
        'order_ready_notification': '✅ الطلب جاهز! إشعار للويتر',
        'order_delivered': '✅ تم توصيل الطلب للعميل', 'table_number': 'رقم الطاولة',
        'capacity': 'السعة (أشخاص)', 'status': 'الحالة',
        'device_activated': '✅ تم تفعيل الجهاز بنجاح', 'item_added_to_order': '✅ تم إضافة {name}',
        'item_note_placeholder': 'ملاحظة (مثال: من غير سكر)', 'loading': 'جاري التحميل...',
        'default_item': 'صنف', 'orders': '📋 الطلبات', 'generate': 'توليد',
        'shift_open': '✅ شيفت مفتوح', 'shift_closed_status': '🔴 شيفت مقفول',
        'menu_categories': '📂 التصنيفات'
    },
    en: {
        'platepro': '✦ PLATE PRO ✦', 'welcome': 'Welcome', 'business_code': 'Business Code',
        'continue': 'Continue', 'back': 'Back', 'save': 'Save', 'cancel': 'Cancel', 'close': 'Close',
        'delete': 'Delete', 'edit': 'Edit', 'add': 'Add',
        'today_performance': '📊 Today\'s Performance', 'today_revenue': '💰 Today\'s Revenue',
        'active_orders': '📋 Active Orders', 'occupied_tables': '🪑 Occupied Tables',
        'available_tables': '🟢 Available Tables', 'quick_actions': '⚡ Quick Actions',
        'add_expense': 'Add Expense', 'close_shift': 'Close Shift', 'open_new_shift': 'Open New Shift',
        'scan_order': '📱 Scan & Order from your table', 'all': '🍽️ All', 'cart': '🛒 Cart',
        'empty_cart': 'Cart is empty', 'subtotal': 'Subtotal', 'service_fee': 'Service Fee',
        'vat': 'VAT', 'total': 'Total', 'confirm_order': 'Confirm Order',
        'pending': '⏳ Pending', 'preparing': '🔪 Preparing', 'ready': '✅ Ready for Delivery',
        'paid': '💳 Paid', 'cancelled': '❌ Cancelled', 'order': 'Order', 'table': 'Table',
        'print_receipt': '🖨️ Print Receipt', 'print': 'Print', 'payment': '💳 Payment',
        'select_payment': 'Select Payment Method', 'available': '🟢 Available', 'occupied': '🟡 Occupied',
        'reserved': '🔵 Reserved', 'active': '✅ Active', 'inactive': '⛔ Inactive',
        'waiter': 'Waiter', 'chef': 'Chef', 'cashier': 'Cashier', 'admin': 'Admin',
        'settings': '⚙️ Settings', 'appearance': '🎨 Appearance', 'dark': '🌙 Dark', 'light': '☀️ Light',
        'logo': '🖼️ Logo', 'fees': '💰 Fees & Taxes',
        'service_fee_label': 'Service Fee', 'vat_label': 'VAT',
        'payment_methods': '💳 Payment Methods', 'employees': '👥 Employees', 'switch_business': '🔄 Switch Business',
        'edit_fees': 'Edit Fees', 'edit_logo': 'Edit Logo', 'no_logo': 'No Logo',
        'remove_logo': 'Remove Logo', 'save_logo': 'Save Logo', 'upload_logo': 'Upload Logo Image',
        'menu': '🍽️ Menu', 'manage_menu': '⚙️ Manage Menu', 'add_item': 'Add Item',
        'add_category': 'Add Category', 'item_name': 'Item Name', 'item_price': 'Price',
        'item_desc': 'Description', 'item_image': 'Item Image', 'category': 'Category',
        'no_items': 'No items', 'no_categories': 'No categories', 'no_employees': 'No employees',
        'qr_code': '📱 Customer Order', 'qr_label': 'Tables QR Code',
        'qr_sub': 'Scan to order directly from menu', 'show_qr': 'Show QR', 'download_qr': 'Download QR',
        'scan_qr': 'Scan code to open customer menu', 'expense_desc': 'Description', 'expense_amount': 'Amount',
        'add_expense_title': 'Add Expense', 'close_shift_title': 'Confirm Close Shift',
        'shift_revenue': 'Revenue', 'shift_expenses': 'Expenses', 'today_expenses': '💸 Today\'s Expenses',
        'no_expenses': 'No expenses recorded this shift', 'shift_profit': 'Net Profit',
        'confirm_close': 'Confirm Close', 'no_open_shift': 'No open shift',
        'permissions': '🔐 Permissions', 'perm_dashboard': '👀 Dashboard', 'perm_tables': '🪑 Tables',
        'perm_orders': '📋 Orders', 'perm_menu': '🍽️ Menu', 'perm_settings': '⚙️ Settings',
        'perm_create_orders': '🛒 Create Orders', 'perm_add_expense': '💰 Add Expense',
        'perm_close_shift': '🔒 Close Shift', 'perm_print_receipt': '🧾 Print Receipt',
        'perm_manage_menu': '📝 Manage Menu', 'perm_view_revenue': '💰 View Revenue',
        'perm_view_expenses': '📊 View Expenses',
        'employee_name': 'Name', 'employee_pin': 'PIN (4 digits)', 'employee_role': 'Role',
        'add_employee': 'Add Employee', 'edit_employee': 'Edit Employee',
        'payment_method_name': 'Payment Method Name', 'payment_method_icon': 'Icon',
        'add_payment_method': 'Add Payment Method', 'edit_payment_method': 'Edit Payment Method',
        'cash': 'Cash', 'card': 'Card', 'wallet': 'Wallet', 'mobile_wallet': 'Mobile Wallet',
        'bank_transfer': 'Bank Transfer', 'category_name': 'Category Name', 'category_icon': 'Icon',
        'add_category_title': 'Add Category', 'order_created': '✅ Order created successfully!',
        'order_updated': '✅ Order status updated', 'payment_success': '✅ Payment successful!',
        'payment_failed': '❌ Payment failed', 'expense_added': '✅ Expense recorded',
        'shift_closed': '✅ Shift closed', 'shift_close_failed': '❌ Failed to close shift',
        'item_added': '✅ Item added', 'item_updated': '✅ Item updated',
        'item_deleted': '✅ Item deleted', 'category_added': '✅ Category added',
        'payment_method_added': '✅ Payment method added', 'employee_added': '✅ Employee added',
        'employee_updated': '✅ Employee updated', 'employee_deleted': '✅ Employee deleted',
        'logo_saved': '✅ Logo saved', 'logo_deleted': '✅ Logo deleted',
        'fees_saved': '✅ Settings saved', 'error_general': '⚠️ An error occurred, please try again',
        'error_connection': '⚠️ Connection error', 'error_invalid_code': '⚠️ Invalid business code',
        'error_invalid_pin': '⚠️ Incorrect PIN', 'error_no_items': '⚠️ Add at least one item',
        'error_no_tables': '⚠️ No tables available', 'error_permission': '⛔ You don\'t have permission',
        'error_upload': '⚠️ Image upload failed', 'error_too_many_attempts': '⚠️ Too many attempts — wait a minute',
        'error_invalid_input': '⚠️ Invalid input',
        'recent_orders': '📜 Recent Orders', 'order_details': 'Order Details',
        'tables': '🪑 Tables', 'kitchen': '👨‍🍳 Orders', 'kitchen_orders': '📋 Active Orders',
        'no_kitchen_orders': 'No active orders', 'items': 'items', 'more': 'more',
        'ready_to_serve': '🛎️ Ready to Serve', 'dashboard': 'Dashboard', 'activate': 'Activate',
        'qr_generated': '✅ QR Code generated', 'start_preparing': '🔪 Start Preparing',
        'ready_for_delivery': '✅ Ready for Delivery', 'deliver': '🚚 Deliver', 'delivered': '✅ Delivered',
        'chef_view': '👨‍🍳 Kitchen View', 'persons': 'persons', 'manage_tables': '🪑 Manage Tables',
        'add_table': 'Add Table', 'edit_table': 'Edit Table', 'delete_table': 'Delete Table',
        'no_tables': 'No tables', 'table_added': '✅ Table added',
        'table_updated': '✅ Table updated', 'table_deleted': '✅ Table deleted',
        'delete_table_confirm': 'Delete this table?', 'shift_history': '📋 Shift History',
        'no_shift_history': 'No closed shifts', 'preparing_started': '🔪 Preparing...',
        'order_ready_notification': '✅ Order ready! Notifying waiter',
        'order_delivered': '✅ Order delivered to customer', 'table_number': 'Table Number',
        'capacity': 'Capacity (persons)', 'status': 'Status',
        'device_activated': '✅ Device activated successfully', 'item_added_to_order': '✅ {name} added',
        'item_note_placeholder': 'Note (e.g. no sugar)', 'loading': 'Loading...',
        'default_item': 'Item', 'orders': '📋 Orders', 'generate': 'Generate',
        'shift_open': '✅ Shift Open', 'shift_closed_status': '🔴 Shift Closed',
        'menu_categories': '📂 Categories'
    }
};

function t(key, replace = null) {
    let text = translations[currentLang][key] || key;
    if (replace) for (const [k, v] of Object.entries(replace)) text = text.replace(`{${k}}`, v);
    return text;
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    document.getElementById('langToggleLabel').textContent = currentLang === 'ar' ? 'English' : 'العربية';
    applyTranslations();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key) {
            const tr = t(key);
            if (tr && tr !== key) el.textContent = tr;
        }
    });
    renderDashboard(); renderTables(); renderKitchenOrders();
    renderMenuView(); renderSettings(); updateShiftIndicator();
}

// ============================================================
// ✅ SECURITY HELPERS
// ============================================================
const MAX_STRING_LENGTH = 500;
const MAX_NOTE_LENGTH = 200;
const MAX_PRICE = 1_000_000;
const MAX_EXPENSE = 10_000_000;
const MAX_QUANTITY = 999;
const MAX_TABLE_CAPACITY = 100;

const isValidPrice = v => { const n = Number(v); return Number.isFinite(n) && n >= 0 && n <= MAX_PRICE; };
const isValidQuantity = v => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= MAX_QUANTITY; };
const isValidPin = p => typeof p === 'string' && /^[0-9]{4,8}$/.test(p);
const isValidBizCode = c => typeof c === 'string' && /^[A-Z0-9\-]{3,20}$/.test(c);
const isValidTableNumber = v => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 9999; };
const isValidCapacity = v => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= MAX_TABLE_CAPACITY; };
const isValidExpenseAmount = v => { const n = Number(v); return Number.isFinite(n) && n > 0 && n <= MAX_EXPENSE; };
const isValidUuid = v => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

function sanitizeString(str, maxLen = MAX_STRING_LENGTH) {
    if (str == null) return '';
    return String(str).trim().slice(0, maxLen);
}
function sanitizeNote(raw) { return raw ? String(raw).trim().slice(0, MAX_NOTE_LENGTH) : ''; }

function escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
function escapeAttr(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function isSafeImageUrl(url) {
    if (!url) return false;
    return /^(https?:\/\/|data:image\/(png|jpeg|jpg|gif|webp);base64,)/i.test(url);
}

const _attempts = {};
function checkRateLimit(key, max = 5, windowMs = 60000) {
    const now = Date.now();
    const a = _attempts[key] || { count: 0, until: 0 };
    if (now < a.until) return false;
    a.count++;
    if (a.count >= max) { a.until = now + windowMs; a.count = 0; }
    _attempts[key] = a;
    return true;
}

// ============================================================
// FEES / LOGO / THEME
// ============================================================
let serviceFeePercent = 10;
let vatPercent = 14;
let businessLogo = null;

function loadFeesSettings() {
    const s = localStorage.getItem('platepro_service_fee');
    if (s) serviceFeePercent = parseFloat(s) || 10;
    const v = localStorage.getItem('platepro_vat');
    if (v) vatPercent = parseFloat(v) || 14;
}

function saveFeesSettings() {
    const errEl = document.getElementById('feesError');
    errEl.textContent = '';
    const service = parseFloat(document.getElementById('serviceFeeInput').value);
    const vat = parseFloat(document.getElementById('vatInput').value);
    if (!Number.isFinite(service) || service < 0 || service > 100) { errEl.textContent = t('error_invalid_input'); return; }
    if (!Number.isFinite(vat) || vat < 0 || vat > 100) { errEl.textContent = t('error_invalid_input'); return; }
    serviceFeePercent = service; vatPercent = vat;
    localStorage.setItem('platepro_service_fee', service.toString());
    localStorage.setItem('platepro_vat', vat.toString());
    closeSheet('settingsFeesOverlay');
    showToast(t('fees_saved'), 'success');
    renderSettings(); updateCustomerCartUI();
}
function openFeesSettings() {
    document.getElementById('serviceFeeInput').value = serviceFeePercent;
    document.getElementById('vatInput').value = vatPercent;
    document.getElementById('feesError').textContent = '';
    openSheet('settingsFeesOverlay');
}

function loadLogo() {
    const saved = localStorage.getItem('platepro_logo');
    if (saved && isSafeImageUrl(saved)) { businessLogo = saved; updateLogoUI(); }
}
function updateLogoUI() {
    const c1 = document.getElementById('bizLogoContainer');
    const c2 = document.getElementById('customerLogoContainer');
    const html = businessLogo && isSafeImageUrl(businessLogo)
        ? `<img src="${escapeAttr(businessLogo)}" class="logo-img" alt="Logo">` : '';
    if (c1) c1.innerHTML = html;
    if (c2) c2.innerHTML = html;
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
function saveLogo() {
    const fileInput = document.getElementById('logoInput');
    const errEl = document.getElementById('logoError');
    if (fileInput.files.length === 0) { errEl.textContent = t('error_general'); return; }
    const file = fileInput.files[0];
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) { errEl.textContent = t('error_upload'); return; }
    const reader = new FileReader();
    reader.onload = e => {
        const dataUrl = e.target.result;
        if (!isSafeImageUrl(dataUrl)) { errEl.textContent = t('error_upload'); return; }
        businessLogo = dataUrl;
        localStorage.setItem('platepro_logo', businessLogo);
        updateLogoUI();
        closeSheet('settingsLogoOverlay');
        showToast(t('logo_saved'), 'success');
        renderSettings();
    };
    reader.onerror = () => { errEl.textContent = t('error_upload'); };
    reader.readAsDataURL(file);
}
function removeLogo() {
    if (!confirm(t('remove_logo') + '؟')) return;
    businessLogo = null;
    localStorage.removeItem('platepro_logo');
    updateLogoUI();
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('removeLogoBtn').style.display = 'none';
    document.getElementById('logoInput').value = '';
    showToast(t('logo_deleted'), 'success');
    renderSettings();
}

function toggleTheme() {
    const cur = localStorage.getItem('platepro_theme') || 'dark';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
}
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('platepro_theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('platepro_theme', 'dark');
    }
    updateThemeToggle();
}
function loadTheme() { applyTheme(localStorage.getItem('platepro_theme') || 'dark'); }
function updateThemeToggle() {
    const cur = localStorage.getItem('platepro_theme') || 'dark';
    const toggle = document.getElementById('themeToggle');
    const label = document.getElementById('themeToggleLabel');
    if (toggle) toggle.classList.toggle('active', cur === 'light');
    if (label) label.textContent = cur === 'dark' ? t('dark') : t('light');
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
    el.textContent = msg;
    el.className = 'toast ' + type;
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 2800);
}
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function openSheet(id) { document.getElementById(id).classList.add('show'); }
function closeSheet(id) { document.getElementById(id).classList.remove('show'); }
function money(n) { return (Number(n) || 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 }); }

function getDeviceId() {
    let id = localStorage.getItem('platepro_device_id');
    if (!id || !/^dev_[a-z0-9]+$/.test(id)) {
        id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('platepro_device_id', id);
    }
    return id;
}

function navigateTo(viewId) {
    if (currentUser && currentUser.type !== 'owner') {
        const perms = currentUser.permissions || {};
        const viewMap = {
            'view-dashboard': 'dashboard', 'view-tables': 'tables',
            'view-kitchen': 'orders', 'view-menu': 'menu', 'view-settings': 'settings',
            'view-qr': 'dashboard', 'view-shift-history': 'dashboard', 'view-shift-detail': 'dashboard'
        };
        const permKey = viewMap[viewId];
        if (permKey && !perms[permKey] && !['view-qr', 'view-shift-history', 'view-shift-detail'].includes(viewId)) {
            showToast(t('error_permission'), 'error');
            return;
        }
    }
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
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

// ============================================================
// HAMBURGER
// ============================================================
function toggleHamburgerMenu() {
    const dropdown = document.getElementById('hamburgerDropdown');
    if (!dropdown) return;
    if (dropdown.classList.contains('show')) { closeHamburgerMenu(); return; }
    const btn = document.querySelector('.hamburger-btn');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        const margin = 10;
        const w = Math.min(200, window.innerWidth - margin * 2);
        let left = rect.left;
        if (left + w > window.innerWidth - margin) left = window.innerWidth - margin - w;
        if (left < margin) left = margin;
        let top = rect.bottom + 6;
        if (top + 250 > window.innerHeight) top = Math.max(margin, rect.top - 6 - 250);
        dropdown.style.left = left + 'px';
        dropdown.style.top = top + 'px';
    }
    dropdown.classList.add('show');
}
function closeHamburgerMenu() {
    const d = document.getElementById('hamburgerDropdown');
    if (d) d.classList.remove('show');
}
window.addEventListener('resize', closeHamburgerMenu);
document.addEventListener('click', e => {
    const menu = document.querySelector('.hamburger-menu');
    if (menu && !menu.contains(e.target)) closeHamburgerMenu();
});

// ============================================================
// RING NOTIFICATION
// ============================================================
let audioContext = null;
let ringTimeout = null;

function initAudio() {
    try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { console.warn('⚠️ Audio not supported'); }
}

function playRingSound(type = 'new_order') {
    try {
        if (!audioContext) initAudio();
        if (!audioContext) return;
        if (audioContext.state === 'suspended') audioContext.resume();
        const now = audioContext.currentTime;
        const playTone = (freq, start, dur, vol = 0.25) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain); gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(vol, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            osc.start(start); osc.stop(start + dur);
        };
        if (type === 'new_order') {
            const freqs = [800, 1000, 1200, 1000, 800];
            const durs = [0.15, 0.15, 0.15, 0.15, 0.2];
            let time = now;
            freqs.forEach((f, i) => { playTone(f, time, durs[i]); time += durs[i] + 0.05; });
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        } else if (type === 'order_ready') {
            playTone(1000, now, 0.3, 0.3);
            playTone(1200, now + 0.1, 0.3, 0.3);
            playTone(1000, now + 0.2, 0.3, 0.3);
            setTimeout(() => {
                if (!audioContext) return;
                const n2 = audioContext.currentTime;
                playTone(1200, n2, 0.3, 0.3);
                playTone(1500, n2 + 0.1, 0.3, 0.3);
                playTone(1200, n2 + 0.2, 0.3, 0.3);
            }, 400);
            if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
        }
    } catch (e) { console.warn('⚠️ Could not play sound:', e); }
}

function showRingNotification(title, message, type = 'new_order') {
    playRingSound(type);
    const el = document.getElementById('ringNotification');
    if (!el) { showToast(`🔔 ${title}: ${message}`, 'info'); return; }
    document.getElementById('ringTitle').textContent = title;
    document.getElementById('ringSub').textContent = message;
    el.classList.add('show');
    clearTimeout(ringTimeout);
    ringTimeout = setTimeout(() => el.classList.remove('show'), 5000);
    el.onclick = () => { el.classList.remove('show'); clearTimeout(ringTimeout); };
}

// ============================================================
// PERMISSIONS
// ============================================================
function hasPermission(perm) {
    if (!currentUser) return false;
    if (currentUser.type === 'owner') return true;
    if (currentUser.role === 'chef') return ['orders', 'kitchen'].includes(perm);
    if (currentUser.role === 'waiter') return ['orders', 'tables', 'create_orders', 'print_receipt'].includes(perm);
    if (currentUser.role === 'cashier') {
        const p = ['dashboard', 'tables', 'orders', 'payment', 'add_expense', 'print_receipt', 'view_revenue', 'view_expenses'];
        return p.includes(perm) || (currentUser.permissions && currentUser.permissions[perm] === true);
    }
    return currentUser.permissions && currentUser.permissions[perm] === true;
}

function updateUIByPermissions() {
    const expenseBtn = document.getElementById('dashExpenseBtn');
    const closeShiftBtn = document.getElementById('dashCloseShiftBtn');
    const revenueCard = document.querySelector('.stat-card.revenue');
    if (expenseBtn) expenseBtn.style.display = hasPermission('add_expense') ? 'flex' : 'none';
    if (closeShiftBtn) closeShiftBtn.style.display = hasPermission('close_shift') ? 'flex' : 'none';
    if (revenueCard) revenueCard.style.display = (hasPermission('view_revenue') || currentUser?.type === 'owner') ? 'block' : 'none';
    document.querySelectorAll('#view-menu .btn-primary, #view-menu .btn-outline').forEach(btn => {
        btn.style.display = hasPermission('manage_menu') ? 'inline-flex' : 'none';
    });
    const viewMap = {
        'view-dashboard': 'dashboard', 'view-tables': 'tables', 'view-kitchen': 'orders',
        'view-menu': 'menu', 'view-settings': 'settings'
    };
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const permKey = viewMap[btn.dataset.view];
        if (permKey) btn.style.display = hasPermission(permKey) ? 'flex' : 'none';
    });
    const qrBtn = document.querySelector('[onclick*="view-qr"]');
    if (qrBtn) qrBtn.style.display = hasPermission('dashboard') ? 'flex' : 'none';
}

async function openNewShift() {
    shiftManuallyClosed = false;
    await loadOrOpenShift();
    updateShiftIndicator();
    renderDashboard(); renderSettings();
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
            label.textContent = t('shift_open');
            label.style.color = 'var(--success)';
            indicator.title = `فتح في: ${new Date(currentShift.opened_at).toLocaleTimeString()}`;
        }
        if (closeShiftBtn) {
            closeShiftBtn.className = 'btn btn-danger btn-block';
            closeShiftBtn.innerHTML = `<i class="fa-solid fa-lock"></i> <span>${t('close_shift')}</span>`;
            closeShiftBtn.onclick = openCloseShiftSheet;
        }
    } else {
        if (indicator) {
            indicator.className = 'shift-indicator closed';
            label.textContent = t('shift_closed_status');
            label.style.color = 'var(--danger)';
        }
        if (closeShiftBtn) {
            closeShiftBtn.className = 'btn btn-primary btn-block';
            closeShiftBtn.innerHTML = `<i class="fa-solid fa-unlock"></i> <span>${t('open_new_shift')}</span>`;
            closeShiftBtn.onclick = openNewShift;
        }
    }
}

// ============================================================
// QR CODE
// ============================================================
function generateQRCodePage() {
    if (!business) { showToast('⚠️ لا يوجد نشاط تجاري', 'error'); return; }
    const baseUrl = window.location.origin + window.location.pathname;
    const customerUrl = baseUrl + '?customer=true&biz=' + encodeURIComponent(business.id);
    document.getElementById('qrCodeImagePage').src =
        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(customerUrl);
    qrGenerated = true;
    localStorage.setItem('platepro_business_id', business.id);
    showToast(t('qr_generated'), 'success');
}
function downloadQRPage() {
    const link = document.createElement('a');
    link.download = 'QR_' + (business ? business.code : 'cafe') + '.png';
    link.href = document.getElementById('qrCodeImagePage').src;
    link.click();
}

// ============================================================
// REALTIME
// ============================================================
function getTableLabel(tableId) {
    const table = tables.find(t => t.id === tableId);
    return table ? table.number : '?';
}
function startRealtimeSync() {
    if (!supabaseClient || !business) return;
    if (realtimeSubscription) { realtimeSubscription.unsubscribe(); realtimeSubscription = null; }
    realtimeSubscription = supabaseClient
        .channel('orders-changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'orders', filter: `business_id=eq.${business.id}` },
            async (payload) => {
                const { eventType, new: n, old: o } = payload;
                if (eventType === 'INSERT') {
                    orders[n.id] = n;
                    if (!orderStatus[n.id]) orderStatus[n.id] = n.status || 'pending';
                    showRingNotification('🔔 طلب جديد!', `طاولة ${getTableLabel(n.table_id)} - ${n.status || 'جديد'}`, 'new_order');
                } else if (eventType === 'UPDATE') {
                    if (orders[o.id]) {
                        if (o.status !== n.status && n.status === 'ready') {
                            showRingNotification('🛎️ طلب جاهز للتسليم!', `طاولة ${getTableLabel(n.table_id)} - انتظر الويتر`, 'order_ready');
                        }
                        orders[n.id] = n;
                        orderStatus[n.id] = n.status || 'pending';
                    }
                } else if (eventType === 'DELETE') {
                    delete orders[o.id]; delete orderStatus[o.id];
                }
                renderDashboard(); renderTables(); renderKitchenOrders();
            }
        ).subscribe();
    supabaseClient.channel('tables-changes')
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'tables', filter: `business_id=eq.${business.id}` },
            async () => { await loadTables(); renderTables(); renderDashboard(); }
        ).subscribe();
}
function stopRealtimeSync() {
    if (realtimeSubscription) { realtimeSubscription.unsubscribe(); realtimeSubscription = null; }
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
    let bizId = params.get('biz') || localStorage.getItem('platepro_business_id');
    if (!isValidUuid(bizId)) {
        document.getElementById('customerBizName').textContent = '❌ مطعم غير موجود';
        document.getElementById('customerMenuItems').innerHTML = `<div class="empty" style="padding:40px 16px;"><i class="fa-solid fa-triangle-exclamation" style="font-size:40px;color:var(--danger);"></i><div style="font-size:16px;font-weight:700;margin-top:8px;">رابط غير صحيح</div></div>`;
        return;
    }
    customerBusinessId = bizId;
    if (!supabaseClient) { document.getElementById('customerBizName').textContent = '⚠️ خطأ في الاتصال'; return; }
    try {
        const { data: biz, error: bizError } = await supabaseClient
            .from('businesses').select('id, name, code').eq('id', bizId).maybeSingle();
        if (bizError || !biz) { document.getElementById('customerBizName').textContent = '❌ مطعم غير موجود'; return; }
        customerBusiness = biz;
        document.getElementById('customerBizName').textContent = biz.name;
        document.title = biz.name + ' - Menu';
        const savedLogo = localStorage.getItem('platepro_logo');
        if (savedLogo && isSafeImageUrl(savedLogo)) {
            document.getElementById('customerLogoContainer').innerHTML = `<img src="${escapeAttr(savedLogo)}" class="logo-img" alt="Logo">`;
        }
        const [itemsRes, catsRes] = await Promise.all([
            supabaseClient.from('menu_items').select('*').eq('business_id', bizId).eq('is_active', true).order('sort_order'),
            supabaseClient.from('menu_categories').select('*').eq('business_id', bizId).eq('is_active', true).order('sort_order')
        ]);
        customerMenuItems = itemsRes.data || [];
        customerCategories = catsRes.data || [];
        await renderCustomerTables();
        renderCustomerCategories();
        renderCustomerItems();
        loadFeesSettings();
    } catch (e) {
        console.error('Error loading customer data:', e);
        document.getElementById('customerBizName').textContent = '⚠️ خطأ في التحميل';
    }
}

async function renderCustomerTables() {
    if (!customerBusiness) return;
    try {
        const { data: tablesData } = await supabaseClient.from('tables').select('*')
            .eq('business_id', customerBusiness.id).order('number');
        const tableSelect = document.getElementById('customerTableSelect');
        const available = (tablesData || []).filter(t => t.status === 'available');
        tableSelect.innerHTML = available.length
            ? `<option value="">-- اختر طاولة --</option>${available.map(t => `<option value="${escapeAttr(t.id)}">طاولة ${escapeHtml(t.number)} (${Number(t.capacity) || 4} أشخاص)</option>`).join('')}`
            : `<option value="">⚠️ مفيش طاولات متاحة حالياً</option>`;
    } catch (e) { console.error('Error loading tables:', e); }
}

function renderCustomerCategories() {
    const container = document.getElementById('customerCategories');
    if (!container) return;
    container.innerHTML = `<button class="btn active" onclick="filterCustomerItems('all')">${t('all')}</button>
        ${customerCategories.map(cat => `<button class="btn" onclick="filterCustomerItems('${escapeAttr(cat.id)}')"><i class="fa-solid ${escapeAttr(cat.icon || 'fa-utensils')}"></i> ${escapeHtml(cat.name)}</button>`).join('')}`;
}
function filterCustomerItems(categoryId) {
    currentCustomerFilter = categoryId;
    document.querySelectorAll('#customerCategories .btn').forEach(b => b.classList.remove('active'));
    const btns = document.querySelectorAll('#customerCategories .btn');
    const idx = categoryId === 'all' ? 0 : customerCategories.findIndex(c => c.id === categoryId) + 1;
    if (btns[idx]) btns[idx].classList.add('active');
    renderCustomerItems(categoryId);
}
function renderCustomerItems(categoryId) {
    const container = document.getElementById('customerMenuItems');
    if (!container) return;
    let items = customerMenuItems;
    if (categoryId && categoryId !== 'all') items = items.filter(item => item.category_id === categoryId);
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="empty" style="padding:40px 16px;"><i class="fa-solid fa-utensils" style="font-size:40px;"></i><div style="font-size:16px;font-weight:700;margin-top:8px;">${t('no_items')}</div></div>`;
        return;
    }
    container.innerHTML = items.map(item => {
        const rawUrl = item.image_url || '';
        const safeUrl = isSafeImageUrl(rawUrl) ? rawUrl : '';
        const imageHtml = safeUrl
            ? `<img src="${escapeAttr(safeUrl)}" alt="${escapeAttr(item.name)}" onerror="this.style.display='none';this.parentElement.textContent='🍽️'">`
            : '🍽️';
        return `<div class="customer-menu-card">
            <div class="item-image">${imageHtml}</div>
            <div class="item-info">
                <div class="item-name">${escapeHtml(item.name)}</div>
                ${item.description ? `<div class="item-desc">${escapeHtml(item.description)}</div>` : ''}
                <div class="item-price">${money(item.price)} ج.م</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-xs" onclick="addToCustomerCart('${escapeAttr(item.id)}')"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>`;
    }).join('');
}

// ============================================================
// CUSTOMER CART
// ============================================================
function addToCustomerCart(itemId) {
    const item = customerMenuItems.find(i => i.id === itemId);
    if (!item) return;
    const existing = customerCart.find(i => i.id === itemId);
    if (existing) {
        if (!isValidQuantity(existing.quantity + 1)) { showCustomerToast('⚠️ الحد الأقصى للكمية'); return; }
        existing.quantity++;
    } else {
        customerCart.push({ ...item, quantity: 1, note: '' });
    }
    updateCustomerCartUI();
    showCustomerToast('✅ تم إضافة ' + item.name);
}
function updateCustomerCartNote(index, value) {
    const item = customerCart[index];
    if (item) item.note = sanitizeNote(value);
}
function updateCustomerCartUI() {
    const cart = document.getElementById('customerCart');
    const count = customerCart.reduce((s, i) => s + i.quantity, 0);
    const subtotal = customerCart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const sf = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + sf) * (vatPercent / 100);
    const total = subtotal + sf + vat;
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotal').textContent = money(total);
    if (cart) cart.style.display = count > 0 ? 'block' : 'none';
}
function showCustomerCart() {
    const container = document.getElementById('customerCartItems');
    if (customerCart.length === 0) {
        container.innerHTML = `<div class="empty">${t('empty_cart')}</div>`;
        document.getElementById('customerCartTotal').textContent = '0';
        openSheet('customerCartOverlay');
        return;
    }
    container.innerHTML = customerCart.map((item, index) => `
        <div class="order-item">
            <div style="flex:1;">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-details">${item.quantity} × ${money(item.price)}
                    <button class="btn btn-xs" style="background:var(--danger);color:#fff;border:none;border-radius:4px;cursor:pointer;margin-right:8px;" onclick="removeFromCustomerCart(${index})"><i class="fa-solid fa-minus"></i></button>
                </div>
                <input type="text" class="item-note-input" maxlength="${MAX_NOTE_LENGTH}" placeholder="📝 ${t('item_note_placeholder')}" value="${escapeAttr(item.note || '')}" oninput="updateCustomerCartNote(${index}, this.value)">
            </div>
            <div class="item-price">${money(item.price * item.quantity)}</div>
        </div>`).join('');
    const subtotal = customerCart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const sf = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + sf) * (vatPercent / 100);
    const total = subtotal + sf + vat;
    document.getElementById('cartSubtotal').textContent = money(subtotal);
    document.getElementById('serviceFeePercent').textContent = serviceFeePercent;
    document.getElementById('cartServiceFee').textContent = money(sf);
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
    el.textContent = msg;
    el.className = 'toast success';
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 2000);
}

// ============================================================
// ✅ SUBMIT CUSTOMER ORDER (RPC — سعر السيرفر)
// ============================================================
async function submitCustomerOrder() {
    const errEl = document.getElementById('customerCartError');
    errEl.textContent = '';
    if (customerCart.length === 0) { errEl.textContent = t('error_no_items'); return; }
    const tableId = document.getElementById('customerTableSelect').value;
    if (!tableId || !isValidUuid(tableId)) { errEl.textContent = '⚠️ اختر رقم الطاولة أولاً'; return; }
    if (!customerBusiness || !isValidUuid(customerBusiness.id)) { errEl.textContent = t('error_general'); return; }

    const payload = [];
    for (const ci of customerCart) {
        if (!ci.id || !isValidQuantity(ci.quantity)) { errEl.textContent = t('error_invalid_input'); return; }
        payload.push({ menu_item_id: ci.id, quantity: ci.quantity, note: sanitizeNote(ci.note) });
    }

    try {
        const { data: orderId, error } = await supabaseClient.rpc('create_customer_order', {
            p_business_id: customerBusiness.id,
            p_table_id: tableId,
            p_items: payload
        });
        if (error) {
            console.error('RPC error:', error);
            if (error.message?.includes('TOO_MANY_ATTEMPTS')) errEl.textContent = t('error_too_many_attempts');
            else if (error.message?.includes('TABLE_NOT_AVAILABLE')) errEl.textContent = '⚠️ الطاولة مشغولة، اختر طاولة أخرى';
            else if (error.message?.includes('ITEM_NOT_FOUND')) errEl.textContent = '⚠️ صنف مش متاح';
            else errEl.textContent = t('error_general');
            return;
        }
        if (!orderId) { errEl.textContent = t('error_general'); return; }
        customerCart = [];
        updateCustomerCartUI();
        closeSheet('customerCartOverlay');
        showCustomerToast(t('order_created'));
        await loadCustomerData();
    } catch (e) {
        console.error('Order error:', e);
        errEl.textContent = t('error_general');
    }
}

// ============================================================
// ✅ SETUP / ACTIVATION / LOCK
// ============================================================
async function handleSetupContinue() {
    const codeInput = document.getElementById('setupBusinessCode').value.trim().toUpperCase();
    const errEl = document.getElementById('setupError');
    errEl.textContent = '';
    if (!isValidBizCode(codeInput)) { errEl.textContent = t('error_invalid_code'); return; }
    const btn = document.getElementById('setupContinueBtn');
    btn.disabled = true;
    try {
        if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }
        const { data: biz, error } = await supabaseClient
            .from('businesses').select('id, name, code, created_at').eq('code', codeInput).maybeSingle();
        if (error || !biz) { errEl.textContent = t('error_invalid_code'); return; }
        business = biz;
        loadLogo();
        const deviceId = getDeviceId();
        const { data: dev } = await supabaseClient
            .from('devices').select('id, business_id, device_id, is_active, revoked, expiry_date')
            .eq('business_id', biz.id).eq('device_id', deviceId).maybeSingle();
        if (!dev) {
            document.getElementById('activationBizName').textContent = biz.name;
            showScreen('activationScreen');
            return;
        }
        deviceRecord = dev;
        proceedToLock();
    } catch (e) {
        console.error(e); errEl.textContent = t('error_connection');
    } finally { btn.disabled = false; }
}

async function handleActivateDevice() {
    const code = document.getElementById('activationCodeInput').value.trim().toUpperCase();
    const errEl = document.getElementById('activationError');
    errEl.textContent = '';
    if (!/^[A-Z0-9\-]{4,40}$/.test(code)) { errEl.textContent = t('error_invalid_input'); return; }
    if (!checkRateLimit('activate_' + business.id, 5, 60000)) { errEl.textContent = t('error_too_many_attempts'); return; }
    try {
        if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }
        const { data: actCode, error } = await supabaseClient
            .from('activation_codes').select('id, business_id, code')
            .eq('business_id', business.id).eq('code', code).eq('used', false).single();
        if (error || !actCode) { errEl.textContent = 'الكود غير صحيح أو مستخدم قبل كده.'; return; }
        const deviceId = getDeviceId();
        const expiry = new Date(); expiry.setDate(expiry.getDate() + 30);
        const { data: newDev, error: devErr } = await supabaseClient.from('devices').insert({
            business_id: business.id, device_id: deviceId, device_label: 'جهاز جديد',
            is_active: true, revoked: false, expiry_date: expiry.toISOString()
        }).select('id, business_id, device_id, is_active, revoked, expiry_date').single();
        if (devErr) { errEl.textContent = t('error_general'); return; }
        await supabaseClient.from('activation_codes').update({ used: true, used_at: new Date().toISOString() }).eq('id', actCode.id);
        deviceRecord = newDev;
        showToast(t('device_activated'), 'success');
        proceedToLock();
    } catch (e) {
        console.error(e); errEl.textContent = t('error_connection');
    }
}

function proceedToLock() {
    document.getElementById('lockBizCode').textContent = business.code;
    document.getElementById('lockBizName').textContent = business.name;
    const expiry = deviceRecord.expiry_date ? new Date(deviceRecord.expiry_date) : null;
    const subLine = document.getElementById('subStatusLine');
    if (deviceRecord.revoked || !deviceRecord.is_active) subLine.textContent = 'الجهاز موقوف — تواصل مع الإدارة';
    else if (expiry && expiry < new Date()) subLine.textContent = 'الاشتراك منتهي — تواصل مع الإدارة';
    else if (expiry) subLine.textContent = `متبقي ${Math.ceil((expiry - new Date()) / 86400000)} يوم على الاشتراك`;
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

// ============================================================
// ✅ UNLOCK (RPC)
// ============================================================
async function handleEmployeeUnlock() {
    const name = document.getElementById('lockEmpName').value.trim();
    const pin = document.getElementById('lockEmpPin').value.trim();
    const errEl = document.getElementById('lockError');
    errEl.textContent = '';
    if (deviceRecord.revoked || !deviceRecord.is_active) { errEl.textContent = t('error_general'); return; }
    if (deviceRecord.expiry_date && new Date(deviceRecord.expiry_date) < new Date()) { errEl.textContent = 'الاشتراك منتهي.'; return; }
    if (!name || name.length > 60) { errEl.textContent = t('error_general'); return; }
    if (!isValidPin(pin)) { errEl.textContent = t('error_general'); return; }
    if (!checkRateLimit('emp_login_' + business.id, 5, 60000)) { errEl.textContent = t('error_too_many_attempts'); return; }
    if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }

    const { data, error } = await supabaseClient.rpc('verify_login', { p_business_id: business.id, p_pin: pin });
    if (error) {
        if (error.message?.includes('TOO_MANY_ATTEMPTS')) errEl.textContent = t('error_too_many_attempts');
        else errEl.textContent = t('error_connection');
        return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || row.role === 'owner') { errEl.textContent = t('error_invalid_pin'); return; }
    if ((row.display_name || '').trim().toLowerCase() !== name.toLowerCase()) { errEl.textContent = t('error_invalid_pin'); return; }
    currentUser = { type: 'employee', id: row.user_id, name: row.display_name, role: row.role };
    enterMainApp();
}

async function handleUnlock() {
    const pin = document.getElementById('lockPinInput').value.trim();
    const errEl = document.getElementById('lockError');
    errEl.textContent = '';
    if (deviceRecord.revoked || !deviceRecord.is_active) { errEl.textContent = t('error_general'); return; }
    if (deviceRecord.expiry_date && new Date(deviceRecord.expiry_date) < new Date()) { errEl.textContent = 'الاشتراك منتهي.'; return; }
    if (!isValidPin(pin)) { errEl.textContent = t('error_general'); return; }
    if (!checkRateLimit('owner_login_' + business.id, 5, 60000)) { errEl.textContent = t('error_too_many_attempts'); return; }
    if (!supabaseClient) { errEl.textContent = t('error_connection'); return; }

    const { data, error } = await supabaseClient.rpc('verify_login', { p_business_id: business.id, p_pin: pin });
    if (error) {
        if (error.message?.includes('TOO_MANY_ATTEMPTS')) errEl.textContent = t('error_too_many_attempts');
        else errEl.textContent = t('error_connection');
        return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) { errEl.textContent = t('error_invalid_pin'); return; }
    currentUser = row.role === 'owner'
        ? { type: 'owner', name: row.display_name || 'المالك' }
        : { type: 'employee', id: row.user_id, name: row.display_name, role: row.role };
    enterMainApp();
}

function lockApp() {
    currentUser = null;
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
    loadTheme(); loadFeesSettings(); loadLogo();
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
    renderDashboard(); renderTables(); renderKitchenOrders();
    renderMenuView(); renderMenuManagement(); renderSettings();
    updateShiftIndicator();
    setInterval(async () => {
        if (!shiftManuallyClosed && (!currentShift || currentShift.status !== 'open')) await loadOrOpenShift();
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
        let { data: shift } = await supabaseClient.from('shifts').select('*')
            .eq('business_id', business.id).eq('status', 'open').maybeSingle();
        if (!shift) {
            const { data: newShift } = await supabaseClient.from('shifts').insert({
                business_id: business.id, opened_at: new Date().toISOString(),
                status: 'open', total_revenue: 0, total_expenses: 0, total_profit: 0,
                opened_by: currentUser?.name || 'نظام'
            }).select().single();
            if (newShift) { shift = newShift; showToast('✅ تم فتح شيفت جديد', 'success'); }
        }
        currentShift = shift || {
            id: 'temp_' + Date.now(), business_id: business.id, status: 'open',
            opened_at: new Date().toISOString(), opened_by: currentUser?.name || 'نظام',
            total_revenue: 0, total_expenses: 0, total_profit: 0
        };
        shiftManuallyClosed = false;
        updateShiftIndicator();
        return currentShift;
    } catch (e) {
        console.error('Error in loadOrOpenShift:', e);
        currentShift = {
            id: 'temp_' + Date.now(), business_id: business.id, status: 'open',
            opened_at: new Date().toISOString(), opened_by: currentUser?.name || 'نظام',
            total_revenue: 0, total_expenses: 0, total_profit: 0
        };
        updateShiftIndicator();
        return currentShift;
    }
}

async function closeShift() {
    if (!supabaseClient || !currentShift) { showToast('⚠️ لا يوجد شيفت مفتوح', 'warning'); return null; }
    if (!hasPermission('close_shift') && currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return null; }
    if (currentShift.id?.toString().startsWith('temp_')) {
        showToast('⚠️ هذا شيفت مؤقت، سيتم إنشاء شيفت جديد تلقائياً', 'warning');
        currentShift = null; shiftManuallyClosed = true; updateShiftIndicator();
        return { revenue: 0, totalExpenses: 0, profit: 0 };
    }
    try {
        const { data: completedOrders } = await supabaseClient.from('orders').select('total')
            .eq('business_id', business.id).eq('status', 'paid').gte('created_at', currentShift.opened_at);
        const revenue = (completedOrders || []).reduce((s, o) => s + (Number(o.total) || 0), 0);
        const { data: expenses } = await supabaseClient.from('expenses').select('amount').eq('shift_id', currentShift.id);
        const totalExpenses = (expenses || []).reduce((s, e) => s + Number(e.amount), 0);
        const profit = revenue - totalExpenses;
        const { error: updateError } = await supabaseClient.from('shifts').update({
            status: 'closed', closed_at: new Date().toISOString(),
            closed_by: currentUser?.name || 'نظام',
            total_revenue: revenue, total_expenses: totalExpenses, total_profit: profit
        }).eq('id', currentShift.id);
        if (updateError) throw updateError;
        showToast(`✅ تم إقفال الشيفت - الإيراد: ${money(revenue)}`, 'success');
        currentShift = null; shiftManuallyClosed = true;
        updateShiftIndicator(); renderDashboard(); renderSettings();
        return { revenue, totalExpenses, profit };
    } catch (e) {
        console.error('Error closing shift:', e);
        showToast(t('shift_close_failed'), 'error');
        return null;
    }
}

async function openCloseShiftSheet() {
    if (!hasPermission('close_shift') && currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    if (!currentShift) {
        await loadOrOpenShift();
        if (!currentShift) { showToast(t('no_open_shift'), 'warning'); return; }
    }
    if (!supabaseClient) return;
    try {
        const { data: completedOrders } = await supabaseClient.from('orders').select('total')
            .eq('business_id', business.id).eq('status', 'paid').gte('created_at', currentShift.opened_at);
        const revenue = (completedOrders || []).reduce((s, o) => s + (Number(o.total) || 0), 0);
        const { data: expenses } = await supabaseClient.from('expenses').select('amount').eq('shift_id', currentShift.id);
        const totalExpenses = (expenses || []).reduce((s, e) => s + Number(e.amount), 0);
        const profit = revenue - totalExpenses;
        document.getElementById('closeShiftSummary').innerHTML = `
            <div class="list-row"><div class="row-title">📅 تاريخ الفتح</div><div class="row-value mono">${new Date(currentShift.opened_at).toLocaleString()}</div></div>
            <div class="list-row"><div class="row-title">👤 فتح بواسطة</div><div class="row-value mono">${escapeHtml(currentShift.opened_by || 'نظام')}</div></div>
            <div class="list-row"><div class="row-title">📋 الطلبات المدفوعة</div><div class="row-value mono">${completedOrders?.length || 0}</div></div>
            <div class="list-row"><div class="row-title">${t('shift_revenue')}</div><div class="row-value mono" style="color:var(--success);">${money(revenue)}</div></div>
            <div class="list-row"><div class="row-title">${t('shift_expenses')}</div><div class="row-value mono" style="color:var(--danger);">${money(totalExpenses)}</div></div>
            <div class="list-row" style="border-bottom:2px solid var(--primary);padding-bottom:12px;"><div class="row-title" style="font-size:16px;font-weight:800;">${t('shift_profit')}</div><div class="row-value mono" style="font-size:18px;color:var(--primary-dark);">${money(profit)}</div></div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:8px;text-align:center;">⚠️ تأكد من تحصيل جميع المدفوعات قبل الإقفال</div>
        `;
        document.getElementById('confirmCloseShiftBtn').onclick = async function () {
            const btn = this;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإقفال...';
            try {
                await closeShift();
                closeSheet('closeShiftOverlay');
                renderDashboard(); renderSettings(); updateShiftIndicator();
            } catch (e) { showToast(t('shift_close_failed'), 'error'); }
            finally {
                btn.disabled = false;
                btn.innerHTML = `<span>${t('confirm_close')}</span>`;
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
    if (!supabaseClient || !business) { container.innerHTML = `<div class="empty">${t('loading')}</div>`; return; }
    try {
        const now = new Date();
        let startDate = new Date(now);
        if (filter === 'daily') startDate.setHours(0, 0, 0, 0);
        else if (filter === 'weekly') startDate.setDate(now.getDate() - 7);
        else if (filter === 'monthly') startDate.setMonth(now.getMonth() - 1);
        const { data: shifts, error } = await supabaseClient.from('shifts').select('*')
            .eq('business_id', business.id).eq('status', 'closed')
            .gte('closed_at', startDate.toISOString()).order('closed_at', { ascending: false });
        if (error) throw error;
        if (!shifts || shifts.length === 0) {
            container.innerHTML = `<div class="empty"><i class="fa-solid fa-clock"></i> لا توجد شيفتات ${filter === 'daily' ? 'اليوم' : filter === 'weekly' ? 'هذا الأسبوع' : 'هذا الشهر'}</div>`;
            return;
        }
        container.innerHTML = shifts.map(shift => `
            <div class="shift-card" onclick="viewShiftDetail('${escapeAttr(shift.id)}')">
                <div class="shift-card-header">
                    <div class="shift-card-date">${new Date(shift.closed_at).toLocaleDateString('ar-EG')}</div>
                    <span class="badge badge-gold">${new Date(shift.closed_at).toLocaleTimeString('ar-EG')}</span>
                </div>
                <div class="shift-card-stats">
                    <span>💰 <span class="revenue">${money(shift.total_revenue || 0)}</span></span>
                    <span>📈 ${money(shift.total_profit || 0)}</span>
                    <span>👤 ${escapeHtml(shift.closed_by || 'نظام')}</span>
                </div>
            </div>`).join('');
    } catch (e) {
        console.error('Error loading shift history:', e);
        container.innerHTML = `<div class="empty">⚠️ حدث خطأ في تحميل السجل</div>`;
    }
}
function filterShiftHistory(filter) {
    shiftFilter = filter;
    document.querySelectorAll('#shiftFilterTabs .btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    renderShiftHistoryPage(filter);
}

async function viewShiftDetail(shiftId) {
    if (!supabaseClient || !business || !isValidUuid(shiftId)) return;
    try {
        const { data: shift, error: shiftError } = await supabaseClient.from('shifts').select('*').eq('id', shiftId).single();
        if (shiftError) throw shiftError;
        const { data: ordersData, error: ordersError } = await supabaseClient.from('orders')
            .select('*, order_items(*, menu_items(*))')
            .eq('business_id', business.id).gte('created_at', shift.opened_at)
            .lte('created_at', shift.closed_at || new Date().toISOString())
            .order('created_at', { ascending: true });
        if (ordersError) throw ordersError;
        document.getElementById('shiftDetailDate').textContent = new Date(shift.closed_at).toLocaleDateString('ar-EG');
        document.getElementById('shiftDetailMeta').textContent =
            `🕐 ${new Date(shift.opened_at).toLocaleTimeString('ar-EG')} - ${new Date(shift.closed_at).toLocaleTimeString('ar-EG')} · 👤 ${shift.closed_by || 'نظام'}`;
        document.getElementById('detailRevenue').textContent = money(shift.total_revenue || 0);
        document.getElementById('detailOrders').textContent = ordersData?.length || 0;
        document.getElementById('detailTables').textContent = new Set(ordersData?.map(o => o.table_id) || []).size || 0;
        const ordersContainer = document.getElementById('shiftDetailOrders');
        if (!ordersData || ordersData.length === 0) {
            ordersContainer.innerHTML = `<div class="empty">لا توجد طلبات في هذا الشيفت</div>`;
        } else {
            const tableOrders = {};
            ordersData.forEach(o => { (tableOrders[o.table_id] = tableOrders[o.table_id] || []).push(o); });
            const { data: tablesData } = await supabaseClient.from('tables').select('*').in('id', Object.keys(tableOrders));
            const tableMap = {}; (tablesData || []).forEach(t => { tableMap[t.id] = t; });
            ordersContainer.innerHTML = Object.entries(tableOrders).map(([tableId, orders]) => {
                const table = tableMap[tableId];
                const totalForTable = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
                const timeGroups = {};
                orders.forEach(o => {
                    const hour = new Date(o.created_at).getHours();
                    const key = `${hour}:00 - ${hour + 1}:00`;
                    (timeGroups[key] = timeGroups[key] || []).push(o);
                });
                let timeHtml = '';
                Object.entries(timeGroups).forEach(([key, timeOrders]) => {
                    const items = timeOrders.map(o =>
                        (o.order_items || []).map(i => `${i.quantity}× ${i.menu_items?.name || 'صنف'}`).join('، ')
                    ).join(' | ');
                    timeHtml += `<div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:8px 12px;margin-bottom:6px;">
                        <div style="display:flex;justify-content:space-between;font-size:13px;">
                            <span style="font-weight:700;">🕐 ${key}</span>
                            <span style="color:var(--text-muted);">${timeOrders.length} طلبات</span>
                        </div>
                        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${items || 'لا توجد تفاصيل'}</div>
                    </div>`;
                });
                return `<div class="table-order-item">
                    <div class="order-header">
                        <div>
                            <div class="order-table">🪑 طاولة ${table?.number || '?'}</div>
                            <div class="order-time">${orders.length} طلبات · ${money(totalForTable)}</div>
                        </div>
                        <div class="order-total">${money(totalForTable)}</div>
                    </div>
                    <div style="margin-top:8px;">${timeHtml}</div>
                </div>`;
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
        if (localStorage.getItem('platepro_need_refresh') === 'true') {
            try {
                await loadActiveOrders(); await loadTables();
                renderTables(); renderKitchenOrders(); renderDashboard();
                localStorage.removeItem('platepro_need_refresh');
                showToast('📱 طلب جديد من العميل!', 'info');
            } catch (e) { console.error('Error refreshing data:', e); }
        }
    }, 3000);
}

// ============================================================
// DATA LOADERS
// ============================================================
async function loadAllData() {
    await loadTables(); await loadActiveOrders();
    await Promise.all([loadMenuItems(), loadMenuCategories(), loadEmployees(), loadPaymentMethods()]);
}
async function loadTables() {
    if (!supabaseClient || !business) return;
    let { data } = await supabaseClient.from('tables').select('*').eq('business_id', business.id).order('number');
    if (!data || data.length === 0) {
        const seed = Array.from({ length: 8 }, (_, i) => ({ business_id: business.id, number: i + 1, capacity: 4, status: 'available' }));
        const { data: created } = await supabaseClient.from('tables').insert(seed).select();
        data = created || [];
    }
    tables = data;
}
async function loadMenuItems() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient.from('menu_items').select('*')
        .eq('business_id', business.id).eq('is_active', true).order('sort_order');
    menuItems = data || [];
}
async function loadMenuCategories() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient.from('menu_categories').select('*')
        .eq('business_id', business.id).eq('is_active', true).order('sort_order');
    menuCategories = data || [];
}
async function loadEmployees() {
    if (!supabaseClient || !business) return;
    // ✅ SECURITY: لا نختار pin/pin_hash
    const { data } = await supabaseClient.from('employees')
        .select('id, business_id, name, role, is_active, permissions, created_at')
        .eq('business_id', business.id).order('created_at');
    employees = data || [];
}
async function loadPaymentMethods() {
    if (!supabaseClient || !business) return;
    const { data } = await supabaseClient.from('payment_methods').select('*').eq('business_id', business.id).eq('is_active', true);
    if (data && data.length > 0) { paymentMethods = data; return; }
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
    const { data } = await supabaseClient.from('orders').select('*')
        .eq('business_id', business.id).in('status', ['pending', 'preparing', 'ready', 'paid'])
        .order('created_at', { ascending: false });
    orders = {};
    (data || []).forEach(o => { orders[o.id] = o; if (!orderStatus[o.id]) orderStatus[o.id] = o.status || 'pending'; });
    return data || [];
}
async function loadOrderItems(orderId) {
    const { data } = await supabaseClient.from('order_items').select('*, menu_items(*)').eq('order_id', orderId);
    const container = document.getElementById('orderItemsList');
    if (!container) return;
    if (!data || data.length === 0) { container.innerHTML = `<div class="empty" style="padding:10px;">${t('no_items')}</div>`; return; }
    container.innerHTML = data.map(item => `
        <div class="order-item">
            <div>
                <div class="item-name">${escapeHtml(item.menu_items?.name || t('default_item'))}</div>
                <div class="item-details">${item.quantity} × ${money(item.unit_price)}</div>
                ${item.notes ? `<div class="item-note-display">📝 ${escapeHtml(item.notes)}</div>` : ''}
            </div>
            <div class="item-price">${money(item.total)}</div>
        </div>`).join('');
}

// ============================================================
// DASHBOARD
// ============================================================
async function renderDashboard() {
    const activeOrders = Object.values(orders).filter(o => !['completed', 'cancelled', 'paid'].includes(o.status));
    const occupiedTables = tables.filter(t => ['occupied', 'ready_to_serve'].includes(t.status));
    const availableTables = tables.filter(t => t.status === 'available');
    let revenue = 0, totalExpenses = 0, expensesList = [];

    if (supabaseClient && currentShift && !currentShift.id.toString().startsWith('temp_')) {
        const { data: completedOrders } = await supabaseClient.from('orders').select('total')
            .eq('business_id', business.id).eq('status', 'paid').gte('created_at', currentShift.opened_at);
        revenue = (completedOrders || []).reduce((s, o) => s + (Number(o.total) || 0), 0);
        const { data: expenses } = await supabaseClient.from('expenses').select('description, amount, created_at')
            .eq('shift_id', currentShift.id).order('created_at', { ascending: false });
        expensesList = expenses || [];
        totalExpenses = expensesList.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    }

    const canViewRevenue = hasPermission('view_revenue') || currentUser?.type === 'owner';
    const revenueCard = document.querySelector('.stat-card.revenue');
    if (revenueCard) revenueCard.style.display = canViewRevenue ? 'block' : 'none';

    const canViewExpenses = hasPermission('view_expenses') || currentUser?.type === 'owner';
    const expensesCard = document.getElementById('dashExpensesCard');
    const expensesListEl = document.getElementById('dashExpensesList');
    if (expensesCard) expensesCard.style.display = canViewExpenses ? 'block' : 'none';
    if (expensesListEl) {
        const title = expensesListEl.previousElementSibling;
        if (!canViewExpenses) {
            expensesListEl.style.display = 'none';
            if (title) title.style.display = 'none';
        } else {
            expensesListEl.style.display = 'block';
            if (title) title.style.display = 'block';
            expensesListEl.innerHTML = expensesList.length
                ? expensesList.map(e => `<div class="list-row"><div class="row-title">${escapeHtml(e.description || '-')}</div><div class="row-value mono" style="color:var(--danger);">${money(Number(e.amount) || 0)}</div></div>`).join('')
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
                o.table_id === table.id && !['completed', 'cancelled', 'paid'].includes(o.status));
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
                ? `<span class="table-badge ${finalStatus === 'ready_to_serve' ? 'badge-ready-table' : ''}">${s.label}</span>` : '';
            card.innerHTML = `${badge}<div class="table-num">${escapeHtml(table.number)}</div><div class="table-status">${s.label}</div><div class="table-capacity">${Number(table.capacity) || 4} ${t('persons')}</div>`;
            grid.appendChild(card);
        } catch (error) { console.error('Error rendering table:', error); }
    }
}

// ============================================================
// KITCHEN
// ============================================================
function renderKitchenOrders() {
    const isChef = currentUser?.role === 'chef' || currentUser?.type === 'owner' || hasPermission('orders');
    const el = document.getElementById('kitchenOrdersList');
    if (!el) return;
    if (!isChef) { el.innerHTML = `<div class="empty"><i class="fa-solid fa-lock"></i>${t('error_permission')}</div>`; return; }
    const kitchenOrders = Object.values(orders).filter(o => ['pending', 'preparing'].includes(o.status));
    if (kitchenOrders.length === 0) { el.innerHTML = `<div class="empty"><i class="fa-solid fa-utensils"></i>${t('no_kitchen_orders')}</div>`; return; }
    el.innerHTML = kitchenOrders.map(order => {
        const table = tables.find(t => t.id === order.table_id);
        const orderItems = order.order_items || [];
        const itemCount = orderItems.reduce((s, i) => s + (i.quantity || 0), 0);
        let itemsPreview = '';
        if (orderItems.length > 0) {
            itemsPreview = orderItems.slice(0, 3).map(i => `${i.quantity}× ${i.menu_items?.name || t('default_item')}`).join('، ');
            if (orderItems.length > 3) itemsPreview += ` +${orderItems.length - 3} ${t('more')}`;
        }
        const hasNotes = orderItems.some(i => i.notes);
        const statusLabelMap = { pending: t('pending'), preparing: t('preparing') };
        return `<div class="list-row" onclick="viewKitchenOrder('${escapeAttr(order.id)}')" style="cursor:pointer;border-bottom:2px solid var(--border);padding:14px 4px;">
            <div>
                <div class="row-title" style="font-size:16px;">${t('table')} ${escapeHtml(table?.number || '?')} ${hasNotes ? '📝' : ''}</div>
                <div class="row-sub">${itemCount} ${t('items')} · ${itemsPreview}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                <span class="badge ${order.status === 'pending' ? 'badge-warning' : 'badge-info'}">${statusLabelMap[order.status] || order.status}</span>
                <span style="font-size:11px;color:var(--text-muted);">${new Date(order.created_at).toLocaleTimeString()}</span>
            </div>
        </div>`;
    }).join('');
}

async function viewKitchenOrder(orderId) {
    window._activeKitchenOrderId = orderId;
    const order = Object.values(orders).find(o => o.id === orderId);
    if (!order) return;
    const { data: items } = await supabaseClient.from('order_items').select('*, menu_items(*)').eq('order_id', orderId);
    const table = tables.find(t => t.id === order.table_id);
    const body = document.getElementById('kitchenOrderBody');
    let itemsHtml = (items && items.length)
        ? items.map(i => `<div class="order-item" style="padding:8px 0;">
            <div>
                <div class="item-name" style="font-size:16px;">${escapeHtml(i.menu_items?.name || t('default_item'))}</div>
                <div class="item-details" style="font-size:14px;color:var(--text-secondary);">${i.quantity} ×</div>
                ${i.notes ? `<div class="item-note-display item-note-kitchen">📝 ${escapeHtml(i.notes)}</div>` : ''}
            </div>
        </div>`).join('') : '';
    let actionButtons = '';
    if (order.status === 'pending') actionButtons = `<button class="btn btn-primary btn-block" onclick="startPreparing('${escapeAttr(orderId)}')"><i class="fa-solid fa-utensils"></i> ${t('start_preparing')}</button>`;
    else if (order.status === 'preparing') actionButtons = `<button class="btn btn-success btn-block" onclick="markAsReady('${escapeAttr(orderId)}')"><i class="fa-solid fa-check"></i> ${t('ready_for_delivery')}</button>`;
    body.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span class="badge badge-gold" style="font-size:14px;">${t('table')} ${escapeHtml(table?.number || '?')}</span>
        <span class="badge ${order.status === 'pending' ? 'badge-warning' : 'badge-info'}" style="font-size:14px;">${order.status === 'pending' ? t('pending') : t('preparing')}</span>
    </div>
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px;">${itemsHtml}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${actionButtons}
        <button class="btn btn-ghost" style="flex:1;" onclick="closeSheet('kitchenOrderOverlay')">${t('close')}</button>
    </div>`;
    openSheet('kitchenOrderOverlay');
}

async function startPreparing(orderId) {
    if (currentUser?.role !== 'chef' && currentUser?.type !== 'owner' && !hasPermission('orders')) {
        showToast(t('error_permission'), 'error'); return;
    }
    try {
        await supabaseClient.from('orders').update({ status: 'preparing' }).eq('id', orderId);
        orderStatus[orderId] = 'preparing';
        showToast(t('preparing_started'), 'info');
        await loadActiveOrders();
        renderKitchenOrders(); renderTables(); renderDashboard();
        closeSheet('kitchenOrderOverlay');
    } catch (e) { showToast(t('error_general'), 'error'); }
}

async function markAsReady(orderId) {
    if (currentUser?.role !== 'chef' && currentUser?.type !== 'owner' && !hasPermission('orders')) {
        showToast(t('error_permission'), 'error'); return;
    }
    try {
        await supabaseClient.from('orders').update({ status: 'ready' }).eq('id', orderId);
        orderStatus[orderId] = 'ready';
        const order = Object.values(orders).find(o => o.id === orderId);
        const table = tables.find(t => t.id === order?.table_id);
        showToast(`✅ تم تجهيز طلب طاولة ${table?.number || '?'}`, 'success');
        await loadActiveOrders();
        renderKitchenOrders(); renderTables(); renderDashboard();
        closeSheet('kitchenOrderOverlay');
    } catch (e) { showToast(t('error_general'), 'error'); }
}

// ============================================================
// TABLE SHEET
// ============================================================
function openTableSheet(tableId) {
    window._activeTableId = tableId;
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    const activeOrder = Object.values(orders).find(o =>
        o.table_id === tableId && !['completed', 'cancelled', 'paid'].includes(o.status));

    if (!activeOrder) {
        if (!hasPermission('create_orders')) { showToast(t('error_permission'), 'error'); return; }
        if (['occupied', 'ready_to_serve'].includes(table.status)) {
            supabaseClient.from('tables').update({ status: 'available' }).eq('id', tableId).then(() => {}, () => {});
            table.status = 'available';
        }
        document.getElementById('tableSheetTitle').textContent = `${t('table')} ${table.number} (${table.capacity || 4} ${t('persons')})`;
        const body = document.getElementById('tableSheetBody');
        body.innerHTML = `<div class="section-title">${t('menu')}</div>
            <div class="menu-quick-add" id="menuItemsForTable">${menuItems.length === 0 ? `<div class="empty" style="padding:10px;">${t('no_items')}</div>` : ''}</div>
            <div id="tableOrderItems"></div>
            <div style="display:flex;gap:8px;margin-top:12px;">
                <button class="btn btn-primary" style="flex:1;" onclick="createOrder('${escapeAttr(tableId)}')"><i class="fa-solid fa-check"></i> ${t('confirm_order')}</button>
                <button class="btn btn-ghost" style="flex:1;" onclick="closeSheet('tableOverlay')">${t('cancel')}</button>
            </div>
            <div class="error-text" id="tableSheetError"></div>`;
        const menuContainer = document.getElementById('menuItemsForTable');
        if (menuItems.length > 0) {
            menuItems.slice(0, 12).forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline btn-sm';
                btn.innerHTML = `${escapeHtml(item.name)} ${money(item.price)}`;
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
    const subtotal = activeOrder.subtotal || activeOrder.total || 0;
    const sf = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + sf) * (vatPercent / 100);
    const total = subtotal + sf + vat;
    const isCashier = currentUser?.role === 'cashier' || currentUser?.type === 'owner' || hasPermission('payment');
    let actionButtons = '';
    if (isReady && !isPaid && isCashier) {
        actionButtons = hasPermission('print_receipt')
            ? `<button class="btn btn-success" style="flex:1;" onclick="printReceipt('${escapeAttr(activeOrder.id)}')"><i class="fa-solid fa-print"></i> ${t('print_receipt')}</button>
               <button class="btn btn-primary" style="flex:1;" onclick="showPaymentSheet('${escapeAttr(activeOrder.id)}')"><i class="fa-solid fa-credit-card"></i> ${t('payment')}</button>`
            : `<button class="btn btn-ghost" style="flex:1;" disabled><i class="fa-solid fa-print"></i> ${t('error_permission')}</button>
               <button class="btn btn-primary" style="flex:1;" onclick="showPaymentSheet('${escapeAttr(activeOrder.id)}')"><i class="fa-solid fa-credit-card"></i> ${t('payment')}</button>`;
    } else if (isPaid) {
        actionButtons = `<button class="btn btn-success" style="flex:1;" disabled><i class="fa-solid fa-check"></i> ${t('paid')}</button>`;
    } else if (!isReady && !isPaid) {
        actionButtons = (currentUser?.role === 'chef' || currentUser?.type === 'owner' || hasPermission('orders'))
            ? `<button class="btn btn-primary" style="flex:1;" onclick="startPreparing('${escapeAttr(activeOrder.id)}')"><i class="fa-solid fa-utensils"></i> ${t('start_preparing')}</button>`
            : `<button class="btn btn-ghost" style="flex:1;" disabled><i class="fa-solid fa-clock"></i> ${t('pending')}</button>`;
    }
    const statusBadgeMap = { pending: 'badge-warning', preparing: 'badge-info', ready: 'badge-ready-table', paid: 'badge-paid', cancelled: 'badge-cancelled' };
    const statusLabelMap = { pending: t('pending'), preparing: t('preparing'), ready: t('ready_to_serve'), paid: t('paid'), cancelled: t('cancelled') };
    document.getElementById('tableSheetTitle').textContent = `${t('table')} ${table.number} (${table.capacity || 4} ${t('persons')})`;
    const body = document.getElementById('tableSheetBody');
    body.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span class="badge badge-gold">${t('order')} #${escapeHtml(activeOrder.id.slice(0, 8))}</span>
        <span class="badge ${statusBadgeMap[status] || 'badge-warning'}">${statusLabelMap[status] || status}</span>
    </div>
    <div id="orderItemsList"><div class="empty" style="padding:10px;">${t('loading')}</div></div>
    <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 14px;margin:8px 0;">
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:var(--text-secondary);"><span>${t('subtotal')}</span><span>${money(subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:var(--text-secondary);"><span>${t('service_fee')} (${serviceFeePercent}%)</span><span>${money(sf)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:var(--text-secondary);"><span>${t('vat')} (${vatPercent}%)</span><span>${money(vat)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:6px 0 0 0;border-top:2px solid var(--border);font-weight:700;font-size:16px;color:var(--text-primary);"><span>${t('total')}</span><span style="color:var(--primary-dark);">${money(total)}</span></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        ${actionButtons}
        <button class="btn btn-ghost" style="flex:1;" onclick="closeSheet('tableOverlay')">${t('back')}</button>
    </div>
    <div class="error-text" id="tableSheetError"></div>`;
    loadOrderItems(activeOrder.id);
    openSheet('tableOverlay');
}

// ============================================================
// ORDER CREATION
// ============================================================
function addItemToOrder(item) {
    const existing = _orderItems.find(i => i.menu_item_id === item.id && !i.note);
    if (existing) {
        if (!isValidQuantity(existing.quantity + 1)) { showToast('⚠️ الحد الأقصى للكمية', 'error'); return; }
        existing.quantity++;
        existing.total = existing.quantity * existing.unit_price;
    } else {
        _orderItems.push({ menu_item_id: item.id, name: item.name, unit_price: item.price, quantity: 1, total: item.price, note: '' });
    }
    renderTableOrderItems();
    showToast(t('item_added_to_order', { name: item.name }), 'success');
}
function updateTableOrderItemNote(index, value) {
    const item = _orderItems[index];
    if (item) item.note = sanitizeNote(value);
}
function addTableOrderItem(index) {
    const item = _orderItems[index];
    if (!item || !isValidQuantity(item.quantity + 1)) return;
    item.quantity++; item.total = item.quantity * item.unit_price;
    renderTableOrderItems();
}
function removeTableOrderItem(index) {
    const item = _orderItems[index];
    if (!item) return;
    if (item.quantity > 1) { item.quantity--; item.total = item.quantity * item.unit_price; }
    else _orderItems.splice(index, 1);
    renderTableOrderItems();
}
function renderTableOrderItems() {
    const container = document.getElementById('tableOrderItems');
    if (!container) return;
    if (_orderItems.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:12px;">لم يتم إضافة أي صنف</div>';
        return;
    }
    container.innerHTML = `${_orderItems.map((item, index) => `
        <div class="order-item">
            <div style="flex:1;">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-details">
                    ${item.quantity} × ${money(item.unit_price)}
                    <button class="btn btn-xs" style="background:var(--danger);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:8px;" onclick="removeTableOrderItem(${index})"><i class="fa-solid fa-minus"></i></button>
                    <button class="btn btn-xs" style="background:var(--success);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;" onclick="addTableOrderItem(${index})"><i class="fa-solid fa-plus"></i></button>
                </div>
                <input type="text" class="item-note-input" maxlength="${MAX_NOTE_LENGTH}" placeholder="📝 ${t('item_note_placeholder')}" value="${escapeAttr(item.note || '')}" oninput="updateTableOrderItemNote(${index}, this.value)">
            </div>
            <div class="item-price">${money(item.total)}</div>
        </div>`).join('')}
        <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:2px solid var(--border);font-weight:700;">
            <span>${t('total')}</span>
            <span style="color:var(--primary-dark);">${money(_orderItems.reduce((s, i) => s + i.total, 0))}</span>
        </div>`;
}

async function createOrder(tableId) {
    const errEl = document.getElementById('tableSheetError');
    errEl.textContent = '';
    if (!hasPermission('create_orders')) { errEl.textContent = t('error_permission'); return; }
    if (_orderItems.length === 0) { errEl.textContent = t('error_no_items'); return; }
    if (!isValidUuid(tableId)) { errEl.textContent = t('error_invalid_input'); return; }
    const subtotal = _orderItems.reduce((s, i) => s + i.total, 0);
    const sf = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + sf) * (vatPercent / 100);
    const total = subtotal + sf + vat;
    try {
        // ✅ استخدم RPC عشان السعر يتحسب في السيرفر
        const { data: orderId, error } = await supabaseClient.rpc('create_staff_order', {
            p_business_id: business.id,
            p_table_id: tableId,
            p_items: _orderItems.map(i => ({ menu_item_id: i.menu_item_id, quantity: i.quantity, note: sanitizeNote(i.note) })),
            p_service_fee_pct: serviceFeePercent,
            p_vat_pct: vatPercent,
            p_created_by: currentUser?.name || 'نظام'
        });
        if (error) {
            console.error('create_staff_order error:', error);
            if (error.message?.includes('TABLE_NOT_AVAILABLE')) errEl.textContent = '⚠️ الطاولة مشغولة';
            else if (error.message?.includes('ITEM_NOT_FOUND')) errEl.textContent = '⚠️ صنف مش متاح';
            else errEl.textContent = t('error_general');
            return;
        }
        if (!orderId) { errEl.textContent = t('error_general'); return; }
        await supabaseClient.from('tables').update({ status: 'occupied' }).eq('id', tableId);
        _orderItems = [];
        closeSheet('tableOverlay');
        showToast(t('order_created'), 'success');
        await loadActiveOrders();
        await loadTables();
        renderTables(); renderKitchenOrders(); renderDashboard();
    } catch (e) {
        console.error('Error creating order:', e);
        errEl.textContent = t('error_general');
    }
}

// ============================================================
// PAYMENT
// ============================================================
function showPaymentSheet(orderId) {
    if (!hasPermission('payment') && currentUser?.type !== 'owner' && currentUser?.role !== 'cashier') {
        showToast(t('error_permission'), 'error'); return;
    }
    const order = Object.values(orders).find(o => o.id === orderId);
    if (!order) return;
    const subtotal = order.subtotal || order.total || 0;
    const sf = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + sf) * (vatPercent / 100);
    const total = subtotal + sf + vat;
    const body = document.getElementById('tableSheetBody');
    body.innerHTML = `<div class="section-title">${t('select_payment')}</div>
        <div class="payment-grid" id="paymentGrid">
            ${paymentMethods.map(pm => `<button class="payment-card" onclick="confirmPayment('${escapeAttr(orderId)}','${escapeAttr(pm.id)}')">
                <i class="fa-solid ${escapeAttr(pm.icon || 'fa-money-bill-wave')}"></i>
                <div>${escapeHtml(pm.name)}</div>
            </button>`).join('')}
        </div>
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 14px;margin:12px 0;text-align:center;">
            <div style="font-size:13px;color:var(--text-secondary);">${t('total')}</div>
            <div style="font-size:22px;font-weight:800;color:var(--primary-dark);">${money(total)}</div>
        </div>
        <button class="btn btn-ghost btn-block" onclick="openTableSheet('${escapeAttr(order.table_id)}')">${t('cancel')}</button>
        <div class="error-text" id="tableSheetError"></div>`;
}

async function confirmPayment(orderId, paymentMethodId) {
    if (!hasPermission('payment') && currentUser?.type !== 'owner' && currentUser?.role !== 'cashier') {
        showToast(t('error_permission'), 'error'); return;
    }
    if (!isValidUuid(orderId) || !isValidUuid(paymentMethodId)) { showToast(t('error_invalid_input'), 'error'); return; }
    try {
        // ✅ RPC: pay_order (السيرفر بيحسب الإجمالي ويسجل الدفع)
        const { error } = await supabaseClient.rpc('pay_order', {
            p_order_id: orderId,
            p_business_id: business.id,
            p_payment_method_id: paymentMethodId,
            p_paid_by: currentUser?.name || 'نظام'
        });
        if (error) {
            console.error('pay_order error:', error);
            showToast(t('payment_failed'), 'error');
            return;
        }
        showToast(t('payment_success'), 'success');
        closeSheet('tableOverlay');
        await loadActiveOrders();
        await loadTables();
        renderTables(); renderKitchenOrders(); renderDashboard();
    } catch (e) {
        console.error('Error processing payment:', e);
        showToast(t('payment_failed'), 'error');
    }
}

async function printReceipt(orderId) {
    if (!hasPermission('print_receipt')) { showToast(t('error_permission'), 'error'); return; }
    const order = Object.values(orders).find(o => o.id === orderId);
    if (!order) return;
    const { data: items } = await supabaseClient.from('order_items').select('*, menu_items(*)').eq('order_id', orderId);
    const table = tables.find(t => t.id === order.table_id);
    const subtotal = order.subtotal || 0;
    const sf = subtotal * (serviceFeePercent / 100);
    const vat = (subtotal + sf) * (vatPercent / 100);
    const total = subtotal + sf + vat;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { showToast('⚠️ منع المتصفح فتح نافذة الطباعة', 'warning'); return; }
    const receiptHTML = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Receipt</title>
    <style>body{font-family:Cairo,sans-serif;max-width:300px;margin:20px auto;padding:10px;text-align:center;}
    h2{margin:4px 0;} .row{display:flex;justify-content:space-between;padding:2px 0;font-size:13px;}
    .total{border-top:2px dashed #000;margin-top:8px;padding-top:8px;font-weight:800;font-size:16px;}
    .items{border-top:1px dashed #999;border-bottom:1px dashed #999;padding:8px 0;margin:8px 0;text-align:right;}</style>
    </head><body>
        <h2>${escapeHtml(business.name)}</h2>
        <div style="font-size:12px;color:#666;">${escapeHtml(business.code)}</div>
        <hr>
        <div>طاولة ${escapeHtml(table?.number || '?')}</div>
        <div style="font-size:12px;">${new Date(order.created_at).toLocaleString('ar-EG')}</div>
        <div class="items">
            ${(items || []).map(i => `<div class="row"><span>${i.quantity}× ${escapeHtml(i.menu_items?.name || '')}</span><span>${money(i.total)}</span></div>`).join('')}
        </div>
        <div class="row"><span>${t('subtotal')}</span><span>${money(subtotal)}</span></div>
        <div class="row"><span>${t('service_fee')}</span><span>${money(sf)}</span></div>
        <div class="row"><span>${t('vat')}</span><span>${money(vat)}</span></div>
        <div class="total"><span>${t('total')}</span><span>${money(total)}</span></div>
        <p style="font-size:11px;margin-top:12px;">شكراً لزيارتكم</p>
        <script>window.onload=function(){window.print();}<\/script>
    </body></html>`;
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
}

// ============================================================
// MENU VIEW / MANAGEMENT
// ============================================================
function renderMenuView() {
    const container = document.getElementById('menuView');
    if (!container) return;
    if (menuItems.length === 0) {
        container.innerHTML = `<div class="empty"><i class="fa-solid fa-utensils"></i>${t('no_items')}</div>`;
        return;
    }
    const grouped = {};
    menuItems.forEach(item => {
        const catId = item.category_id || 'uncategorized';
        (grouped[catId] = grouped[catId] || []).push(item);
    });
    let html = '';
    Object.entries(grouped).forEach(([catId, items]) => {
        const cat = menuCategories.find(c => c.id === catId);
        html += `<div class="section-title" style="margin-top:16px;">${cat ? `<i class="fa-solid ${escapeAttr(cat.icon || 'fa-utensils')}"></i> ${escapeHtml(cat.name)}` : `📂 ${t('menu_categories')}`}</div>
            <div class="menu-grid">${items.map(item => `
                <div class="menu-item-card">
                    ${item.image_url && isSafeImageUrl(item.image_url) ? `<img src="${escapeAttr(item.image_url)}" alt="${escapeAttr(item.name)}" class="menu-item-img" onerror="this.style.display='none'">` : ''}
                    <div class="menu-item-name">${escapeHtml(item.name)}</div>
                    ${item.description ? `<div class="menu-item-desc">${escapeHtml(item.description)}</div>` : ''}
                    <div class="menu-item-price">${money(item.price)} ج.م</div>
                </div>`).join('')}
            </div>`;
    });
    container.innerHTML = html;
}

function renderMenuManagement() {
    const container = document.getElementById('menuManagementList');
    if (!container) return;
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') {
        container.innerHTML = `<div class="empty">${t('error_permission')}</div>`;
        return;
    }
    if (menuItems.length === 0) {
        container.innerHTML = `<div class="empty">${t('no_items')}</div>`;
        return;
    }
    container.innerHTML = menuItems.map(item => `
        <div class="list-row">
            <div>
                <div class="row-title">${escapeHtml(item.name)}</div>
                <div class="row-sub">${money(item.price)} ج.م${item.category_id ? ' · ' + escapeHtml(menuCategories.find(c => c.id === item.category_id)?.name || '') : ''}</div>
            </div>
            <div style="display:flex;gap:6px;">
                <button class="btn btn-ghost btn-sm" onclick="openMenuItemSheet('${escapeAttr(item.id)}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteMenuItem('${escapeAttr(item.id)}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`).join('');
}

function openMenuItemSheet(itemId = null) {
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') {
        showToast(t('error_permission'), 'error'); return;
    }
    const errEl = document.getElementById('menuItemError');
    errEl.textContent = '';
    document.getElementById('editMenuItemId').value = '';
    document.getElementById('menuItemName').value = '';
    document.getElementById('menuItemPrice').value = '';
    document.getElementById('menuItemDesc').value = '';
    document.getElementById('menuItemImageData').value = '';
    document.getElementById('menuItemImagePreview').style.display = 'none';
    document.getElementById('menuItemImageInput').value = '';
    document.getElementById('menuItemActive').checked = true;

    const catSelect = document.getElementById('menuItemCategory');
    catSelect.innerHTML = `<option value="">بدون تصنيف</option>${menuCategories.map(c => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.name)}</option>`).join('')}`;

    if (itemId) {
        const item = menuItems.find(i => i.id === itemId);
        if (!item) return;
        document.getElementById('menuItemSheetTitle').textContent = t('edit');
        document.getElementById('editMenuItemId').value = item.id;
        document.getElementById('menuItemName').value = item.name;
        document.getElementById('menuItemPrice').value = item.price;
        document.getElementById('menuItemDesc').value = item.description || '';
        document.getElementById('menuItemActive').checked = item.is_active !== false;
        if (item.category_id) catSelect.value = item.category_id;
        if (item.image_url && isSafeImageUrl(item.image_url)) {
            document.getElementById('menuItemImageData').value = item.image_url;
            document.getElementById('menuItemImagePreviewImg').src = item.image_url;
            document.getElementById('menuItemImagePreview').style.display = 'block';
        }
        document.getElementById('deleteMenuItemBtn').style.display = 'block';
    } else {
        document.getElementById('menuItemSheetTitle').textContent = t('add_item');
        document.getElementById('deleteMenuItemBtn').style.display = 'none';
    }
    openSheet('menuItemOverlay');
}

async function saveMenuItem() {
    const errEl = document.getElementById('menuItemError');
    errEl.textContent = '';
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') { errEl.textContent = t('error_permission'); return; }
    const id = document.getElementById('editMenuItemId').value;
    const name = document.getElementById('menuItemName').value.trim();
    const price = document.getElementById('menuItemPrice').value;
    const desc = document.getElementById('menuItemDesc').value.trim();
    const categoryId = document.getElementById('menuItemCategory').value;
    const imageData = document.getElementById('menuItemImageData').value;
    const isActive = document.getElementById('menuItemActive').checked;
    if (!name || name.length > 100) { errEl.textContent = t('error_invalid_input'); return; }
    if (!isValidPrice(price)) { errEl.textContent = t('error_invalid_input'); return; }
    if (desc.length > 500) { errEl.textContent = t('error_invalid_input'); return; }
    if (imageData && !isSafeImageUrl(imageData)) { errEl.textContent = t('error_upload'); return; }
    const payload = {
        business_id: business.id,
        name: sanitizeString(name, 100),
        price: Number(price),
        description: desc ? sanitizeString(desc, 500) : null,
        category_id: categoryId || null,
        image_url: imageData || null,
        is_active: isActive
    };
    try {
        if (id) {
            const { error } = await supabaseClient.from('menu_items').update(payload).eq('id', id);
            if (error) throw error;
            showToast(t('item_updated'), 'success');
        } else {
            const { error } = await supabaseClient.from('menu_items').insert(payload);
            if (error) throw error;
            showToast(t('item_added'), 'success');
        }
        closeSheet('menuItemOverlay');
        await loadMenuItems();
        renderMenuManagement(); renderMenuView();
    } catch (e) {
        console.error('Error saving menu item:', e);
        errEl.textContent = t('error_general');
    }
}

async function deleteMenuItem(itemId) {
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    if (!confirm(t('delete') + '؟')) return;
    try {
        const { error } = await supabaseClient.from('menu_items').update({ is_active: false }).eq('id', itemId);
        if (error) throw error;
        showToast(t('item_deleted'), 'success');
        closeSheet('menuItemOverlay');
        await loadMenuItems();
        renderMenuManagement(); renderMenuView();
    } catch (e) { console.error(e); showToast(t('error_general'), 'error'); }
}

function openCategorySheet() {
    if (!hasPermission('manage_menu') && currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = 'fa-mug-hot';
    document.getElementById('categoryError').textContent = '';
    openSheet('categoryOverlay');
}

async function saveCategory() {
    const errEl = document.getElementById('categoryError');
    errEl.textContent = '';
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value;
    if (!name || name.length > 50) { errEl.textContent = t('error_invalid_input'); return; }
    if (!/^fa-[a-z0-9-]+$/.test(icon)) { errEl.textContent = t('error_invalid_input'); return; }
    try {
        const { error } = await supabaseClient.from('menu_categories').insert({
            business_id: business.id, name: sanitizeString(name, 50), icon, is_active: true
        });
        if (error) throw error;
        showToast(t('category_added'), 'success');
        closeSheet('categoryOverlay');
        await loadMenuCategories();
        renderMenuManagement(); renderMenuView();
    } catch (e) { console.error(e); errEl.textContent = t('error_general'); }
}

// ============================================================
// EMPLOYEES
// ============================================================
function openEmployeeSheet(empId = null) {
    if (currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    const errEl = document.getElementById('employeeError');
    errEl.textContent = '';
    document.getElementById('editEmployeeId').value = '';
    document.getElementById('employeeName').value = '';
    document.getElementById('employeePin').value = '';
    document.getElementById('employeeRole').value = 'waiter';
    ['permDashboard', 'permTables', 'permOrders', 'permMenu', 'permSettings',
     'permCreateOrders', 'permAddExpense', 'permCloseShift', 'permPrintReceipt',
     'permManageMenu', 'permViewRevenue', 'permViewExpenses'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = ['permDashboard', 'permTables', 'permOrders', 'permMenu', 'permCreateOrders', 'permPrintReceipt'].includes(id);
    });

    if (empId) {
        const emp = employees.find(e => e.id === empId);
        if (!emp) return;
        document.getElementById('editEmployeeId').value = emp.id;
        document.getElementById('employeeName').value = emp.name;
        document.getElementById('employeeRole').value = emp.role || 'waiter';
        const perms = emp.permissions || {};
        const permMap = {
            permDashboard: 'dashboard', permTables: 'tables', permOrders: 'orders',
            permMenu: 'menu', permSettings: 'settings', permCreateOrders: 'create_orders',
            permAddExpense: 'add_expense', permCloseShift: 'close_shift',
            permPrintReceipt: 'print_receipt', permManageMenu: 'manage_menu',
            permViewRevenue: 'view_revenue', permViewExpenses: 'view_expenses'
        };
        Object.entries(permMap).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el) el.checked = !!perms[key];
        });
        document.getElementById('deleteEmployeeBtn').style.display = 'block';
    } else {
        document.getElementById('deleteEmployeeBtn').style.display = 'none';
    }
    openSheet('employeeOverlay');
}

async function saveEmployee() {
    const errEl = document.getElementById('employeeError');
    errEl.textContent = '';
    if (currentUser?.type !== 'owner') { errEl.textContent = t('error_permission'); return; }
    const id = document.getElementById('editEmployeeId').value;
    const name = document.getElementById('employeeName').value.trim();
    const pin = document.getElementById('employeePin').value.trim();
    const role = document.getElementById('employeeRole').value;
    const permissions = {
        dashboard: document.getElementById('permDashboard').checked,
        tables: document.getElementById('permTables').checked,
        orders: document.getElementById('permOrders').checked,
        menu: document.getElementById('permMenu').checked,
        settings: document.getElementById('permSettings').checked,
        create_orders: document.getElementById('permCreateOrders').checked,
        add_expense: document.getElementById('permAddExpense').checked,
        close_shift: document.getElementById('permCloseShift').checked,
        print_receipt: document.getElementById('permPrintReceipt').checked,
        manage_menu: document.getElementById('permManageMenu').checked,
        view_revenue: document.getElementById('permViewRevenue').checked,
        view_expenses: document.getElementById('permViewExpenses').checked
    };
    if (!name || name.length > 60) { errEl.textContent = t('error_invalid_input'); return; }
    if (!['waiter', 'chef', 'cashier', 'admin'].includes(role)) { errEl.textContent = t('error_invalid_input'); return; }
    if (!id) {
        if (!isValidPin(pin)) { errEl.textContent = 'PIN لازم يكون 4-8 أرقام'; return; }
    } else if (pin && !isValidPin(pin)) {
        errEl.textContent = 'PIN لازم يكون 4-8 أرقام'; return;
    }
    try {
        // ✅ RPC لإضافة/تعديل موظف مع bcrypt hash للـ PIN
        if (id) {
            const { error } = await supabaseClient.rpc('upsert_employee', {
                p_business_id: business.id,
                p_employee_id: id,
                p_name: sanitizeString(name, 60),
                p_pin: pin || null,
                p_role: role,
                p_permissions: permissions
            });
            if (error) throw error;
            showToast(t('employee_updated'), 'success');
        } else {
            const { error } = await supabaseClient.rpc('upsert_employee', {
                p_business_id: business.id,
                p_employee_id: null,
                p_name: sanitizeString(name, 60),
                p_pin: pin,
                p_role: role,
                p_permissions: permissions
            });
            if (error) throw error;
            showToast(t('employee_added'), 'success');
        }
        closeSheet('employeeOverlay');
        await loadEmployees();
        renderSettings();
    } catch (e) {
        console.error('Error saving employee:', e);
        errEl.textContent = e.message?.includes('PIN_TAKEN') ? '⚠️ الـ PIN مستخدم بالفعل' : t('error_general');
    }
}

async function deleteEmployee(empId) {
    if (currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    if (!confirm(t('delete') + '؟')) return;
    try {
        const { error } = await supabaseClient.rpc('deactivate_employee', {
            p_business_id: business.id, p_employee_id: empId
        });
        if (error) throw error;
        showToast(t('employee_deleted'), 'success');
        closeSheet('employeeOverlay');
        await loadEmployees();
        renderSettings();
    } catch (e) { console.error(e); showToast(t('error_general'), 'error'); }
}

// ============================================================
// PAYMENT METHODS
// ============================================================
function openPaymentMethodSheet(pmId = null) {
    if (currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    document.getElementById('paymentMethodError').textContent = '';
    document.getElementById('editPaymentMethodId').value = '';
    document.getElementById('paymentMethodName').value = '';
    document.getElementById('paymentMethodIcon').value = 'fa-money-bill-wave';
    if (pmId) {
        const pm = paymentMethods.find(p => p.id === pmId);
        if (!pm) return;
        document.getElementById('editPaymentMethodId').value = pm.id;
        document.getElementById('paymentMethodName').value = pm.name;
        document.getElementById('paymentMethodIcon').value = pm.icon || 'fa-money-bill-wave';
        document.getElementById('deletePaymentMethodBtn').style.display = 'block';
    } else {
        document.getElementById('deletePaymentMethodBtn').style.display = 'none';
    }
    openSheet('paymentMethodOverlay');
}
async function savePaymentMethod() {
    const errEl = document.getElementById('paymentMethodError');
    errEl.textContent = '';
    if (currentUser?.type !== 'owner') { errEl.textContent = t('error_permission'); return; }
    const id = document.getElementById('editPaymentMethodId').value;
    const name = document.getElementById('paymentMethodName').value.trim();
    const icon = document.getElementById('paymentMethodIcon').value;
    if (!name || name.length > 50) { errEl.textContent = t('error_invalid_input'); return; }
    if (!/^fa-[a-z0-9-]+$/.test(icon)) { errEl.textContent = t('error_invalid_input'); return; }
    const payload = { business_id: business.id, name: sanitizeString(name, 50), icon, is_active: true };
    try {
        if (id) await supabaseClient.from('payment_methods').update(payload).eq('id', id);
        else await supabaseClient.from('payment_methods').insert(payload);
        showToast(t('payment_method_added'), 'success');
        closeSheet('paymentMethodOverlay');
        await loadPaymentMethods();
        renderSettings();
    } catch (e) { console.error(e); errEl.textContent = t('error_general'); }
}

// ============================================================
// EXPENSES
// ============================================================
function openExpenseSheet() {
    if (!hasPermission('add_expense')) { showToast(t('error_permission'), 'error'); return; }
    document.getElementById('expenseDesc').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseError').textContent = '';
    openSheet('expenseOverlay');
}
async function saveExpense() {
    const errEl = document.getElementById('expenseError');
    errEl.textContent = '';
    const desc = document.getElementById('expenseDesc').value.trim();
    const amount = document.getElementById('expenseAmount').value;
    if (!desc || desc.length > 200) { errEl.textContent = t('error_invalid_input'); return; }
    if (!isValidExpenseAmount(amount)) { errEl.textContent = t('error_invalid_input'); return; }
    if (!currentShift || currentShift.id.toString().startsWith('temp_')) { errEl.textContent = '⚠️ لا يوجد شيفت مفتوح'; return; }
    if (!hasPermission('add_expense')) { errEl.textContent = t('error_permission'); return; }
    try {
        const { error } = await supabaseClient.from('expenses').insert({
            business_id: business.id, shift_id: currentShift.id,
            description: sanitizeString(desc, 200), amount: Number(amount),
            created_by: currentUser?.name || 'نظام'
        });
        if (error) throw error;
        closeSheet('expenseOverlay');
        showToast(t('expense_added'), 'success');
        renderDashboard();
    } catch (e) { console.error('Error saving expense:', e); errEl.textContent = t('error_general'); }
}

// ============================================================
// TABLE MANAGEMENT
// ============================================================
function openTableManagement(tableId = null) {
    if (currentUser?.type !== 'owner') { showToast(t('error_permission'), 'error'); return; }
    editingTableId = tableId;
    document.getElementById('tableManagementError').textContent = '';
    if (tableId) {
        const t0 = tables.find(x => x.id === tableId);
        if (!t0) return;
        document.getElementById('editTableNumber').value = t0.number;
        document.getElementById('editTableCapacity').value = t0.capacity || 4;
        document.getElementById('editTableStatus').value = t0.status;
        document.getElementById('deleteTableBtn').style.display = 'block';
    } else {
        document.getElementById('editTableNumber').value = '';
        document.getElementById('editTableCapacity').value = 4;
        document.getElementById('editTableStatus').value = 'available';
        document.getElementById('deleteTableBtn').style.display = 'none';
    }
    openSheet('tableManagementOverlay');
}
async function saveTableManagement() {
    const errEl = document.getElementById('tableManagementError');
    errEl.textContent = '';
    if (currentUser?.type !== 'owner') { errEl.textContent = t('error_permission'); return; }
    const number = document.getElementById('editTableNumber').value;
    const capacity = document.getElementById('editTableCapacity').value;
    const status = document.getElementById('editTableStatus').value;
    if (!isValidTableNumber(number)) { errEl.textContent = t('error_invalid_input'); return; }
    if (!isValidCapacity(capacity)) { errEl.textContent = t('error_invalid_input'); return; }
    if (!['available', 'occupied', 'reserved'].includes(status)) { errEl.textContent = t('error_invalid_input'); return; }
    const payload = { business_id: business.id, number: Number(number), capacity: Number(capacity), status };
    try {
        if (editingTableId) await supabaseClient.from('tables').update(payload).eq('id', editingTableId);
        else await supabaseClient.from('tables').insert(payload);
        showToast(editingTableId ? t('table_updated') : t('table_added'), 'success');
        closeSheet('tableManagementOverlay');
        await loadTables();
        renderTables(); renderDashboard();
    } catch (e) { console.error(e); errEl.textContent = t('error_general'); }
}
async function deleteTableFromSheet() {
    if (currentUser?.type !== 'owner' || !editingTableId) return;
    if (!confirm(t('delete_table_confirm'))) return;
    try {
        const { error } = await supabaseClient.from('tables').delete().eq('id', editingTableId);
        if (error) throw error;
        showToast(t('table_deleted'), 'success');
        closeSheet('tableManagementOverlay');
        await loadTables();
        renderTables(); renderDashboard();
    } catch (e) { console.error(e); showToast(t('error_general'), 'error'); }
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
    const container = document.getElementById('settingsContent');
    if (!container) return;
    const isOwner = currentUser?.type === 'owner';
    container.innerHTML = `
        <div class="list-row">
            <div class="row-title">🎨 ${t('appearance')}</div>
            <div class="row-value">
                <label class="switch"><input type="checkbox" id="themeToggle" ${localStorage.getItem('platepro_theme') === 'light' ? 'checked' : ''} onchange="toggleTheme()"><span class="slider"></span></label>
                <span id="themeToggleLabel" style="margin-right:8px;font-size:13px;">${localStorage.getItem('platepro_theme') === 'light' ? t('light') : t('dark')}</span>
            </div>
        </div>
        <div class="list-row" onclick="openLogoSettings()" style="cursor:pointer;">
            <div class="row-title">🖼️ ${t('logo')}</div>
            <div class="row-value">${businessLogo ? `<img src="${escapeAttr(businessLogo)}" style="width:32px;height:32px;border-radius:50%;">` : t('no_logo')} <i class="fa-solid fa-chevron-left"></i></div>
        </div>
        <div class="list-row" onclick="openFeesSettings()" style="cursor:pointer;">
            <div class="row-title">💰 ${t('fees')}</div>
            <div class="row-value">${serviceFeePercent}% / ${vatPercent}% <i class="fa-solid fa-chevron-left"></i></div>
        </div>
        ${isOwner ? `
        <div class="section-title">💳 ${t('payment_methods')}</div>
        <div class="panel">
            ${paymentMethods.map(pm => `<div class="list-row"><div class="row-title"><i class="fa-solid ${escapeAttr(pm.icon)}"></i> ${escapeHtml(pm.name)}</div>
                <button class="btn btn-ghost btn-sm" onclick="openPaymentMethodSheet('${escapeAttr(pm.id)}')"><i class="fa-solid fa-pen"></i></button></div>`).join('')}
            <button class="btn btn-primary btn-sm" onclick="openPaymentMethodSheet()"><i class="fa-solid fa-plus"></i> ${t('add_payment_method')}</button>
        </div>
        <div class="section-title">👥 ${t('employees')}</div>
        <div class="panel">
            ${employees.length === 0 ? `<div class="empty">${t('no_employees')}</div>` :
              employees.map(emp => `<div class="list-row"><div class="row-title">${escapeHtml(emp.name)} <span class="badge">${emp.role}</span></div>
                <button class="btn btn-ghost btn-sm" onclick="openEmployeeSheet('${escapeAttr(emp.id)}')"><i class="fa-solid fa-pen"></i></button></div>`).join('')}
            <button class="btn btn-primary btn-sm" onclick="openEmployeeSheet()"><i class="fa-solid fa-plus"></i> ${t('add_employee')}</button>
        </div>
        <div class="section-title">🪑 ${t('manage_tables')}</div>
        <div class="panel">
            ${tables.map(tb => `<div class="list-row"><div class="row-title">طاولة ${escapeHtml(tb.number)} (${tb.capacity || 4})</div>
                <button class="btn btn-ghost btn-sm" onclick="openTableManagement('${escapeAttr(tb.id)}')"><i class="fa-solid fa-pen"></i></button></div>`).join('')}
            <button class="btn btn-primary btn-sm" onclick="openTableManagement()"><i class="fa-solid fa-plus"></i> ${t('add_table')}</button>
        </div>` : ''}
        <button class="btn btn-ghost btn-block" style="margin-top:20px;" onclick="lockApp()"><i class="fa-solid fa-lock"></i> ${t('lock') || 'قفل'}</button>
    `;
}

// ============================================================
// EVENT WIRING (بدل onclick في HTML + داخل JS)
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    loadTheme(); loadFeesSettings(); loadLogo();
    initCustomerPage(); initAudio();

    const logoInput = document.getElementById('logoInput');
    if (logoInput) logoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { document.getElementById('logoError').textContent = '⚠️ الملف مش صورة'; return; }
        if (file.size > 2 * 1024 * 1024) { document.getElementById('logoError').textContent = '⚠️ الصورة أكبر من 2MB'; return; }
        const reader = new FileReader();
        reader.onload = ev => {
            document.getElementById('logoPreviewImg').src = ev.target.result;
            document.getElementById('logoPreview').style.display = 'block';
            document.getElementById('removeLogoBtn').style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
    });

    const menuImageInput = document.getElementById('menuItemImageInput');
    if (menuImageInput) menuImageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { document.getElementById('menuItemError').textContent = '⚠️ الملف مش صورة'; return; }
        if (file.size > 2 * 1024 * 1024) { document.getElementById('menuItemError').textContent = '⚠️ الصورة أكبر من 2MB'; return; }
        const reader = new FileReader();
        reader.onload = ev => {
            document.getElementById('menuItemImagePreviewImg').src = ev.target.result;
            document.getElementById('menuItemImagePreview').style.display = 'block';
            document.getElementById('menuItemImageData').value = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
});
