(function () {
'use strict';
/* ------------------------------------------------------------------ *
 * Constants
 * ------------------------------------------------------------------ */
const KEY = 'titracker.v2';
const TYPES = [
  { id: 'outcome',  label: 'Outcome',  sign: -1, icon: 'cash' },
  { id: 'expenses', label: 'Expenses', sign: -1, icon: 'dollar' },
  { id: 'income',   label: 'Income',   sign: 1,  icon: 'chart' },
  { id: 'credit',   label: 'Credit',   sign: 1,  icon: 'wallet' },
  { id: 'debit',    label: 'Debit',    sign: -1, icon: 'wallet' }
];
const TYPE = Object.fromEntries(TYPES.map((t) => [t.id, t]));

// Default categories
const DEFAULT_CATS = [
  { id: 'food',     name: 'Food',         icon: 'food',    color: '#f97316', type: 'expense' },
  { id: 'transport',name: 'Transport',    icon: 'car',     color: '#3b82f6', type: 'expense' },
  { id: 'shopping', name: 'Shopping',     icon: 'bag',     color: '#ec4899', type: 'expense' },
  { id: 'bills',    name: 'Bills',        icon: 'receipt', color: '#ef4444', type: 'expense' },
  { id: 'health',   name: 'Health',       icon: 'heart',   color: '#10b981', type: 'expense' },
  { id: 'fun',      name: 'Fun',          icon: 'game',    color: '#a855f7', type: 'expense' },
  { id: 'education',name: 'Education',    icon: 'book',    color: '#06b6d4', type: 'expense' },
  { id: 'travel',   name: 'Travel',       icon: 'plane',   color: '#14b8a6', type: 'expense' },
  { id: 'gifts',    name: 'Gifts',        icon: 'gift',    color: '#f43f5e', type: 'expense' },
  { id: 'salary',   name: 'Salary',       icon: 'cash',    color: '#22c55e', type: 'income' },
  { id: 'other',    name: 'Other',        icon: 'more',    color: '#8a8f9c', type: 'any' }
];

const CAT_ICONS = {
  food: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
  car: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  bag: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h2v2h2V8h4v2h2V8h2v10z',
  receipt: 'M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM15 20H6c-.55 0-1-.45-1-1v-1h10v2zm4-1c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14zM17 8H9v2h8V8zm0 4H9v2h8v-2z',
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  game: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  plane: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  gift: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z',
  cash: 'M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z',
  dollar: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.95.44-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  chart: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
  wallet: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  more: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
  target: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  trending: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  key: 'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
  upload: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  search: 'M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.49-1.5-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  calendar: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  repeat: 'M12 6V4l-4 4 4 4V9c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25l1.52 1.52C19.68 17.59 20 16.34 20 15c0-4.42-3.58-8-8-8zm-4 9c0-.79.15-1.56.44-2.25L6.92 11.23C5.32 12.41 4 13.99 4 15c0 4.42 3.58 8 8 8v2l4-4-4-4v3c-3.31 0-6-2.69-6-6z',
  flag: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  refresh: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  pie: 'M11 2v9.01L3.52 15.5l1 1.73L12 13l7.48 4.23 1-1.73L13 11.01V2h-2zm7.49 11.25L12 9.24 5.51 13.25l-.01.01L12 17l6.5-3.74-.01-.01z',
  bar: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z'
};

const icon = (n, cls) => '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (CAT_ICONS[n] || CAT_ICONS.more) + '"/></svg>';

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const z2 = (n) => String(n).padStart(2, '0');
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()); };
const addDay = (s, k) => Calc.dayStr(Calc.dayNum(s) + k);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 9));
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(Calc.dayNum(s));
function longDate(s) {
  const d = new Date(Calc.dayNum(s) * 86400000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) + ', ' +
         d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}
function shortDate(s) {
  const d = new Date(Calc.dayNum(s) * 86400000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
const f2 = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fa = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const signed = (type, n) => (n === 0 ? '0' : (TYPE[type].sign > 0 ? '+' : '-') + fa(n));
function parseNum(s) { const n = Number(String(s).trim().replace(/\s/g, '').replace(',', '.')); return n; }
function monthKey(s) { return s.slice(0, 7); }
function monthLabel(k) {
  const [y, m] = k.split('-');
  const d = new Date(Date.UTC(+y, +m - 1, 1));
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}
function daysBetween(a, b) { return Calc.dayNum(b) - Calc.dayNum(a); }
function greetByTime() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ------------------------------------------------------------------ *
 * State & storage
 * ------------------------------------------------------------------ */
function defaults() {
  return {
    user: { name: 'User', avatar: '' },
    settings: {
      start: 0, startDate: todayStr(), share: 70, currency: 'MAD', salt: '', hash: '',
      quickAmounts: [20, 50, 100, 200]
    },
    entries: [],
    categories: DEFAULT_CATS.slice(),
    budgets: [],    // {id, categoryId, amount, period:'monthly'}
    goals: [],      // {id, name, target, saved, deadline, color, icon}
    bills: [],      // {id, name, amount, dueDate, paid, recurring}
    recurring: []   // {id, entryTemplate:{type,name,value,categoryId,note}, frequency:'daily'|'weekly'|'monthly', startDate, endDate?, lastRun}
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw), def = defaults();
      return {
        user: Object.assign(def.user, d.user || {}),
        settings: Object.assign(def.settings, d.settings || {}),
        entries: Array.isArray(d.entries) ? d.entries.filter(validEntry) : [],
        categories: Array.isArray(d.categories) && d.categories.length ? d.categories : def.categories,
        budgets: Array.isArray(d.budgets) ? d.budgets : [],
        goals: Array.isArray(d.goals) ? d.goals : [],
        bills: Array.isArray(d.bills) ? d.bills : [],
        recurring: Array.isArray(d.recurring) ? d.recurring : []
      };
    }
  } catch (e) { /* fall through */ }
  return defaults();
}
let memoryOnly = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); }
  catch (e) { if (!memoryOnly) { memoryOnly = true; toast('Storage blocked — changes kept in memory'); } }
}
function validEntry(e) {
  return e && typeof e.id === 'string' && isDate(e.date) && TYPE[e.type] &&
         Number.isFinite(Number(e.value)) && Number(e.value) > 0;
}
let db = load();
let tab = 'home';
let sel = todayStr();
let lastToday = todayStr();
const open = {};
let searchQuery = '';
let filterType = 'all';
let filterCat = 'all';

/* ------------------------------------------------------------------ *
 * Category helpers
 * ------------------------------------------------------------------ */
function getCat(id) { return db.categories.find((c) => c.id === id) || db.categories[db.categories.length - 1]; }
function catStyle(c) {
  const col = c.color || '#8a8f9c';
  return '--cat-color:' + col + ';--cat-color-a:' + col + '30;--cat-color-b:' + col + '10;';
}
function defaultCatForType(type) {
  if (type === 'income') return db.categories.find((c) => c.type === 'income') || db.categories[db.categories.length - 1];
  if (type === 'outcome' || type === 'expenses') return db.categories.find((c) => c.type === 'expense') || db.categories[db.categories.length - 1];
  return db.categories[db.categories.length - 1];
}

/* ------------------------------------------------------------------ *
 * Password
 * ------------------------------------------------------------------ */
async function hashPw(pw, salt) {
  const data = new TextEncoder().encode(salt + '|' + pw);
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map((b) => z2(b.toString(16))).join('');
  }
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (const b of data) { h1 = Math.imul(h1 ^ b, 2654435761); h2 = Math.imul(h2 ^ b, 1597334677); }
  return 'f' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
}
const hasLock = () => !!db.settings.hash;
async function checkPw(pw) { return (await hashPw(pw, db.settings.salt)) === db.settings.hash; }
async function setPw(pw) {
  if (!pw) { db.settings.hash = ''; db.settings.salt = ''; }
  else { db.settings.salt = uid(); db.settings.hash = await hashPw(pw, db.settings.salt); }
  save();
}

/* ------------------------------------------------------------------ *
 * Toast
 * ------------------------------------------------------------------ */
let toastTimer;
function toast(msg, action, fn) {
  const t = $('#toast');
  t.innerHTML = esc(msg) + (action ? ' <button data-a="toast-act" style="color:#d4af37;font-weight:700;margin-left:12px">' + esc(action) + '</button>' : '');
  t.style.pointerEvents = action ? 'auto' : 'none';
  t.classList.add('show');
  t._fn = fn;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), action ? 5000 : 2600);
}

/* ------------------------------------------------------------------ *
 * Layers
 * ------------------------------------------------------------------ */
let layer = null;
function openLayer(onClose) {
  if (layer) { const l = layer; layer = null; l(); }
  layer = onClose;
  history.pushState({ layer: 1 }, '');
}
function closeLayer() { if (layer) history.back(); }
window.addEventListener('popstate', () => { if (layer) { const l = layer; layer = null; l(); } });
function mountLayer(el, cls) {
  const ov = $('#overlay');
  ov.innerHTML = '<div class="scrim"></div>';
  ov.appendChild(el);
  ov.style.pointerEvents = 'auto';
  requestAnimationFrame(() => { $('.scrim', ov).classList.add('show'); el.classList.add('show'); });
  $('.scrim', ov).addEventListener('click', closeLayer);
}
function unmountLayer() {
  const ov = $('#overlay');
  const el = ov.lastElementChild;
  const sc = $('.scrim', ov);
  if (sc) sc.classList.remove('show');
  if (el && el.classList) el.classList.remove('show');
  setTimeout(() => { if (!layer) { ov.innerHTML = ''; ov.style.pointerEvents = 'none'; } }, 260);
}

/* ---------- generic dialog ---------- */
function dialog(o) {
  return new Promise((resolve) => {
    let result = null;
    const el = document.createElement('div');
    el.className = 'dialog';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    const fields = (o.fields || []).map((f, i) => {
      if (f.type === 'range') {
        return '<div class="rangeval" id="rv' + i + '">' + esc(f.fmt ? f.fmt(f.value) : f.value) + '</div>' +
               '<input class="range" id="f' + i + '" type="range" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + esc(f.value) + '">';
      }
      if (f.type === 'textarea') {
        return '<label class="field" style="display:block;margin-top:' + (i ? 18 : 8) + 'px"><span>' + esc(f.label) + '</span>' +
               '<textarea id="f' + i + '" maxlength="' + (f.maxlength || 200) + '">' + esc(f.value || '') + '</textarea></label>';
      }
      return '<label class="field" style="display:block;margin-top:' + (i ? 18 : 8) + 'px"><span>' + esc(f.label) + '</span>' +
             '<input id="f' + i + '" type="' + (f.type || 'text') + '" value="' + esc(f.value == null ? '' : f.value) + '"' +
             (f.inputmode ? ' inputmode="' + f.inputmode + '"' : '') +
             (f.min ? ' min="' + f.min + '"' : '') + (f.max ? ' max="' + f.max + '"' : '') +
             (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '') + ' autocomplete="off"></label>';
    }).join('');
    el.innerHTML = '<h3>' + esc(o.title) + '</h3>' + (o.msg ? '<p>' + esc(o.msg) + '</p>' : '') +
                   '<form novalidate>' + fields + '<div class="err" id="derr"></div><div class="acts">' +
                   '<button type="button" data-d="cancel">' + esc(o.cancel || 'Cancel') + '</button>' +
                   '<button type="submit" class="ok' + (o.danger ? ' dn' : '') + '">' + esc(o.ok || 'OK') + '</button></div></form>';
    mountLayer(el);
    openLayer(() => { unmountLayer(); resolve(result); });
    (o.fields || []).forEach((f, i) => {
      if (f.type === 'range') {
        const r = $('#f' + i, el);
        r.addEventListener('input', () => { $('#rv' + i, el).textContent = f.fmt ? f.fmt(r.value) : r.value; });
      }
    });
    const first = $('input,textarea', el);
    if (first && first.type !== 'range') setTimeout(() => first.focus(), 280);
    $('[data-d=cancel]', el).addEventListener('click', closeLayer);
    $('form', el).addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const vals = (o.fields || []).map((f, i) => $('#f' + i, el).value);
      const err = o.validate ? await o.validate(vals) : '';
      if (err) { $('#derr', el).textContent = err; return; }
      result = vals;
      closeLayer();
    });
  });
}

/* ------------------------------------------------------------------ *
 * Recurring transactions engine
 * ------------------------------------------------------------------ */
function processRecurring() {
  const today = todayStr();
  let changed = false;
  for (const r of db.recurring) {
    if (r.endDate && r.endDate < today) continue;
    const last = r.lastRun || r.startDate;
    if (!last || last > today) continue;
    const lastN = Calc.dayNum(last);
    const todayN = Calc.dayNum(today);
    let nextN = lastN;
    if (r.frequency === 'daily') nextN = lastN + 1;
    else if (r.frequency === 'weekly') nextN = lastN + 7;
    else if (r.frequency === 'monthly') {
      const d = new Date(lastN * 86400000);
      d.setUTCMonth(d.getUTCMonth() + 1);
      nextN = Math.round(d.getTime() / 86400000);
    }
    while (nextN <= todayN) {
      const tpl = r.entryTemplate;
      db.entries.push({
        id: uid(),
        type: tpl.type,
        name: tpl.name,
        value: Number(tpl.value),
        date: Calc.dayStr(nextN),
        categoryId: tpl.categoryId,
        note: tpl.note || '',
        recurringId: r.id
      });
      r.lastRun = Calc.dayStr(nextN);
      changed = true;
      if (r.frequency === 'daily') nextN++;
      else if (r.frequency === 'weekly') nextN += 7;
      else {
        const d = new Date(nextN * 86400000);
        d.setUTCMonth(d.getUTCMonth() + 1);
        nextN = Math.round(d.getTime() / 86400000);
      }
    }
  }
  if (changed) save();
}

/* ------------------------------------------------------------------ *
 * Add / edit sheet
 * ------------------------------------------------------------------ */
function openSheet(opts) {
  const editing = opts.id ? db.entries.find((e) => e.id === opts.id) : null;
  const st = {
    type: editing ? editing.type : (opts.type || 'expenses'),
    name: editing ? editing.name : '',
    value: editing ? String(editing.value) : '',
    date: editing ? editing.date : sel,
    categoryId: editing ? (editing.categoryId || defaultCatForType(editing ? editing.type : st.type).id) : defaultCatForType(opts.type || 'expenses').id,
    note: editing ? (editing.note || '') : '',
    recurring: editing ? (editing.recurringId ? db.recurring.find((r) => r.id === editing.recurringId) : null) : null
  };

  const el = document.createElement('div');
  el.className = 'sheet';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');

  const typeOptions = TYPES.map((t) =>
    '<button type="button" role="option" data-t="' + t.id + '" class="' + (t.id === st.type ? 'sel' : '') + '">' +
    '<span style="display:inline-grid;place-items:center;width:22px;height:22px;color:var(--primary)">' + icon(t.icon) + '</span>' +
    t.label + '</button>'
  ).join('');

  const catChips = db.categories.map((c) =>
    '<button type="button" class="cat-chip' + (c.id === st.categoryId ? ' sel' : '') + '" data-cat="' + c.id + '" style="' + catStyle(c) + '">' +
    '<span class="cat-ico">' + icon(c.icon) + '</span>' +
    '<span>' + esc(c.name) + '</span></button>'
  ).join('');

  el.innerHTML =
    '<div class="grab"></div>' +
    '<button class="x" type="button" aria-label="Close" data-s="close">' + icon('close') + '</button>' +
    '<h2>' + (editing ? 'Edit' : 'New Entry') + '</h2>' +
    '<form novalidate>' +
    '<div class="grid2" style="margin-top:24px">' +
    '<label class="field"><span>Name</span><input id="sName" type="text" maxlength="60" autocomplete="off" value="' + esc(st.name) + '" placeholder="e.g. Lunch"></label>' +
    '<label class="field"><span>Amount</span><input id="sVal" type="text" inputmode="decimal" autocomplete="off" value="' + esc(st.value) + '" placeholder="0.00"></label>' +
    '</div>' +
    '<div class="dd" id="ddType"><button type="button" class="select" id="sType" aria-haspopup="listbox"><span id="sTypeTxt">' + TYPE[st.type].label + '</span>' + icon('down') + '</button>' +
    '<div class="menu" role="listbox">' + typeOptions + '</div></div>' +
    '<div style="margin-bottom:14px"><div style="font-size:11px;color:var(--muted);letter-spacing:0.5px;text-transform:uppercase;font-weight:600;margin-bottom:6px">Category</div>' +
    '<div class="cat-grid" id="catGrid">' + catChips + '</div></div>' +
    '<label class="field" style="margin-bottom:10px"><span>Note (optional)</span><textarea id="sNote" maxlength="200" placeholder="Add a note...">' + esc(st.note) + '</textarea></label>' +
    '<div class="err" id="sErr" style="color:#ffd2cc"></div>' +
    '<div class="foot">' +
    (editing ? '<button type="button" class="btn danger" data-s="del" aria-label="Delete">' + icon('trash') + '</button>' : '') +
    '<label class="field grow"><span>Date</span><input id="sDate" type="date" min="' + db.settings.startDate + '" value="' + st.date + '"></label>' +
    '<button type="submit" class="btn">' + (editing ? 'Save' : 'Add') + '</button></div></form>';

  mountLayer(el);
  openLayer(() => { unmountLayer(); });

  // Type dropdown
  const ddType = $('#ddType', el);
  $('#sType', el).addEventListener('click', () => {
    const r = $('#sType', el).getBoundingClientRect();
    ddType.classList.toggle('up', window.innerHeight - r.bottom < 280 && r.top > 280);
    ddType.classList.toggle('open');
  });
  ddType.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-t]');
    if (!b) return;
    st.type = b.dataset.t;
    $('#sTypeTxt', el).textContent = TYPE[st.type].label;
    // Auto-switch category to default for new type
    const defCat = defaultCatForType(st.type);
    st.categoryId = defCat.id;
    $$('.cat-chip', el).forEach((x) => x.classList.toggle('sel', x.dataset.cat === st.categoryId));
    ddType.querySelectorAll('[data-t]').forEach((x) => x.classList.toggle('sel', x === b));
    ddType.classList.remove('open');
  });

  // Category picker
  $('#catGrid', el).addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-cat]');
    if (!b) return;
    st.categoryId = b.dataset.cat;
    $$('.cat-chip', el).forEach((x) => x.classList.toggle('sel', x === b));
  });

  $('[data-s=close]', el).addEventListener('click', closeLayer);
  const del = $('[data-s=del]', el);
  if (del) del.addEventListener('click', () => {
    const gone = db.entries.find((e) => e.id === opts.id);
    db.entries = db.entries.filter((e) => e.id !== opts.id);
    save(); closeLayer(); render();
    toast('Deleted', 'Undo', () => { db.entries.push(gone); save(); render(); });
  });

  $('form', el).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const err = $('#sErr', el);
    const value = parseNum($('#sVal', el).value);
    const date = $('#sDate', el).value;
    if (!Number.isFinite(value) || value <= 0) { err.textContent = 'Enter a value greater than 0.'; return; }
    if (!isDate(date)) { err.textContent = 'Choose a date.'; return; }
    if (date < db.settings.startDate) { err.textContent = 'Date is before start date.'; return; }
    const name = $('#sName', el).value.trim() || TYPE[st.type].label;
    const note = $('#sNote', el).value.trim();
    const rounded = Math.round(value * 100) / 100;
    if (editing) Object.assign(editing, { type: st.type, name, value: rounded, date, categoryId: st.categoryId, note });
    else db.entries.push({ id: uid(), type: st.type, name, value: rounded, date, categoryId: st.categoryId, note });
    sel = date;
    save(); closeLayer(); render();
    toast(editing ? 'Saved' : 'Added to ' + shortDate(date));
  });

  setTimeout(() => { if (!editing) $('#sName', el).focus(); }, 300);
}

/* ------------------------------------------------------------------ *
 * Quick add sheet
 * ------------------------------------------------------------------ */
function openQuickAdd() {
  const el = document.createElement('div');
  el.className = 'sheet';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  const qaBtns = [
    { label: 'Coffee', value: 20, cat: 'food', icon: 'food' },
    { label: 'Lunch', value: 50, cat: 'food', icon: 'food' },
    { label: 'Transport', value: 15, cat: 'transport', icon: 'car' },
    { label: 'Groceries', value: 100, cat: 'food', icon: 'bag' },
    { label: 'Bills', value: 200, cat: 'bills', icon: 'receipt' },
    { label: 'Fun', value: 50, cat: 'fun', icon: 'game' },
    { label: 'Health', value: 80, cat: 'health', icon: 'heart' },
    { label: 'Other', value: 30, cat: 'other', icon: 'more' }
  ];
  el.innerHTML =
    '<div class="grab"></div>' +
    '<button class="x" type="button" aria-label="Close" data-s="close">' + icon('close') + '</button>' +
    '<h2>Quick Add</h2>' +
    '<p class="when">Tap to add common expenses for today</p>' +
    '<div class="quick-add">' + qaBtns.map((q) => {
      const c = getCat(q.cat);
      return '<button type="button" class="qa-btn" data-qa="' + q.label + '|' + q.value + '|' + q.cat + '" style="' + catStyle(c) + '">' +
             '<span class="qa-ico" style="background:var(--cat-color-a);color:var(--cat-color)">' + icon(q.icon) + '</span>' +
             '<span>' + esc(q.label) + '</span>' +
             '<span style="color:var(--primary-soft);font-weight:700">' + q.value + '</span></button>';
    }).join('') + '</div>' +
    '<div style="margin-top:18px;text-align:center">' +
    '<button type="button" class="btn tonal" data-s="full">' + icon('add') + ' Full entry</button></div>';
  mountLayer(el);
  openLayer(() => { unmountLayer(); });
  $('[data-s=close]', el).addEventListener('click', closeLayer);
  $('[data-s=full]', el).addEventListener('click', () => { closeLayer(); setTimeout(() => openSheet({}), 280); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-qa]');
    if (!b) return;
    const [name, value, cat] = b.dataset.qa.split('|');
    db.entries.push({
      id: uid(), type: 'expenses', name, value: Number(value),
      date: todayStr(), categoryId: cat, note: ''
    });
    sel = todayStr();
    save(); closeLayer(); render();
    toast('Added ' + name + ' · ' + value);
  });
}

/* ------------------------------------------------------------------ *
 * Budget sheet
 * ------------------------------------------------------------------ */
function openBudgetSheet(budgetId) {
  const editing = budgetId ? db.budgets.find((b) => b.id === budgetId) : null;
  const el = document.createElement('div');
  el.className = 'sheet';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  const catChips = db.categories.filter((c) => c.type === 'expense' || c.type === 'any').map((c) =>
    '<button type="button" class="cat-chip' + (editing && editing.categoryId === c.id ? ' sel' : '') + '" data-cat="' + c.id + '" style="' + catStyle(c) + '">' +
    '<span class="cat-ico">' + icon(c.icon) + '</span><span>' + esc(c.name) + '</span></button>'
  ).join('');
  el.innerHTML =
    '<div class="grab"></div>' +
    '<button class="x" type="button" aria-label="Close" data-s="close">' + icon('close') + '</button>' +
    '<h2>' + (editing ? 'Edit Budget' : 'New Budget') + '</h2>' +
    '<form novalidate>' +
    '<div style="margin-top:20px"><div style="font-size:11px;color:var(--muted);letter-spacing:0.5px;text-transform:uppercase;font-weight:600;margin-bottom:6px">Category</div>' +
    '<div class="cat-grid" id="catGrid">' + catChips + '</div></div>' +
    '<label class="field" style="margin-top:18px"><span>Monthly limit</span><input id="bAmt" type="text" inputmode="decimal" value="' + (editing ? editing.amount : '') + '" placeholder="0.00"></label>' +
    '<div class="err" id="bErr" style="color:#ffd2cc"></div>' +
    '<div class="foot">' +
    (editing ? '<button type="button" class="btn danger" data-s="del">' + icon('trash') + '</button>' : '') +
    '<div class="grow"></div>' +
    '<button type="submit" class="btn">' + (editing ? 'Save' : 'Create') + '</button></div></form>';
  mountLayer(el);
  openLayer(() => { unmountLayer(); });
  let selCat = editing ? editing.categoryId : null;
  $('#catGrid', el).addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-cat]');
    if (!b) return;
    selCat = b.dataset.cat;
    $$('.cat-chip', el).forEach((x) => x.classList.toggle('sel', x === b));
  });
  $('[data-s=close]', el).addEventListener('click', closeLayer);
  if (editing) {
    $('[data-s=del]', el).addEventListener('click', () => {
      db.budgets = db.budgets.filter((b) => b.id !== editing.id);
      save(); closeLayer(); render();
      toast('Budget removed');
    });
  }
  $('form', el).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const err = $('#bErr', el);
    const amt = parseNum($('#bAmt', el).value);
    if (!selCat) { err.textContent = 'Choose a category.'; return; }
    if (!Number.isFinite(amt) || amt <= 0) { err.textContent = 'Enter a valid amount.'; return; }
    if (editing) { editing.categoryId = selCat; editing.amount = Math.round(amt * 100) / 100; }
    else db.budgets.push({ id: uid(), categoryId: selCat, amount: Math.round(amt * 100) / 100, period: 'monthly' });
    save(); closeLayer(); render();
    toast(editing ? 'Budget updated' : 'Budget created');
  });
}

/* ------------------------------------------------------------------ *
 * Goal sheet
 * ------------------------------------------------------------------ */
function openGoalSheet(goalId) {
  const editing = goalId ? db.goals.find((g) => g.id === goalId) : null;
  const el = document.createElement('div');
  el.className = 'sheet';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  const colors = ['#d4af37', '#34d399', '#3b82f6', '#ec4899', '#a855f7', '#f97316', '#06b6d4', '#f43f5e'];
  const iconList = ['target', 'home', 'plane', 'car', 'bag', 'heart', 'book', 'game'];
  el.innerHTML =
    '<div class="grab"></div>' +
    '<button class="x" type="button" aria-label="Close" data-s="close">' + icon('close') + '</button>' +
    '<h2>' + (editing ? 'Edit Goal' : 'New Goal') + '</h2>' +
    '<form novalidate>' +
    '<label class="field" style="margin-top:20px"><span>Goal name</span><input id="gName" type="text" maxlength="40" value="' + esc(editing ? editing.name : '') + '" placeholder="e.g. New laptop"></label>' +
    '<div class="grid2" style="margin-top:14px">' +
    '<label class="field"><span>Target</span><input id="gTarget" type="text" inputmode="decimal" value="' + (editing ? editing.target : '') + '" placeholder="0"></label>' +
    '<label class="field"><span>Saved now</span><input id="gSaved" type="text" inputmode="decimal" value="' + (editing ? editing.saved : '0') + '" placeholder="0"></label>' +
    '</div>' +
    '<label class="field" style="margin-top:14px"><span>Deadline (optional)</span><input id="gDeadline" type="date" min="' + todayStr() + '" value="' + (editing && editing.deadline ? editing.deadline : '') + '"></label>' +
    '<div style="margin-top:14px"><div style="font-size:11px;color:var(--muted);letter-spacing:0.5px;text-transform:uppercase;font-weight:600;margin-bottom:6px">Icon</div>' +
    '<div class="chips" id="gIcons">' + iconList.map((ic) =>
      '<button type="button" class="chip' + (editing && editing.icon === ic ? ' on' : '') + '" data-ic="' + ic + '">' + icon(ic) + '</button>'
    ).join('') + '</div></div>' +
    '<div style="margin-top:10px"><div style="font-size:11px;color:var(--muted);letter-spacing:0.5px;text-transform:uppercase;font-weight:600;margin-bottom:6px">Color</div>' +
    '<div class="chips" id="gColors">' + colors.map((c) =>
      '<button type="button" class="chip' + (editing && editing.color === c ? ' on' : '') + '" data-col="' + c + '" style="width:32px;height:32px;padding:0;background:' + c + ';border-color:' + c + '"></button>'
    ).join('') + '</div></div>' +
    '<div class="err" id="gErr" style="color:#ffd2cc"></div>' +
    '<div class="foot">' +
    (editing ? '<button type="button" class="btn danger" data-s="del">' + icon('trash') + '</button>' : '') +
    '<div class="grow"></div>' +
    '<button type="submit" class="btn">' + (editing ? 'Save' : 'Create') + '</button></div></form>';
  mountLayer(el);
  openLayer(() => { unmountLayer(); });
  let selIcon = editing ? editing.icon : 'target';
  let selColor = editing ? editing.color : '#d4af37';
  $('#gIcons', el).addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-ic]');
    if (!b) return;
    selIcon = b.dataset.ic;
    $$('#gIcons .chip', el).forEach((x) => x.classList.toggle('on', x === b));
  });
  $('#gColors', el).addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-col]');
    if (!b) return;
    selColor = b.dataset.col;
    $$('#gColors .chip', el).forEach((x) => x.classList.toggle('on', x === b));
  });
  $('[data-s=close]', el).addEventListener('click', closeLayer);
  if (editing) {
    $('[data-s=del]', el).addEventListener('click', () => {
      db.goals = db.goals.filter((g) => g.id !== editing.id);
      save(); closeLayer(); render();
      toast('Goal removed');
    });
  }
  $('form', el).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const err = $('#gErr', el);
    const name = $('#gName', el).value.trim();
    const target = parseNum($('#gTarget', el).value);
    const saved = parseNum($('#gSaved', el).value) || 0;
    const deadline = $('#gDeadline', el).value || null;
    if (!name) { err.textContent = 'Enter a name.'; return; }
    if (!Number.isFinite(target) || target <= 0) { err.textContent = 'Enter a valid target.'; return; }
    if (saved > target) { err.textContent = 'Saved cannot exceed target.'; return; }
    if (editing) Object.assign(editing, { name, target, saved, deadline, icon: selIcon, color: selColor });
    else db.goals.push({ id: uid(), name, target, saved, deadline, icon: selIcon, color: selColor });
    save(); closeLayer(); render();
    toast(editing ? 'Goal updated' : 'Goal created');
  });
}

/* ------------------------------------------------------------------ *
 * Bill sheet
 * ------------------------------------------------------------------ */
function openBillSheet(billId) {
  const editing = billId ? db.bills.find((b) => b.id === billId) : null;
  const el = document.createElement('div');
  el.className = 'sheet';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML =
    '<div class="grab"></div>' +
    '<button class="x" type="button" aria-label="Close" data-s="close">' + icon('close') + '</button>' +
    '<h2>' + (editing ? 'Edit Bill' : 'New Bill') + '</h2>' +
    '<form novalidate>' +
    '<label class="field" style="margin-top:20px"><span>Bill name</span><input id="blName" type="text" maxlength="40" value="' + esc(editing ? editing.name : '') + '" placeholder="e.g. Internet"></label>' +
    '<div class="grid2" style="margin-top:14px">' +
    '<label class="field"><span>Amount</span><input id="blAmt" type="text" inputmode="decimal" value="' + (editing ? editing.amount : '') + '" placeholder="0"></label>' +
    '<label class="field"><span>Due date</span><input id="blDue" type="date" min="' + todayStr() + '" value="' + (editing ? editing.dueDate : todayStr()) + '"></label>' +
    '</div>' +
    '<div class="err" id="blErr" style="color:#ffd2cc"></div>' +
    '<div class="foot">' +
    (editing ? '<button type="button" class="btn danger" data-s="del">' + icon('trash') + '</button>' : '') +
    '<div class="grow"></div>' +
    '<button type="submit" class="btn">' + (editing ? 'Save' : 'Add') + '</button></div></form>';
  mountLayer(el);
  openLayer(() => { unmountLayer(); });
  $('[data-s=close]', el).addEventListener('click', closeLayer);
  if (editing) {
    $('[data-s=del]', el).addEventListener('click', () => {
      db.bills = db.bills.filter((b) => b.id !== editing.id);
      save(); closeLayer(); render();
      toast('Bill removed');
    });
  }
  $('form', el).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const err = $('#blErr', el);
    const name = $('#blName', el).value.trim();
    const amount = parseNum($('#blAmt', el).value);
    const dueDate = $('#blDue', el).value;
    if (!name) { err.textContent = 'Enter a name.'; return; }
    if (!Number.isFinite(amount) || amount <= 0) { err.textContent = 'Enter a valid amount.'; return; }
    if (!isDate(dueDate)) { err.textContent = 'Choose a due date.'; return; }
    if (editing) Object.assign(editing, { name, amount, dueDate });
    else db.bills.push({ id: uid(), name, amount, dueDate, paid: false });
    save(); closeLayer(); render();
    toast(editing ? 'Bill updated' : 'Bill added');
  });
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */
function dayData() {
  const s = db.settings;
  if (sel < s.startDate) return { cur: { B: 0, H: 0, I: 0, J: 0, K: 0 }, before: true };
  const rows = Calc.compute(db.entries, s, sel);
  return { cur: rows[rows.length - 1], before: false };
}

function periodStats(from, to) {
  const es = db.entries.filter((e) => e.date >= from && e.date <= to);
  const inc = es.filter((e) => TYPE[e.type].sign > 0).reduce((a, e) => a + e.value, 0);
  const exp = es.filter((e) => TYPE[e.type].sign < 0 && e.type !== 'debit').reduce((a, e) => a + e.value, 0);
  return { inc, exp, net: inc - exp };
}

function pageHome() {
  const s = db.settings;
  const { cur, before } = dayData();
  const cu = esc(s.currency);
  const today = todayStr();
  const weekAgo = addDay(today, -6);
  const monthStart = today.slice(0, 7) + '-01';
  const todayStats = periodStats(today, today);
  const weekStats = periodStats(weekAgo, today);
  const monthStats = periodStats(monthStart, today);

  let h = '<div class="card hero' + (cur.K > 0 ? ' danger' : '') + '">';
  h += '<div class="t">Total Balance</div>';
  h += '<div class="big">' + f2(cur.H) + '</div>';
  h += '<div class="cur">' + cu + '</div>';
  if (cur.K > 0) h += '<div class="sub-line" style="color:var(--neg)">⚠ Over budget by ' + fa(cur.K) + ' ' + cu + '</div>';
  h += '<div class="stats">';
  h += '<div class="stat"><b>' + fa(cur.I) + '</b><small>Free</small></div>';
  h += '<div class="stat"><b>' + fa(cur.J) + '</b><small>Backup</small></div>';
  h += '<div class="stat' + (cur.K > 0 ? ' bad' : '') + '"><b>' + fa(cur.K) + '</b><small>Danger</small></div>';
  h += '</div></div>';

  h += '<div class="quick-stats">';
  h += '<div class="qs neg"><div class="lbl">Today</div><div class="val">-' + fa(todayStats.exp) + '</div></div>';
  h += '<div class="qs neg"><div class="lbl">This week</div><div class="val">-' + fa(weekStats.exp) + '</div></div>';
  h += '<div class="qs pos"><div class="lbl">This month</div><div class="val">+' + fa(monthStats.inc) + '</div></div>';
  h += '</div>';

  // Upcoming bills
  const upcomingBills = db.bills.filter((b) => !b.paid && b.dueDate >= addDay(today, -2) && b.dueDate <= addDay(today, 14)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (upcomingBills.length) {
    h += '<div class="section-title"><h3>Upcoming Bills</h3><button data-a="bills">See all</button></div>';
    h += '<div class="list">';
    for (const b of upcomingBills.slice(0, 3)) {
      const overdue = b.dueDate < today;
      const days = daysBetween(today, b.dueDate);
      const when = overdue ? 'Overdue' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days';
      h += '<div class="bill-card ' + (overdue ? 'overdue' : 'upcoming') + '" data-a="bill-pay" data-id="' + b.id + '">';
      h += '<div class="bill-ico">' + icon('bell') + '</div>';
      h += '<div class="bill-info"><b>' + esc(b.name) + '</b><small>' + when + ' · ' + shortDate(b.dueDate) + '</small></div>';
      h += '<div class="bill-amt">' + fa(b.amount) + ' ' + cu + '</div>';
      h += '</div>';
    }
    h += '</div>';
  }

  // Budget warnings
  const monthBudgets = db.budgets.map((b) => {
    const spent = db.entries.filter((e) => e.date >= monthStart && e.date <= today && e.categoryId === b.categoryId && TYPE[e.type].sign < 0 && e.type !== 'debit').reduce((a, e) => a + e.value, 0);
    return { ...b, spent, pct: b.amount > 0 ? (spent / b.amount) * 100 : 0 };
  }).filter((b) => b.pct >= 80).sort((a, b) => b.pct - a.pct);
  if (monthBudgets.length) {
    h += '<div class="section-title"><h3>Budget Alerts</h3><button data-a="tab" data-t="budgets">Manage</button></div>';
    h += '<div class="list">';
    for (const b of monthBudgets.slice(0, 2)) {
      const c = getCat(b.categoryId);
      const warn = b.pct >= 100;
      h += '<div class="budget-card" style="' + catStyle(c) + '">';
      h += '<div class="budget-head"><div class="ico cat">' + icon(c.icon) + '</div>';
      h += '<div class="info"><b>' + esc(c.name) + '</b><small>' + (warn ? 'Over budget!' : 'Almost there') + '</small></div></div>';
      h += '<div class="budget-bar ' + (warn ? 'over' : 'warn') + '"><div class="fill" style="width:' + Math.min(100, b.pct) + '%"></div></div>';
      h += '<div class="budget-stats"><b>' + fa(b.spent) + '</b><span' + (warn ? ' class="over"' : '') + '>' + Math.round(b.pct) + '% of ' + fa(b.amount) + '</span></div>';
      h += '</div>';
    }
    h += '</div>';
  }

  // Recent entries
  const recent = db.entries.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 5);
  if (recent.length) {
    h += '<div class="section-title"><h3>Recent</h3><button data-a="tab" data-t="records">All records</button></div>';
    h += '<div class="list">';
    for (const e of recent) h += entryRow(e, true);
    h += '</div>';
  } else {
    h += '<div class="empty"><div class="empty-ico">💰</div>No entries yet.<br>Tap + to add your first one.</div>';
  }
  return h;
}

function pageRecords() {
  const s = db.settings, { cur, before } = dayData();
  const cu = esc(s.currency);
  const canPrev = sel > s.startDate;

  let h = '<div class="card' + (cur.K > 0 ? ' danger' : '') + '">';
  h += '<div class="t">Total Balance</div><div class="big">' + f2(cur.H) + '</div><div class="cur">' + cu + '</div>';
  h += '<div class="stats">';
  h += '<div class="stat"><b>' + fa(cur.I) + '</b><small>Free</small></div>';
  h += '<div class="stat"><b>' + fa(cur.J) + '</b><small>Backup</small></div>';
  h += '<div class="stat' + (cur.K > 0 ? ' bad' : '') + '"><b>' + fa(cur.K) + '</b><small>Danger</small></div></div></div>';

  h += '<div class="daynav"><button class="arrow" data-a="prev" aria-label="Previous day"' + (canPrev ? '' : ' disabled') + '>' + icon('left') + '</button>';
  h += '<div class="date" role="button" aria-label="Pick a date">' + esc(longDate(sel)) + '<input id="datePick" type="date" min="' + s.startDate + '" value="' + sel + '" aria-label="Pick a date"></div>';
  h += '<button class="arrow" data-a="next" aria-label="Next day">' + icon('right') + '</button></div>';
  if (sel !== todayStr()) h += '<button class="today-chip" data-a="today">Back to today</button>';
  if (before) h += '<div class="empty">Before start date (' + esc(s.startDate) + ').</div>';

  // Search + filters
  h += '<div class="search-box"><div class="search-wrap">' + icon('search') +
       '<input class="search-input" id="recSearch" type="text" placeholder="Search entries..." value="' + esc(searchQuery) + '"></div></div>';
  h += '<div class="chips">';
  h += '<button class="chip' + (filterType === 'all' ? ' on' : '') + '" data-ft="all">All</button>';
  for (const t of TYPES) h += '<button class="chip' + (filterType === t.id ? ' on' : '') + '" data-ft="' + t.id + '">' + t.label + '</button>';
  h += '</div>';

  const dayEntries = db.entries.filter((e) => e.date === sel);
  const filtered = dayEntries.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const cat = getCat(e.categoryId);
      if (!e.name.toLowerCase().includes(q) && !(e.note || '').toLowerCase().includes(q) && !cat.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  h += '<div class="list">';
  if (filtered.length === 0) {
    h += '<div class="empty">No entries' + (searchQuery || filterType !== 'all' ? ' matching filters' : ' this day') + '.</div>';
  } else {
    for (const t of TYPES) {
      const es = filtered.filter((e) => e.type === t.id);
      if (!es.length) continue;
      const total = es.reduce((a, e) => a + e.value, 0);
      const isOpen = !!open[t.id];
      h += '<button class="item' + (isOpen ? ' open' : '') + '" data-a="toggle" data-t="' + t.id + '" aria-expanded="' + isOpen + '">';
      h += '<span class="ico cat" style="' + catStyle(defaultCatForType(t.id)) + '">' + icon(t.icon) + '</span>';
      h += '<span class="txt"><div class="nm">' + t.label + '</div>';
      h += '<div class="amt ' + (total ? (t.sign > 0 ? 'pos' : 'neg') : '') + '">' + signed(t.id, total) + ' ' + cu + '</div></span>';
      h += '<span class="chev">' + icon('down') + '</span></button>';
      if (isOpen) {
        h += '<div class="sub">';
        for (const e of es) h += entryRow(e, false);
        h += '</div>';
      }
    }
  }
  h += '</div>';
  return h;
}

function entryRow(e, showType) {
  const t = TYPE[e.type], cu = esc(db.settings.currency);
  const c = getCat(e.categoryId);
  let meta = '<span class="tag" style="background:' + c.color + '25;color:' + c.color + '">' + esc(c.name) + '</span>';
  if (e.recurringId) meta += '<span class="tag recurring">↻ recurring</span>';
  if (e.note) meta += '<span style="color:var(--muted);font-size:11px">· ' + esc(e.note.length > 30 ? e.note.slice(0, 30) + '…' : e.note) + '</span>';
  return '<button class="item" data-a="edit" data-id="' + e.id + '"><span class="ico cat" style="' + catStyle(c) + '">' + icon(c.icon) + '</span>' +
         '<span class="txt"><div class="nm">' + esc(e.name) + (showType ? ' <small style="color:var(--muted);font-size:12px">· ' + t.label + '</small>' : '') + '</div>' +
         '<div class="meta">' + meta + '</div></span>' +
         '<div class="amt ' + (t.sign > 0 ? 'pos' : 'neg') + '">' + signed(e.type, e.value) + ' ' + cu + '</div>' +
         '<span class="chev" style="transform:none">' + icon('edit') + '</span></button>';
}

function pageBudgets() {
  const cu = esc(db.settings.currency);
  const today = todayStr();
  const monthStart = today.slice(0, 7) + '-01';

  let h = '<div class="card"><div class="t">Monthly Budgets</div>';
  const totalBudget = db.budgets.reduce((a, b) => a + b.amount, 0);
  const totalSpent = db.budgets.reduce((a, b) => {
    return a + db.entries.filter((e) => e.date >= monthStart && e.date <= today && e.categoryId === b.categoryId && TYPE[e.type].sign < 0 && e.type !== 'debit').reduce((x, e) => x + e.value, 0);
  }, 0);
  h += '<div class="big">' + fa(totalSpent) + '</div><div class="cur">of ' + fa(totalBudget) + ' ' + cu + '</div>';
  h += '<div class="sub-line">' + (totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0) + '% used</div></div>';

  h += '<div class="section-title"><h3>Categories</h3><button data-a="budget-add">+ Add</button></div>';
  if (!db.budgets.length) {
    h += '<div class="empty"><div class="empty-ico">📊</div>No budgets yet.<br>Set limits to stay on track.</div>';
  } else {
    h += '<div class="list">';
    for (const b of db.budgets) {
      const c = getCat(b.categoryId);
      const spent = db.entries.filter((e) => e.date >= monthStart && e.date <= today && e.categoryId === b.categoryId && TYPE[e.type].sign < 0 && e.type !== 'debit').reduce((a, e) => a + e.value, 0);
      const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
      const warn = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : '';
      h += '<div class="budget-card" style="' + catStyle(c) + '" data-a="budget-edit" data-id="' + b.id + '">';
      h += '<div class="budget-head"><div class="ico cat">' + icon(c.icon) + '</div>';
      h += '<div class="info"><b>' + esc(c.name) + '</b><small>' + fa(spent) + ' of ' + fa(b.amount) + ' ' + cu + '</small></div>';
      h += '<div style="font-size:14px;font-weight:700;color:' + (pct >= 100 ? 'var(--neg)' : pct >= 80 ? 'var(--warn)' : 'var(--text)') + '">' + Math.round(pct) + '%</div></div>';
      h += '<div class="budget-bar ' + warn + '"><div class="fill" style="width:' + Math.min(100, pct) + '%"></div></div>';
      const remaining = b.amount - spent;
      h += '<div class="budget-stats"><span>' + (remaining >= 0 ? fa(remaining) + ' left' : '<span class="over">' + fa(-remaining) + ' over</span>') + '</span><span>' + shortDate(monthStart) + ' → ' + shortDate(today) + '</span></div>';
      h += '</div>';
    }
    h += '</div>';
  }
  return h;
}

function pageGoals() {
  const cu = esc(db.settings.currency);
  const totalTarget = db.goals.reduce((a, g) => a + g.target, 0);
  const totalSaved = db.goals.reduce((a, g) => a + g.saved, 0);

  let h = '<div class="card"><div class="t">Savings Goals</div>';
  h += '<div class="big">' + fa(totalSaved) + '</div><div class="cur">of ' + fa(totalTarget) + ' ' + cu + '</div>';
  h += '<div class="sub-line">' + db.goals.length + ' goal' + (db.goals.length !== 1 ? 's' : '') + '</div></div>';

  h += '<div class="section-title"><h3>Your Goals</h3><button data-a="goal-add">+ New</button></div>';
  if (!db.goals.length) {
    h += '<div class="empty"><div class="empty-ico">🎯</div>No goals yet.<br>Save for something meaningful.</div>';
  } else {
    h += '<div class="list">';
    for (const g of db.goals) {
      const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
      const col = g.color || '#d4af37';
      h += '<div class="goal-card" style="--goal-color:' + col + ';--goal-color-2:' + col + 'cc;--goal-color-a:' + col + '30;--goal-color-b:' + col + '10">';
      h += '<div class="goal-head"><div class="goal-ico">' + icon(g.icon || 'target') + '</div>';
      h += '<div class="goal-info"><b>' + esc(g.name) + '</b><small>' + (g.deadline ? 'by ' + shortDate(g.deadline) : 'No deadline') + '</small></div>';
      h += '<div class="goal-amt">' + Math.round(pct) + '<small>%</small></div></div>';
      h += '<div class="goal-bar"><div class="fill" style="width:' + pct + '%"></div></div>';
      h += '<div class="goal-foot"><b>' + fa(g.saved) + ' ' + cu + '</b><span>of ' + fa(g.target) + ' ' + cu + '</span></div>';
      h += '<div class="goal-actions">';
      h += '<button class="btn small tonal" data-a="goal-add-funds" data-id="' + g.id + '">+ Add funds</button>';
      h += '<button class="btn small ghost" data-a="goal-edit" data-id="' + g.id + '">Edit</button>';
      h += '</div></div>';
    }
    h += '</div>';
  }
  return h;
}

function pageAnalytics() {
  const cu = esc(db.settings.currency);
  const today = todayStr();
  const monthStart = today.slice(0, 7) + '-01';

  // Category breakdown for current month
  const monthExpenses = db.entries.filter((e) => e.date >= monthStart && e.date <= today && TYPE[e.type].sign < 0 && e.type !== 'debit');
  const byCat = {};
  for (const e of monthExpenses) {
    const cid = e.categoryId || 'other';
    byCat[cid] = (byCat[cid] || 0) + e.value;
  }
  const totalExp = monthExpenses.reduce((a, e) => a + e.value, 0);
  const catData = Object.entries(byCat).map(([cid, val]) => ({ cat: getCat(cid), val, pct: totalExp > 0 ? (val / totalExp) * 100 : 0 })).sort((a, b) => b.val - a.val);

  let h = '<div class="chart-card"><div class="chart-title">This Month · by Category</div>';
  if (catData.length === 0) {
    h += '<div class="empty">No expenses this month yet.</div>';
  } else {
    // Donut chart
    h += '<div class="donut-wrap"><div class="donut">';
    h += '<svg viewBox="0 0 100 100">';
    let offset = 0;
    const R = 40, C = 2 * Math.PI * R;
    for (const d of catData) {
      const len = (d.pct / 100) * C;
      h += '<circle cx="50" cy="50" r="' + R + '" fill="none" stroke="' + d.cat.color + '" stroke-width="14" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-offset) + '" stroke-linecap="butt"/>';
      offset += len;
    }
    h += '</svg><div class="donut-center"><b>' + fa(totalExp) + '</b><small>' + cu + '</small></div></div>';
    h += '<div class="legend">';
    for (const d of catData.slice(0, 6)) {
      h += '<div class="legend-item"><span class="legend-dot" style="background:' + d.cat.color + '"></span>';
      h += '<span class="name">' + esc(d.cat.name) + '</span>';
      h += '<span class="val">' + fa(d.val) + '</span>';
      h += '<span class="pct">' + Math.round(d.pct) + '%</span></div>';
    }
    h += '</div></div>';
  }
  h += '</div>';

  // Monthly trend (last 6 months)
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1 - i, 1));
    const k = d.getUTCFullYear() + '-' + z2(d.getUTCMonth() + 1);
    months.push(k);
  }
  const trend = months.map((k) => {
    const start = k + '-01';
    const endD = new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7), 0));
    const end = endD.getUTCFullYear() + '-' + z2(endD.getUTCMonth() + 1) + '-' + z2(endD.getUTCDate());
    const stats = periodStats(start, end);
    return { k, label: monthLabel(k), inc: stats.inc, exp: stats.exp };
  });
  const maxVal = Math.max(1, ...trend.map((t) => Math.max(t.inc, t.exp)));

  h += '<div class="chart-card" style="margin-top:16px"><div class="chart-title">Last 6 Months</div>';
  h += '<div class="bar-chart">';
  for (const t of trend) {
    const hInc = (t.inc / maxVal) * 140;
    const hExp = (t.exp / maxVal) * 140;
    h += '<div class="bar-col">';
    h += '<div style="display:flex;gap:3px;align-items:flex-end;height:150px;width:100%">';
    h += '<div class="bar in" style="height:' + hInc + 'px;flex:1" title="Income: ' + fa(t.inc) + '"></div>';
    h += '<div class="bar out" style="height:' + hExp + 'px;flex:1" title="Expenses: ' + fa(t.exp) + '"></div>';
    h += '</div>';
    h += '<div class="bar-label">' + t.label + '</div>';
    h += '</div>';
  }
  h += '</div>';
  h += '<div style="display:flex;gap:16px;justify-content:center;margin-top:12px;font-size:11px;color:var(--muted)">';
  h += '<span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:2px;background:#10b981"></span>Income</span>';
  h += '<span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:2px;background:#ef4444"></span>Expenses</span>';
  h += '</div></div>';

  // Top spending categories
  if (catData.length > 0) {
    h += '<div class="chart-card" style="margin-top:16px"><div class="chart-title">Top Spending</div>';
    h += '<div class="list">';
    for (const d of catData.slice(0, 5)) {
      h += '<div class="item" style="cursor:default"><span class="ico cat" style="' + catStyle(d.cat) + '">' + icon(d.cat.icon) + '</span>';
      h += '<span class="txt"><div class="nm">' + esc(d.cat.name) + '</div>';
      h += '<div class="meta"><span>' + Math.round(d.pct) + '% of total</span></div></span>';
      h += '<div class="amt">' + fa(d.val) + ' ' + cu + '</div></div>';
    }
    h += '</div></div>';
  }

  return h;
}

function pageBills() {
  const cu = esc(db.settings.currency);
  const today = todayStr();
  const upcoming = db.bills.filter((b) => !b.paid).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const paid = db.bills.filter((b) => b.paid).sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  let h = '<div class="card"><div class="t">Upcoming Bills</div>';
  const totalUpcoming = upcoming.reduce((a, b) => a + b.amount, 0);
  h += '<div class="big">' + fa(totalUpcoming) + '</div><div class="cur">' + cu + '</div>';
  h += '<div class="sub-line">' + upcoming.length + ' pending · ' + paid.length + ' paid</div></div>';

  h += '<div class="section-title"><h3>Pending</h3><button data-a="bill-add">+ Add</button></div>';
  if (!upcoming.length) {
    h += '<div class="empty"><div class="empty-ico">✅</div>All caught up!<br>No pending bills.</div>';
  } else {
    h += '<div class="list">';
    for (const b of upcoming) {
      const overdue = b.dueDate < today;
      const days = daysBetween(today, b.dueDate);
      const when = overdue ? '⚠ Overdue' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days';
      h += '<div class="bill-card ' + (overdue ? 'overdue' : 'upcoming') + '" data-a="bill-edit" data-id="' + b.id + '">';
      h += '<div class="bill-ico">' + icon('bell') + '</div>';
      h += '<div class="bill-info"><b>' + esc(b.name) + '</b><small>' + when + ' · ' + shortDate(b.dueDate) + '</small></div>';
      h += '<div class="bill-amt">' + fa(b.amount) + '</div>';
      h += '<button class="icon-btn" data-a="bill-pay" data-id="' + b.id + '" style="width:36px;height:36px" title="Mark paid">' + icon('check') + '</button>';
      h += '</div>';
    }
    h += '</div>';
  }

  if (paid.length) {
    h += '<div class="section-title"><h3>Paid</h3></div><div class="list">';
    for (const b of paid.slice(0, 10)) {
      h += '<div class="bill-card" data-a="bill-edit" data-id="' + b.id + '" style="opacity:0.7">';
      h += '<div class="bill-ico" style="background:var(--pos-soft);color:var(--pos)">' + icon('check') + '</div>';
      h += '<div class="bill-info"><b>' + esc(b.name) + '</b><small>Paid · ' + shortDate(b.dueDate) + '</small></div>';
      h += '<div class="bill-amt">' + fa(b.amount) + '</div></div>';
    }
    h += '</div>';
  }
  return h;
}

function pageCredit() {
  const cu = esc(db.settings.currency);
  const es = db.entries.filter((e) => e.type === 'credit' || e.type === 'debit');
  const cr = es.filter((e) => e.type === 'credit').reduce((a, e) => a + e.value, 0);
  const de = es.filter((e) => e.type === 'debit').reduce((a, e) => a + e.value, 0);
  const net = cr - de;
  let h = '<div class="card"><div class="t">Credit & Debit</div>';
  h += '<div class="big ' + (net < 0 ? 'neg' : net > 0 ? 'pos' : '') + '">' + (net > 0 ? '+' : net < 0 ? '-' : '') + f2(Math.abs(net)) + '</div>';
  h += '<div class="cur">' + cu + ' · net</div>';
  h += '<div class="stats" style="grid-template-columns:repeat(2,1fr)"><div class="stat good"><b class="pos">+' + fa(cr) + '</b><small>Credit</small></div><div class="stat bad"><b class="neg">-' + fa(de) + '</b><small>Debit</small></div></div></div>';
  if (!es.length) return h + '<div class="empty">No credit or debit yet.<br>Tap + to add one.</div>';
  const dates = [...new Set(es.map((e) => e.date))].sort().reverse();
  h += '<div class="list">';
  for (const d of dates) {
    h += '<div class="grp">' + esc(longDate(d)) + '</div>' + es.filter((e) => e.date === d).map((e) => entryRow(e, true)).join('');
  }
  return h + '</div>';
}

function pageAccount() {
  const s = db.settings;
  return '<div class="profile"><button class="avatar" data-a="avatar" aria-label="Change picture">' +
         (db.user.avatar ? '<img alt="" src="' + esc(db.user.avatar) + '">' : icon('image')) + '</button>' +
         '<button class="uname" data-a="name">' + esc(db.user.name) + icon('edit') + '</button></div>' +
         '<div class="settings">' +
         st('set-start', 'Starting balance', 'Property on the first day', fa(s.start) + ' ' + esc(s.currency), 'cash') +
         st('set-date', 'Start date', 'First day counted', longDate(s.startDate), 'calendar') +
         st('set-share', 'Free-to-use share', 'Rest goes to Backup', s.share + '% / ' + (100 - s.share) + '%', 'pie') +
         st('set-cur', 'Currency', 'Label next to amounts', esc(s.currency), 'dollar') +
         st('lock', hasLock() ? 'Change password' : 'Set a password', hasLock() ? 'Asked on open' : 'Lock the app', hasLock() ? 'On' : 'Off', 'key') +
         (hasLock() ? st('unlock', 'Remove password', '', '', 'key') : '') +
         st('excel', 'Export to Excel', 'Matches your tracker layout', '', 'download') +
         st('export', 'Export backup (JSON)', 'Save all records', '', 'upload') +
         st('import', 'Import backup', 'Restore from file', '', 'upload') +
         st('reset', 'Erase all data', 'Cannot be undone', '', 'trash', true) +
         '</div><p class="version">TiTracker · data stays on this device</p>';
}
function st(a, title, sub, val, ic, red) {
  return '<button class="setting' + (red ? ' red' : '') + '" data-a="' + a + '"><span class="l">' +
         (ic ? '<span class="s-ico">' + icon(ic) + '</span>' : '') +
         '<span><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span></span>' +
         (val ? '<span class="v">' + val + '</span>' : '') + '</button>';
}

function render() {
  const app = $('#app');
  const page = $('#page');
  const nav = $('#nav');
  const fab = $('#fab');
  const keep = $('.pages', app).scrollTop;
  let body;
  switch (tab) {
    case 'home': body = pageHome(); break;
    case 'records': body = pageRecords(); break;
    case 'budgets': body = pageBudgets(); break;
    case 'goals': body = pageGoals(); break;
    case 'analytics': body = pageAnalytics(); break;
    case 'bills': body = pageBills(); break;
    case 'credit': body = pageCredit(); break;
    case 'account': body = pageAccount(); break;
    default: body = pageHome();
  }
  page.innerHTML = body;
  const nb = (id, label, ic) => '<button data-a="tab" data-t="' + id + '" class="' + (tab === id ? 'on' : '') + '" aria-current="' + (tab === id) + '"><span class="ind">' + icon(ic) + '</span>' + label + '</button>';
  nav.innerHTML = nb('home', 'Home', 'home') + nb('records', 'Records', 'cash') + nb('budgets', 'Budgets', 'bar') + nb('analytics', 'Stats', 'trending') + nb('account', 'Account', 'person');
  fab.hidden = tab === 'account';
  $('.pages', app).scrollTop = keep;

  // Topbar
  $('#greeting').textContent = greetByTime() + ', ' + db.user.name;
  $('#topbarDate').textContent = longDate(todayStr());
  const avTop = $('#avatarTop');
  avTop.innerHTML = db.user.avatar ? '<img alt="" src="' + esc(db.user.avatar) + '">' : icon('person');

  // Re-attach search handler
  const searchInput = $('#recSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (ev) => {
      searchQuery = ev.target.value;
      // Re-render list only
      const list = $('.list', page);
      if (list) {
        // Simpler: full re-render
        render();
      }
    });
  }
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */
function setSel(d) {
  if (!isDate(d)) return;
  if (d < db.settings.startDate) { toast('Before start date'); render(); return; }
  sel = d; render();
}
async function act(a, el) {
  const s = db.settings;
  switch (a) {
    case 'tab': tab = el.dataset.t; render(); break;
    case 'prev': setSel(addDay(sel, -1)); break;
    case 'next': setSel(addDay(sel, 1)); break;
    case 'today': setSel(todayStr()); break;
    case 'toggle': open[el.dataset.t] = !open[el.dataset.t]; render(); break;
    case 'fab':
      if (tab === 'credit') openSheet({ type: 'credit' });
      else if (tab === 'home') openQuickAdd();
      else openSheet({});
      break;
    case 'edit': openSheet({ id: el.dataset.id }); break;
    case 'toast-act': { const t = $('#toast'); t.classList.remove('show'); if (t._fn) t._fn(); t._fn = null; break; }
    case 'search': {
      tab = 'records'; render();
      setTimeout(() => { const si = $('#recSearch'); if (si) si.focus(); }, 100);
      break;
    }
    case 'avatar-top':
    case 'avatar': {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = () => { if (inp.files[0]) shrinkImage(inp.files[0]).then((u) => { db.user.avatar = u; save(); render(); }).catch(() => toast('Could not read image')); };
      inp.click(); break;
    }
    case 'name': {
      const r = await dialog({ title: 'Your name', fields: [{ label: 'Name', value: db.user.name, maxlength: 30 }], ok: 'Save', validate: (v) => (v[0].trim() ? '' : 'Enter a name.') });
      if (r) { db.user.name = r[0].trim(); save(); render(); }
      break;
    }
    case 'set-start': {
      const r = await dialog({ title: 'Starting balance', msg: 'Property you begin with on start date.', fields: [{ label: 'Amount', value: s.start, inputmode: 'decimal' }], ok: 'Save', validate: (v) => (Number.isFinite(parseNum(v[0])) && parseNum(v[0]) >= 0 ? '' : 'Enter a number (0 or more).') });
      if (r) { s.start = parseNum(r[0]); save(); render(); }
      break;
    }
    case 'set-date': {
      const first = db.entries.length ? db.entries.map((e) => e.date).sort()[0] : null;
      const r = await dialog({
        title: 'Start date', msg: 'First day of tracking.', fields: [{ label: 'Date', type: 'date', value: s.startDate }], ok: 'Save',
        validate: (v) => (!isDate(v[0]) ? 'Choose a date.' : first && v[0] > first ? 'You have records on ' + first + '. Pick that day or earlier.' : '')
      });
      if (r) { s.startDate = r[0]; if (sel < s.startDate) sel = s.startDate; save(); render(); }
      break;
    }
    case 'set-share': {
      const r = await dialog({
        title: 'Free-to-use share', msg: 'Share of new income to Free. Rest to Backup.',
        fields: [{ type: 'range', min: 0, max: 100, step: 5, value: s.share, fmt: (v) => v + '% free · ' + (100 - v) + '% backup' }], ok: 'Save'
      });
      if (r) { s.share = Number(r[0]); save(); render(); }
      break;
    }
    case 'set-cur': {
      const r = await dialog({ title: 'Currency', fields: [{ label: 'Label', value: s.currency, maxlength: 6 }], ok: 'Save', validate: (v) => (v[0].trim() ? '' : 'Enter a currency.') });
      if (r) { s.currency = r[0].trim().toUpperCase(); save(); render(); }
      break;
    }
    case 'lock': {
      const fields = (hasLock() ? [{ label: 'Current password', type: 'password' }] : []).concat([{ label: 'New password', type: 'password' }, { label: 'Repeat new password', type: 'password' }]);
      const r = await dialog({
        title: hasLock() ? 'Change password' : 'Set a password', msg: 'Only locks this device.', fields, ok: 'Save',
        validate: async (v) => {
          const n = hasLock() ? 1 : 0;
          if (hasLock() && !(await checkPw(v[0]))) return 'Current password is wrong.';
          if (v[n].length < 4) return 'Use at least 4 characters.';
          if (v[n] !== v[n + 1]) return 'Passwords do not match.';
          return '';
        }
      });
      if (r) { await setPw(r[hasLock() ? 1 : 0]); toast('Password saved'); render(); }
      break;
    }
    case 'unlock': {
      const r = await dialog({ title: 'Remove password', fields: [{ label: 'Current password', type: 'password' }], ok: 'Remove', danger: true, validate: async (v) => ((await checkPw(v[0])) ? '' : 'Wrong password.') });
      if (r) { await setPw(''); toast('Password removed'); render(); }
      break;
    }
    case 'excel': exportExcel(); break;
    case 'export': exportData(); break;
    case 'import': {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = () => { if (inp.files[0]) importData(inp.files[0]); };
      inp.click(); break;
    }
    case 'reset': {
      const r = await dialog({ title: 'Erase all data?', msg: 'All records and settings will be deleted. Export a backup first.', ok: 'Erase', danger: true });
      if (r) { const pw = { hash: s.hash, salt: s.salt }; db = defaults(); Object.assign(db.settings, pw); save(); sel = todayStr(); toast('All data erased'); render(); }
      break;
    }
    case 'budget-add': openBudgetSheet(null); break;
    case 'budget-edit': openBudgetSheet(el.dataset.id); break;
    case 'goal-add': openGoalSheet(null); break;
    case 'goal-edit': openGoalSheet(el.dataset.id); break;
    case 'goal-add-funds': {
      const g = db.goals.find((x) => x.id === el.dataset.id);
      if (!g) break;
      const r = await dialog({
        title: 'Add funds to ' + g.name,
        msg: 'Current: ' + fa(g.saved) + ' of ' + fa(g.target),
        fields: [{ label: 'Amount to add', inputmode: 'decimal', value: '' }],
        ok: 'Add',
        validate: (v) => {
          const n = parseNum(v[0]);
          if (!Number.isFinite(n) || n <= 0) return 'Enter a valid amount.';
          if (g.saved + n > g.target) return 'Would exceed target. Max: ' + fa(g.target - g.saved);
          return '';
        }
      });
      if (r) { g.saved += parseNum(r[0]); save(); render(); toast('Added to goal'); }
      break;
    }
    case 'bill-add': openBillSheet(null); break;
    case 'bill-edit': openBillSheet(el.dataset.id); break;
    case 'bill-pay': {
      const b = db.bills.find((x) => x.id === el.dataset.id);
      if (!b) break;
      b.paid = !b.paid;
      save(); render();
      toast(b.paid ? 'Marked as paid' : 'Marked as unpaid');
      break;
    }
    case 'bills': tab = 'bills'; render(); break;
  }
}
function shrinkImage(file) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const S = 320, c = document.createElement('canvas'); c.width = c.height = S;
      const m = Math.min(img.width, img.height), sx = (img.width - m) / 2, sy = (img.height - m) / 2;
      c.getContext('2d').drawImage(img, sx, sy, m, m, 0, 0, S, S);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = rej; img.src = url;
  });
}
function exportData() {
  const out = { app: 'TiTracker', version: 2, exportedAt: new Date().toISOString(), user: db.user, settings: Object.assign({}, db.settings, { hash: '', salt: '' }), entries: db.entries, categories: db.categories, budgets: db.budgets, goals: db.goals, bills: db.bills, recurring: db.recurring };
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'titracker-backup-' + todayStr() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('Backup saved');
}
/* ---------- Excel export (matches trackerv2.xlsx layout) ---------- */
function exportExcel() {
  const s = db.settings;
  const upTo = todayStr();
  const rows = Calc.compute(db.entries, s, upTo);
  const fmtDate = (d) => {
    const [y, m, dd] = d.split('-');
    return dd + '.' + m + '.' + y;
  };
  const namesOf = (type, dayEntries) =>
    dayEntries.filter((e) => e.type === type).map((e) => e.name + ' · ' + fa(e.value)).join('; ');
  let html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
    'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
    'xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="UTF-8">' +
    '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>' +
    '<x:ExcelWorksheet><x:Name>Sheet1</x:Name>' +
    '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
    '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
    '<style>' +
    'table{border-collapse:collapse;font-family:Calibri,Arial;font-size:11pt}' +
    'th{background:#D9D9D9;color:#000;font-weight:700;padding:6px 8px;border:1px solid #808080;text-align:center}' +
    'td{padding:4px 8px;border:1px solid #BFBFBF;vertical-align:top}' +
    'td.num{text-align:right;font-variant-numeric:tabular-nums}' +
    'td.date{font-weight:600}' +
    'tr.firstday{background:#FFF2CC}' +
    '</style></head><body><table>';
  html += '<tr>' +
    '<th>Days</th><th>Property</th>' +
    '<th>Outcome</th><th>Outcome</th>' +
    '<th>Expenses</th><th>Expenses</th>' +
    '<th>Income</th>' +
    '<th>Rest</th><th>Free to use</th><th>Back Up</th><th>Danger</th>' +
    '<th>Credit</th><th>Credit</th>' +
    '<th>Debit</th><th>Debit</th>' +
    '<th>' + s.share + '%</th><th>' + (100 - s.share) + '%</th>' +
    '<th></th><th></th>' +
    '</tr>';
  for (const row of rows) {
    const dayEntries = db.entries.filter((e) => e.date === row.date);
    const isFirst = row.date === s.startDate;
    let incomeSum = row.G;
    const incomeNames = [];
    if (isFirst && s.start > 0) {
      incomeSum += s.start;
      incomeNames.push('Starting balance · ' + fa(s.start));
    }
    dayEntries.filter((e) => e.type === 'income').forEach((e) => incomeNames.push(e.name + ' · ' + fa(e.value)));
    const fmt = (n) => (n === 0 ? '0.00' : n.toFixed(2));
    const num = (n) => '<td class="num">' + fmt(n) + '</td>';
    html += '<tr' + (isFirst ? ' class="firstday"' : '') + '>' +
      '<td class="date">' + fmtDate(row.date) + '</td>' +
      num(isFirst ? 0 : row.B) +
      num(row.D) +
      '<td>' + namesOf('outcome', dayEntries) + '</td>' +
      num(row.F) +
      '<td>' + namesOf('expenses', dayEntries) + '</td>' +
      num(incomeSum) +
      num(row.H) + num(row.I) + num(row.J) + num(row.K) +
      num(row.M) +
      '<td>' + namesOf('credit', dayEntries) + '</td>' +
      num(row.O) +
      '<td>' + namesOf('debit', dayEntries) + '</td>' +
      '<td>' + s.share + '%</td>' +
      '<td>' + (100 - s.share) + '%</td>' +
      '<td>0</td><td>0</td>' +
      '</tr>';
  }
  html += '</table></body></html>';
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'titracker-' + upTo + '.xls';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('Excel exported');
}
async function importData(file) {
  try {
    const d = JSON.parse(await file.text());
    if (!d || d.app !== 'TiTracker' || !Array.isArray(d.entries)) throw new Error('bad');
    const good = d.entries.filter(validEntry);
    const ok = await dialog({ title: 'Import backup?', msg: good.length + ' records found. This replaces everything.', ok: 'Import' });
    if (!ok) return;
    const pw = { hash: db.settings.hash, salt: db.settings.salt };
    const def = defaults();
    db = {
      user: Object.assign(def.user, d.user || {}),
      settings: Object.assign(def.settings, d.settings || {}, pw),
      entries: good.map((e) => ({ id: e.id, type: e.type, name: String(e.name || TYPE[e.type].label).slice(0, 60), value: Number(e.value), date: e.date, categoryId: e.categoryId || defaultCatForType(e.type).id, note: e.note || '' })),
      categories: Array.isArray(d.categories) && d.categories.length ? d.categories : def.categories,
      budgets: Array.isArray(d.budgets) ? d.budgets : [],
      goals: Array.isArray(d.goals) ? d.goals : [],
      bills: Array.isArray(d.bills) ? d.bills : [],
      recurring: Array.isArray(d.recurring) ? d.recurring : []
    };
    if (!isDate(db.settings.startDate)) db.settings.startDate = todayStr();
    save(); sel = todayStr(); if (sel < db.settings.startDate) sel = db.settings.startDate;
    toast('Backup imported'); render();
  } catch (e) { toast('Not a TiTracker backup'); }
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */
function wavePath() {
  let d = '';
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2, r = 34 + 4 * Math.sin(t * 8);
    d += (i ? 'L' : 'M') + (50 + r * Math.cos(t)).toFixed(2) + ' ' + (50 + r * Math.sin(t)).toFixed(2);
  }
  $('#wavePath').setAttribute('d', d + 'Z');
}
function showLogin() {
  const el = $('#login');
  el.innerHTML = '<h1>TiTracker</h1><form class="login-box" novalidate><label class="field with-icon"><span>Password</span><i class="lead">' + icon('key') + '</i>' +
                 '<input id="lpw" type="password" autocomplete="current-password" aria-label="Password"></label><div class="err" id="lerr"></div>' +
                 '<div class="row-end"><button class="btn" type="submit"><span class="dot">' + icon('go') + '</span>Enter</button></div></form>';
  // Add 'go' icon path
  CAT_ICONS.go = 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z';
  el.hidden = false;
  $('form', el).addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (await checkPw($('#lpw').value)) { el.hidden = true; el.innerHTML = ''; showApp(); }
    else { $('#lerr').textContent = 'Wrong password.'; $('#lpw').select(); }
  });
  setTimeout(() => $('#lpw').focus(), 100);
}
function showApp() { $('#app').hidden = false; render(); }
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-a]');
  if (b) act(b.dataset.a, b);
});
document.addEventListener('change', (ev) => { if (ev.target.id === 'datePick') setSel(ev.target.value); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const t = todayStr();
  if (t !== lastToday) {
    processRecurring();
    if (sel === lastToday) sel = t; lastToday = t;
    if (!$('#app').hidden) render();
  }
});
wavePath();
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* ignore */ }
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
setTimeout(() => {
  processRecurring();
  $('#splash').hidden = true;
  if (hasLock()) showLogin(); else showApp();
}, 700);
window.__tt = { get db() { return db; } };
})();