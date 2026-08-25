/* ============================================================
   ROOT — DARK MODE (Default)
   ============================================================ */
:root {
    --primary: #E8B84B;
    --primary-dark: #C99A2E;
    --primary-light: #F5E6B8;
    --primary-glow: rgba(232, 184, 75, 0.2);
    
    --bg: #0D0D1A;
    --bg-card: #1A1A2E;
    --bg-input: #2A2A40;
    --bg-hover: #2A2A40;
    --bg-overlay: rgba(0,0,0,0.7);
    
    --text-primary: #EEEEF0;
    --text-secondary: #9A9AB0;
    --text-muted: #6A6A80;
    --text-white: #FFFFFF;
    
    --success: #2D9B4E;
    --success-bg: #1A3A28;
    --danger: #E74C3C;
    --danger-bg: #3A1A1A;
    --warning: #F59E0B;
    --warning-bg: #3A2A1A;
    --info: #3B82F6;
    --info-bg: #1A2A3A;
    
    --border: #2A2A40;
    --border-light: #2A2A40;
    --shadow: 0 2px 12px rgba(0,0,0,0.3);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.4);
    --shadow-gold: 0 4px 24px rgba(232, 184, 75, 0.35);
    
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 32px;
    
    --font: 'Cairo', sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    
    --header-bg: rgba(26, 26, 46, 0.92);
    --nav-bg: rgba(26, 26, 46, 0.95);
}

/* ============================================================
   LIGHT MODE
   ============================================================ */
[data-theme="light"] {
    --bg: #F7F5F0;
    --bg-card: #FFFFFF;
    --bg-input: #F0EDE8;
    --bg-hover: #EBE8E0;
    --bg-overlay: rgba(0,0,0,0.4);
    
    --text-primary: #1A1A2E;
    --text-secondary: #5A5A7A;
    --text-muted: #9A9AB0;
    
    --border: #E5E2D9;
    --border-light: #F0EDE6;
    --shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    --shadow-lg: 0 8px 40px rgba(26, 26, 46, 0.1);
    
    --header-bg: rgba(255,255,255,0.88);
    --nav-bg: rgba(255,255,255,0.95);
    
    --success-bg: #E8F5ED;
    --danger-bg: #FDE8EA;
    --warning-bg: #FEF3E2;
    --info-bg: #EBF3FE;
}

/* ============================================================
   THEME FROM LOGO — يتم تطبيقه ديناميكياً
   ============================================================ */
[data-logo-theme="true"] {
    --primary: var(--logo-primary, #E8B84B);
    --primary-dark: var(--logo-primary-dark, #C99A2E);
    --primary-light: var(--logo-primary-light, #F5E6B8);
    --primary-glow: var(--logo-primary-glow, rgba(232, 184, 75, 0.2));
    --shadow-gold: var(--logo-shadow-gold, 0 4px 24px rgba(232, 184, 75, 0.35));
}

/* ============================================================
   BADGES
   ============================================================ */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    transition: all 0.3s var(--ease);
    border: 1px solid transparent;
}
.badge-success { background: #22C55E; color: #FFFFFF !important; border-color: #16A34A; }
.badge-danger { background: #EF4444; color: #FFFFFF !important; border-color: #DC2626; }
.badge-warning { background: #F59E0B; color: #1A1A2E !important; border-color: #D97706; }
.badge-info { background: #3B82F6; color: #FFFFFF !important; border-color: #2563EB; }
.badge-gold { background: var(--primary); color: var(--text-primary) !important; border-color: var(--primary-dark); }
.badge-inactive { background: #6B7280; color: #FFFFFF !important; border-color: #4B5563; }
.badge-purple { background: #8B5CF6; color: #FFFFFF !important; border-color: #7C3AED; }
.badge-teal { background: #14B8A6; color: #FFFFFF !important; border-color: #0D9488; }
.badge-ready-table { background: #22C55E; color: #FFFFFF !important; border-color: #16A34A; }
.badge-paid { background: #8B5CF6; color: #FFFFFF !important; border-color: #7C3AED; }
.badge-cancelled { background: #6B7280; color: #FFFFFF !important; border-color: #4B5563; }
.badge-shift-open { background: #22C55E; color: #FFFFFF !important; border-color: #16A34A; }
.badge-shift-closed { background: #6B7280; color: #FFFFFF !important; border-color: #4B5563; }

/* ============================================================
   THEME TOGGLE
   ============================================================ */
.theme-toggle {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    background: var(--bg-input);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-light);
    transition: all 0.3s var(--ease);
}
.theme-toggle .toggle-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    transition: color 0.3s var(--ease);
}
.theme-toggle .toggle-switch {
    position: relative;
    width: 56px;
    height: 30px;
    background: var(--border);
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    flex-shrink: 0;
}
.theme-toggle .toggle-switch .toggle-slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    background: var(--bg-card);
    border-radius: 50%;
    transition: all 0.3s var(--ease);
    box-shadow: var(--shadow);
}
.theme-toggle .toggle-switch.active {
    background: var(--primary);
}
.theme-toggle .toggle-switch.active .toggle-slider {
    left: 29px;
}
.theme-toggle .toggle-icons {
    display: flex;
    gap: 8px;
    font-size: 18px;
}
.theme-toggle .toggle-icons .icon-sun { color: #F59E0B; }
.theme-toggle .toggle-icons .icon-moon { color: #9A9AB0; }
[data-theme="light"] .theme-toggle .toggle-icons .icon-moon { color: #9A9AB0; }
[data-theme="light"] .theme-toggle .toggle-icons .icon-sun { color: #F59E0B; }

/* ============================================================
   BASE STYLES
   ============================================================ */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    padding-bottom: 80px;
    -webkit-font-smoothing: antialiased;
    transition: background 0.3s var(--ease), color 0.3s var(--ease);
}

.screen { display: none; min-height: 100vh; }
.screen.active { display: block; }

.centered-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
    background: var(--bg);
    transition: background 0.3s var(--ease);
}

.brand-mark {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.3em;
    color: var(--primary);
    text-transform: uppercase;
    margin-bottom: 4px;
    transition: color 0.3s var(--ease);
}

.brand-title {
    font-size: 32px;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 28px;
    transition: color 0.3s var(--ease);
}
.brand-title .gold { color: var(--primary); }

.card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 28px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-light);
    transition: all 0.3s var(--ease);
}

.field {
    margin-bottom: 18px;
    text-align: right;
}
.field label {
    display: block;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 6px;
    font-weight: 600;
    transition: color 0.3s var(--ease);
}
.field input, .field select, .field textarea {
    width: 100%;
    padding: 14px 18px;
    background: var(--bg-input);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 16px;
    outline: none;
    font-family: var(--font);
    transition: all 0.25s var(--ease);
}
.field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 4px var(--primary-glow);
}
.field input.mono { font-family: var(--mono); }

/* ============================================================
   BUTTONS
   ============================================================ */
.btn {
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    padding: 14px 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s var(--ease);
    touch-action: manipulation;
}
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-block { width: 100%; }

.btn-primary {
    background: var(--primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-gold);
}
.btn-primary:hover { 
    transform: translateY(-2px);
    box-shadow: 0 6px 32px rgba(232, 184, 75, 0.45);
}

.btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
}
.btn-outline:hover { background: var(--primary); color: var(--text-primary); }

.btn-ghost {
    background: transparent;
    border: 2px solid var(--border);
    color: var(--text-secondary);
}
.btn-ghost:hover { background: var(--bg-input); border-color: var(--text-muted); }

.btn-success {
    background: var(--success);
    color: #fff;
}
.btn-success:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-danger {
    background: var(--danger);
    color: #fff;
}
.btn-danger:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-sm { padding: 8px 16px; font-size: 13px; }
.btn-xs { padding: 4px 12px; font-size: 11px; }

/* ============================================================
   TOAST
   ============================================================ */
.toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 440px;
    width: 90%;
    padding: 16px 24px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    z-index: 999;
    display: none;
    color: #fff;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s var(--ease);
}
@keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.toast.success { background: var(--success); }
.toast.error { background: var(--danger); }
.toast.warning { background: var(--warning); }
.toast.info { background: var(--info); }

.error-text { color: var(--danger); font-size: 13px; margin-top: 10px; min-height: 18px; }

/* ============================================================
   APP HEADER
   ============================================================ */
.app-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--header-bg);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-light);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s var(--ease);
    gap: 8px;
}
.app-header .biz-name {
    font-weight: 800;
    font-size: 16px;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}
.app-header .biz-sub {
    font-size: 10px;
    color: var(--text-muted);
    font-family: var(--mono);
    transition: color 0.3s var(--ease);
}
.app-header .shift-badge {
    font-size: 9px;
    padding: 2px 10px;
    border-radius: 12px;
    background: var(--success-bg);
    color: var(--success);
    font-weight: 600;
    border: 1px solid var(--success);
}
.app-header .shift-badge.closed {
    background: var(--danger-bg);
    color: var(--danger);
    border-color: var(--danger);
}

.header-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

.icon-btn {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--border-light);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s var(--ease);
}
.icon-btn:hover { background: var(--bg-input); color: var(--text-primary); }

.live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 3px rgba(45, 155, 78, 0.2);
    animation: pulseLive 1.8s infinite;
}
@keyframes pulseLive {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

/* ============================================================
   VIEWS
   ============================================================ */
.view { display: none; padding: 16px; max-width: 680px; margin: 0 auto; }
.view.active { display: block; animation: fadeIn 0.3s var(--ease); }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}

.section-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 20px 0 12px;
    transition: color 0.3s var(--ease);
}
.section-title:first-child { margin-top: 0; }

/* ============================================================
   STATS
   ============================================================ */
.stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}
.stat-card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    padding: 16px 18px;
    border: 1px solid var(--border-light);
    transition: all 0.2s var(--ease);
    position: relative;
    overflow: hidden;
}
.stat-card:hover { transform: translateY(-2px); }

.stat-card.revenue {
    background: linear-gradient(145deg, var(--primary), var(--primary-dark));
    border-color: var(--primary);
    grid-column: 1 / -1;
    text-align: center;
    padding: 20px;
    color: #fff;
}
.stat-card.revenue .brand-name {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 0.05em;
}
.stat-card.revenue .brand-sub {
    font-size: 12px;
    opacity: 0.8;
}
.stat-card.revenue .stat-label {
    font-size: 13px;
    opacity: 0.9;
    font-weight: 600;
}
.stat-card.revenue .stat-value {
    font-size: 38px;
    font-weight: 900;
    color: #fff;
}
.stat-card.revenue .stat-value .currency {
    font-size: 18px;
    opacity: 0.7;
}
.stat-card.revenue .logo-img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    margin-bottom: 6px;
}

.stat-card.occupied-card {
    background: linear-gradient(145deg, #2A1A1A, #1A1A2E);
    border-color: #E87070;
}
.stat-card.occupied-card .stat-value { color: #E87070; }
.stat-card.occupied-card .stat-label { color: #F5B8B8; }

.stat-card.available-card {
    background: linear-gradient(145deg, #1A2A1A, #1A1A2E);
    border-color: #70C870;
}
.stat-card.available-card .stat-value { color: #70C870; }
.stat-card.available-card .stat-label { color: #B8E8B8; }

.stat-card.orders-card {
    background: linear-gradient(145deg, #1A1A3A, #1A1A2E);
    border-color: #70A8E8;
}
.stat-card.orders-card .stat-value { color: #70A8E8; }
.stat-card.orders-card .stat-label { color: #B8D8F5; }

[data-theme="light"] .stat-card.revenue {
    background: linear-gradient(145deg, var(--primary), var(--primary-dark));
}
[data-theme="light"] .stat-card.occupied-card {
    background: linear-gradient(145deg, #FDE8EA, #F7F0F0);
}
[data-theme="light"] .stat-card.available-card {
    background: linear-gradient(145deg, #E8F5E8, #F0F7F0);
}
[data-theme="light"] .stat-card.orders-card {
    background: linear-gradient(145deg, #E8EFF5, #F0F5F7);
}

.stat-card .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 600;
    margin-bottom: 2px;
    transition: color 0.3s var(--ease);
}
.stat-card .stat-value {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 800;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}

/* ============================================================
   CUSTOMER PAGE
   ============================================================ */
.customer-page {
    background: var(--bg);
    min-height: 100vh;
    padding-bottom: 100px;
}
.customer-hero {
    background: linear-gradient(145deg, var(--primary), var(--primary-dark));
    border-radius: var(--radius-lg);
    padding: 20px;
    text-align: center;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    color: #fff;
}
.customer-hero .logo-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    margin-bottom: 6px;
}
.customer-hero .brand {
    font-size: 10px;
    opacity: 0.7;
    font-family: var(--mono);
    letter-spacing: 0.3em;
    text-transform: uppercase;
}
.customer-hero h1 {
    font-size: 28px;
    font-weight: 900;
    color: #fff;
    margin: 2px 0;
}
.customer-hero p {
    font-size: 13px;
    opacity: 0.85;
}

.customer-categories {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0 14px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
}
.customer-categories::-webkit-scrollbar { display: none; }
.customer-categories .btn {
    flex-shrink: 0;
    font-size: 12px;
    padding: 8px 16px;
    border-radius: 20px;
    white-space: nowrap;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-secondary);
}
.customer-categories .btn.active {
    background: var(--primary);
    color: var(--text-primary);
    border-color: var(--primary);
}

.customer-menu-card {
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    margin-bottom: 10px;
    display: flex;
    gap: 14px;
    align-items: center;
    transition: all 0.2s;
    cursor: pointer;
}
.customer-menu-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-gold);
}
.customer-menu-card .item-image {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-sm);
    background: var(--bg-input);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    overflow: hidden;
}
.customer-menu-card .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.customer-menu-card .item-info {
    flex: 1;
    min-width: 0;
}
.customer-menu-card .item-name {
    font-weight: 700;
    font-size: 15px;
    color: var(--text-primary);
}
.customer-menu-card .item-desc {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.customer-menu-card .item-price {
    font-weight: 700;
    color: var(--primary-dark);
    font-family: var(--mono);
    font-size: 14px;
}
.customer-menu-card .item-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

#customerCart {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: var(--text-primary);
    padding: 12px 24px;
    border-radius: 50px;
    box-shadow: var(--shadow-gold);
    font-weight: 700;
    cursor: pointer;
    display: none;
    z-index: 100;
    transition: all 0.3s;
    font-size: 14px;
}
#customerCart:hover {
    transform: translateX(-50%) scale(1.04);
}
#customerCart .cart-badge {
    background: var(--text-primary);
    color: var(--bg);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    margin: 0 6px;
}

.cart-summary {
    background: var(--bg-input);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    margin: 8px 0;
}
.cart-summary .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 14px;
    color: var(--text-secondary);
}
.cart-summary .summary-row.total {
    border-top: 2px solid var(--border);
    padding-top: 10px;
    margin-top: 6px;
    font-weight: 700;
    font-size: 17px;
    color: var(--text-primary);
}
.cart-summary .summary-row.total .amount {
    color: var(--primary-dark);
}

/* ============================================================
   QR CODE — صفحة منفصلة
   ============================================================ */
.qr-page-container {
    padding: 16px;
    max-width: 480px;
    margin: 0 auto;
}
.qr-page-container .qr-hero {
    text-align: center;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 30px 20px;
    border: 1px solid var(--border-light);
    margin-bottom: 16px;
}
.qr-page-container .qr-hero .qr-box {
    background: #fff;
    padding: 16px;
    border-radius: var(--radius-md);
    display: inline-block;
    margin: 12px 0;
}
.qr-page-container .qr-hero .qr-box img {
    width: 200px;
    height: 200px;
}
.qr-page-container .qr-hero .qr-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
}
.qr-page-container .qr-hero .qr-sub {
    font-size: 13px;
    color: var(--text-muted);
}
.qr-page-container .qr-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

/* ============================================================
   LISTS
   ============================================================ */
.list-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 4px;
    border-bottom: 1px solid var(--border-light);
    transition: border-color 0.3s var(--ease);
}
.list-row:last-child { border-bottom: none; }
.list-row .row-title {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}
.list-row .row-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
    transition: color 0.3s var(--ease);
}
.list-row .row-value {
    font-family: var(--mono);
    font-weight: 700;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}
.list-row .row-actions {
    display: flex;
    gap: 6px;
    align-items: center;
}

.panel {
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 4px 14px;
    box-shadow: var(--shadow);
    transition: all 0.3s var(--ease);
}

.empty {
    text-align: center;
    padding: 30px 16px;
    color: var(--text-muted);
    transition: color 0.3s var(--ease);
}
.empty i {
    font-size: 28px;
    color: var(--text-muted);
    margin-bottom: 8px;
    display: block;
    transition: color 0.3s var(--ease);
}

.order-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-light);
    transition: border-color 0.3s var(--ease);
}
.order-item:last-child { border-bottom: none; }
.order-item .item-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}
.order-item .item-details {
    font-size: 12px;
    color: var(--text-muted);
    transition: color 0.3s var(--ease);
}
.order-item .item-price {
    font-family: var(--mono);
    font-weight: 700;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}

/* ============================================================
   TABLES GRID
   ============================================================ */
.tables-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
}
.table-card {
    background: var(--bg-card);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 14px 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s var(--ease);
    box-shadow: var(--shadow);
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}
.table-card:active { transform: scale(0.95); }
.table-card .table-num {
    font-weight: 800;
    font-size: 18px;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}
.table-card .table-status {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 600;
    margin-top: 2px;
    transition: color 0.3s var(--ease);
}
.table-card .table-capacity {
    font-size: 9px;
    color: var(--text-muted);
}
.table-card.available { border-color: var(--border-light); }
.table-card.available:hover { border-color: var(--primary); box-shadow: var(--shadow-gold); }
.table-card.occupied {
    border-color: var(--primary);
    background: linear-gradient(145deg, var(--primary-light), var(--bg-card));
}
.table-card.occupied .table-status { color: var(--primary-dark); }
.table-card.reserved {
    border-color: var(--info);
    background: var(--info-bg);
}
.table-card.reserved .table-status { color: var(--info); }
.table-card.ready_to_serve {
    border-color: var(--success);
    background: linear-gradient(145deg, #1A3A28, #1A1A2E);
    animation: pulseReady 1.5s infinite;
}
@keyframes pulseReady {
    0%, 100% { box-shadow: 0 0 0 0 rgba(45, 155, 78, 0.2); }
    50% { box-shadow: 0 0 20px 5px rgba(45, 155, 78, 0.15); }
}
[data-theme="light"] .table-card.ready_to_serve {
    background: linear-gradient(145deg, #E8F5ED, #F7F0F0);
}
.table-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 8px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 700;
    color: #fff;
}

/* ============================================================
   PAYMENT OPTIONS
   ============================================================ */
.payment-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    margin-bottom: 14px;
}
.payment-option {
    background: var(--bg-card);
    border: 2px solid var(--border-light);
    border-radius: var(--radius-sm);
    padding: 12px 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s var(--ease);
}
.payment-option:hover { border-color: var(--text-muted); }
.payment-option.selected {
    border-color: var(--primary);
    background: var(--primary-glow);
}
.payment-option i {
    font-size: 22px;
    display: block;
    margin-bottom: 4px;
    color: var(--primary);
}
.payment-option span {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    transition: color 0.3s var(--ease);
}

/* ============================================================
   MENU QUICK ADD
   ============================================================ */
.menu-quick-add {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
}
.menu-quick-add .btn {
    font-size: 12px;
    padding: 6px 12px;
}

/* ============================================================
   BOTTOM NAV
   ============================================================ */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--nav-bg);
    backdrop-filter: blur(16px);
    border-top: 1px solid var(--border-light);
    display: flex;
    z-index: 70;
    padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
    max-width: 680px;
    margin: 0 auto;
    transition: all 0.3s var(--ease);
}
.nav-btn {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 4px;
    font-size: 9px;
    font-weight: 700;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s var(--ease);
}
.nav-btn i { font-size: 18px; }
.nav-btn.active { color: var(--primary); }
.nav-btn:hover { color: var(--text-primary); }

/* ============================================================
   OVERLAY / SHEETS
   ============================================================ */
.overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    backdrop-filter: blur(8px);
    z-index: 200;
    align-items: flex-end;
    justify-content: center;
    transition: background 0.3s var(--ease);
}
.overlay.show { display: flex; }

.sheet {
    background: var(--bg-card);
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
    width: 100%;
    max-width: 500px;
    max-height: 92vh;
    overflow-y: auto;
    padding: 20px 18px calc(20px + env(safe-area-inset-bottom));
    animation: sheetUp 0.35s var(--ease);
    box-shadow: 0 -8px 40px rgba(0,0,0,0.08);
    transition: background 0.3s var(--ease);
}
@keyframes sheetUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
.sheet-handle {
    width: 40px;
    height: 4px;
    background: var(--border);
    border-radius: 4px;
    margin: 0 auto 16px;
    transition: background 0.3s var(--ease);
}
.sheet-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-primary);
    transition: color 0.3s var(--ease);
}
.sheet-title .close-x {
    color: var(--text-muted);
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
}
.sheet-title .close-x:hover { color: var(--text-primary); }

/* ============================================================
   RING NOTIFICATION
   ============================================================ */
.ring-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: var(--bg-card);
    border: 3px solid var(--primary);
    border-radius: var(--radius-md);
    padding: 16px 24px;
    box-shadow: var(--shadow-lg);
    max-width: 400px;
    width: 90%;
    animation: ringSlideDown 0.5s var(--ease);
    display: none;
    cursor: pointer;
}
.ring-notification.show { display: block; }
.ring-notification .ring-icon {
    font-size: 32px;
    animation: ringBell 0.3s infinite alternate;
}
@keyframes ringBell {
    0% { transform: rotate(-20deg); }
    100% { transform: rotate(20deg); }
}
@keyframes ringSlideDown {
    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
}
.ring-notification .ring-title {
    font-weight: 700;
    font-size: 18px;
    color: var(--text-primary);
}
.ring-notification .ring-sub {
    font-size: 14px;
    color: var(--text-secondary);
}

/* ============================================================
   SHIFT INDICATOR IN HEADER
   ============================================================ */
.shift-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    padding: 3px 12px;
    border-radius: 12px;
    background: var(--success-bg);
    color: var(--success);
    border: 1px solid var(--success);
}
.shift-indicator.closed {
    background: var(--danger-bg);
    color: var(--danger);
    border-color: var(--danger);
}
.shift-indicator .shift-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulseLive 1.8s infinite;
}

/* ============================================================
   SCROLLBAR
   ============================================================ */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
::-webkit-scrollbar-track { background: transparent; }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (min-width: 700px) {
    .stat-grid { grid-template-columns: repeat(4, 1fr); }
    .stat-card.revenue { grid-column: 1 / -1; }
    .tables-grid { grid-template-columns: repeat(auto-fill, minmax(95px, 1fr)); }
}
@media (max-width: 420px) {
    .tables-grid { grid-template-columns: repeat(3, 1fr); }
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .stat-card.revenue { grid-column: 1 / -1; }
    .stat-card .stat-value { font-size: 22px; }
    .stat-card.revenue .stat-value { font-size: 30px; }
    .app-header .biz-name { font-size: 14px; }
    .customer-menu-card .item-image { width: 50px; height: 50px; font-size: 22px; }
    .customer-hero h1 { font-size: 22px; }
}
