/*
TiTracker calculation core.
Exact port of the Excel sheet (one row per day):
B  Property     = previous day's H (first day: starting balance)
D  Outcome      = sum of "Outcome" entries
F  Expenses     = sum of "Expenses"
G  Income       = sum of "Income"
M  Credit       = sum of "Credit"
O  Debit        = sum of "Debit"
H  Rest         = MAX(0, B - Kprev + G + M - D - F - O)
K  Danger       = MAX(0, -(B - Kprev + G + M - D - F - O))
R  (free pool)  = IF(Kprev > 0, H * P, MAX(0, Rprev + (G-F-O+M) * P - D))
S  (back pool)  = IF(Kprev > 0, H * Q, MAX(0, IF(R=0, B+G+M-D-F-O, Sprev + (G-F-O+M) * Q)))
I  Free to use  = ROUND(R * 2, 0) / 2
J  Back Up      = MAX(0, ROUND(H * 2, 0) / 2 - I)
P = 0.7, Q = 0.3 by default (cells P2 / Q2).
*/
(function (root) {
  'use strict';
  const TYPES = ['outcome', 'expenses', 'income', 'credit', 'debit'];
  function dayNum(s) {
    const p = s.split('-').map(Number);
    return Math.round(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000);
  }
  function dayStr(n) {
    const d = new Date(n * 86400000);
    const z = (x) => String(x).padStart(2, '0');
    return d.getUTCFullYear() + '-' + z(d.getUTCMonth() + 1) + '-' + z(d.getUTCDate());
  }
  // Excel ROUND(x * 2, 0) / 2 -> nearest 0.5 (half away from zero)
  function half(x) {
    const y = x * 2;
    return (y < 0 ? -Math.round(-y) : Math.round(y)) / 2;
  }
  /**
   * entries: [{date:'YYYY-MM-DD', type, value:Number, category?, recurring?}]
   * cfg: {start:Number, startDate:'YYYY-MM-DD', share:Number (percent for P, default 70)}
   * upTo: 'YYYY-MM-DD'
   * returns array of daily rows from startDate to upTo (inclusive)
   */
  function compute(entries, cfg, upTo) {
    const P = (cfg.share == null ? 70 : cfg.share) / 100;
    const Q = (100 - (cfg.share == null ? 70 : cfg.share)) / 100;
    const first = dayNum(cfg.startDate);
    const last = dayNum(upTo);
    const byDay = new Map();
    for (const e of entries) {
      const n = dayNum(e.date);
      if (n < first || n > last) continue;
      let s = byDay.get(n);
      if (!s) { s = { outcome: 0, expenses: 0, income: 0, credit: 0, debit: 0 }; byDay.set(n, s); }
      if (s[e.type] !== undefined) s[e.type] += Number(e.value) || 0;
    }
    const rows = [];
    let Hp = 0, Kp = 0;
    const startBal = Number(cfg.start) || 0;
    let Rp = startBal * P;
    let Sp = startBal * Q;
    for (let n = first; n <= last; n++) {
      const s = byDay.get(n) || { outcome: 0, expenses: 0, income: 0, credit: 0, debit: 0 };
      const D = s.outcome, F = s.expenses, G = s.income, M = s.credit, O = s.debit;
      const B = n === first ? startBal : Hp;
      const net = B - Kp + G + M - D - F - O;
      const H = Math.max(0, net);
      const K = Math.max(0, -net);
      const flow = G - F - O + M;
      let R, S;
      if (Kp > 0) {
        R = H * P;
        S = H * Q;
      } else {
        const x = Rp + flow * P - D;
        R = x > 0 ? x : 0;
        const y = R === 0 ? B + G + M - D - F - O : Sp + flow * Q;
        S = y < 0 ? 0 : y;
      }
      const I = half(R);
      const J = Math.max(0, half(H) - I);
      rows.push({ date: dayStr(n), B, D, F, G, M, O, H, I, J, K, R, S });
      Hp = H; Kp = K; Rp = R; Sp = S;
    }
    return rows;
  }

  // Aggregate entries by category for a given date range
  function byCategory(entries, from, to, typeFilter) {
    const map = new Map();
    for (const e of entries) {
      if (typeFilter && e.type !== typeFilter) continue;
      if (from && e.date < from) continue;
      if (to && e.date > to) continue;
      const cat = e.category || 'uncategorized';
      const cur = map.get(cat) || { total: 0, count: 0, entries: [] };
      cur.total += Number(e.value) || 0;
      cur.count += 1;
      cur.entries.push(e);
      map.set(cat, cur);
    }
    return Array.from(map.entries()).map(([cat, data]) => ({ category: cat, ...data }));
  }

  // Aggregate entries by day for charting
  function byDay(entries, from, to, typeFilter) {
    const map = new Map();
    for (const e of entries) {
      if (typeFilter && e.type !== typeFilter) continue;
      if (from && e.date < from) continue;
      if (to && e.date > to) continue;
      const cur = map.get(e.date) || { total: 0, count: 0 };
      cur.total += Number(e.value) || 0;
      cur.count += 1;
      map.set(e.date, cur);
    }
    return Array.from(map.entries()).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date));
  }

  const api = { compute, dayNum, dayStr, byCategory, byDay, TYPES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calc = api;
})(typeof self !== 'undefined' ? self : this);