/* MAVPY — "Workshop" v2. Vanilla JS, no dependencies.
   initMavpy(root) wires every interaction inside `root` (the .mv element). */
function initMavpy(root) {
  'use strict';
  if (!root) return;
  var doc = root.ownerDocument || document;
  var win = doc.defaultView || window;
  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

  /* ---------- Language: EN by default, choice remembered ---------- */
  var LANG_KEY = 'mavpy-lang';
  var pageLang = (root.getAttribute('lang') || doc.documentElement.lang || 'en').slice(0, 2);
  $$('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { try { win.localStorage.setItem(LANG_KEY, a.dataset.lang); } catch (e) {} });
  });
  if (root.hasAttribute('data-lang-redirect')) {
    var saved = null;
    try { saved = win.localStorage.getItem(LANG_KEY); } catch (e) {}
    var other = $('[data-lang="' + saved + '"]');
    if (saved && saved !== pageLang && other && other.getAttribute('href')) win.location.replace(other.getAttribute('href'));
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('.mv-burger');
  var mnav = $('.mv-mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mnav.hidden = open;
    });
    $$('.mv-mnav a.n').forEach(function (a) {
      a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mnav.hidden = true; });
    });
  }

  /* ---------- Cursor light: hero grid + pricing rows (mouse only) ---------- */
  if (win.matchMedia('(pointer: fine)').matches) {
    var hero = $('[data-spotlight]');
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
        hero.style.setProperty('--spot', '1');
      });
      hero.addEventListener('mouseleave', function () { hero.style.setProperty('--spot', '0'); });
    }
    $$('[data-spot-card]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--y', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Cases accordion: one open at a time ---------- */
  var tog = $$('[data-accordion] .mv-tog');
  tog.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = doc.getElementById(btn.getAttribute('aria-controls'));
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      tog.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var p = doc.getElementById(b.getAttribute('aria-controls'));
        if (p) p.classList.remove('is-open', 'is-in');
      });
      if (!wasOpen && panel) {
        btn.setAttribute('aria-expanded', 'true');
        void panel.offsetWidth; // restart the marker draw-on
        panel.classList.add('is-open', 'is-in');
      }
    });
  });

  /* ---------- Reveal: sections with data-reveal get .is-in on entering the view ---------- */
  var reveal = $$('[data-reveal]');
  if ('IntersectionObserver' in win) {
    var io = new win.IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.2 });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Mascot: scale 1 → 1.14 from the bottom-left corner while scrolling ---------- */
  var mascot = $('[data-mascot]');
  var reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mascot && !reduce && !root.classList.contains('m-off')) {
    var ticking = false;
    var update = function () {
      var r = mascot.getBoundingClientRect();
      var h = win.innerHeight;
      var p = Math.max(0, Math.min(1, (h - r.top) / (h + r.height)));
      mascot.style.setProperty('--ms', (1 + 0.14 * p).toFixed(3));
      ticking = false;
    };
    win.addEventListener('scroll', function () { if (!ticking) { ticking = true; win.requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Lead form → bot ----------
     Set data-endpoint on the form to your webhook (own server / n8n / Make → Telegram).
     The bot token stays on the server, never in this file. */
  var form = $('[data-lead-form]');
  if (form) {
    var err = form.querySelector('[data-form-error]');
    var msg = { name: form.dataset.errName, email: form.dataset.errEmail, net: form.dataset.errNet };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) { err.textContent = !name ? msg.name : msg.email; err.hidden = false; return; }
      var goalEl = form.querySelector('input[name="goal"]');
      var data = { name: name, email: email, phone: form.elements.phone.value.trim(), goal: goalEl ? goalEl.value : '', page: win.location.href, lang: pageLang };
      var done = function () { form.querySelector('[data-form-fields]').hidden = true; form.querySelector('[data-form-done]').hidden = false; };
      var endpoint = form.dataset.endpoint;
      if (!endpoint) { done(); return; }
      win.fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () { err.textContent = msg.net; err.hidden = false; });
    });
  }

  /* ---------- v3.0: team — all four below, each grows in turn every 6s ---------- */
  var team = $('[data-team]');
  if (team) {
    var members = Array.prototype.slice.call(team.querySelectorAll('[data-member]'));
    var tabs = Array.prototype.slice.call(team.querySelectorAll('[data-tab]'));
    var cur = 0, timer = null, DUR = 6000;
    var show = function (i) {
      cur = (i + members.length) % members.length;
      members.forEach(function (m, k) { var on = k === cur; m.classList.toggle('is-active', on); if (on) m.removeAttribute('aria-hidden'); else m.setAttribute('aria-hidden', 'true'); });
      tabs.forEach(function (b, k) { var on = k === cur; b.classList.remove('is-active'); b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) { void b.offsetWidth; b.classList.add('is-active'); } });
    };
    var auto = !reduce && !root.classList.contains('m-off');
    var start = function () { if (!auto) return; clearInterval(timer); team.classList.remove('is-paused'); timer = setInterval(function () { show(cur + 1); }, DUR); };
    var stop = function () { clearInterval(timer); team.classList.add('is-paused'); };
    tabs.forEach(function (b, k) { b.addEventListener('click', function () { show(k); start(); }); });
    team.addEventListener('mouseenter', stop);
    team.addEventListener('mouseleave', start);
    team.addEventListener('focusin', stop);
    show(0); start();
  }

  /* ---------- v3.0: pricing — pay once / pay in 3 parts ---------- */
  var payBtns = $$('[data-pay]');
  payBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      payBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var key = btn.dataset.pay === '3' ? 'p3' : 'p1';
      $$('.v-price b').forEach(function (b) { b.style.opacity = '0'; setTimeout(function () { b.innerHTML = b.dataset[key]; b.style.opacity = '1'; }, 160); });
    });
  });

  /* ---------- v3.0: "Get my estimate" on a plan pre-selects the goal in the form ---------- */
  $$('[data-goal]').forEach(function (a) {
    a.addEventListener('click', function () { var g = root.querySelector('input[name="goal"]'); if (g) g.value = a.dataset.goal; });
  });

  /* ---------- v3.0: "what happens next" steps light up as the form is filled ---------- */
  var nextSteps = $$('[data-next]');
  if (form && nextSteps.length) {
    var mark = function () {
      var n = 1 + (form.elements.name.value.trim() ? 1 : 0) + (/^\S+@\S+\.\S+$/.test(form.elements.email.value.trim()) ? 1 : 0);
      nextSteps.forEach(function (li, k) { li.classList.toggle('is-on', k < n); });
    };
    form.addEventListener('input', mark); mark();
  }
}

if (typeof document !== 'undefined' && !document.querySelector('x-dc')) {
  document.addEventListener('DOMContentLoaded', function () { initMavpy(document.querySelector('.mv')); });
}
