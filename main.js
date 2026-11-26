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
    /* v3.3: the menu opens over the page (does not push content down); the icon turns into a cross */
    var setMenu = function (open) { burger.setAttribute('aria-expanded', String(open)); mnav.hidden = !open; root.classList.toggle('is-menu', open); };
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    $$('.mv-mnav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); burger.focus(); } });
    doc.addEventListener('click', function (e) { if (!mnav.hidden && !mnav.contains(e.target) && !burger.contains(e.target)) setMenu(false); });
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
  if (mascot && !reduce && !root.classList.contains('m-off') && win.matchMedia('(min-width: 1024px)').matches) {
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
    var msg = { name: form.dataset.errName, email: form.dataset.errEmail, phone: form.dataset.errPhone, net: form.dataset.errNet };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var phone = form.elements.phone.value.trim();
      var bad = !name ? msg.name : !/^\S+@\S+\.\S+$/.test(email) ? msg.email : phone.replace(/\D/g, '').length < 7 ? msg.phone : '';
      if (bad) { err.textContent = bad; err.hidden = false; return; }
      var goalEl = form.querySelector('input[name="goal"]');
      var data = { name: name, email: email, phone: phone, goal: goalEl ? goalEl.value : '', page: win.location.href, lang: pageLang };
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

  /* ---------- v3.6 (test): hero words tilt slightly towards the cursor ---------- */
  if (!reduce && win.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.mv-hero [data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        el.classList.add('is-tilt');
      });
      el.addEventListener('mouseleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.classList.remove('is-tilt'); });
    });
  }

  /* ---------- v3.7: sticky header gets a background once the page scrolls ---------- */
  var headEl = $('.mv-head');
  if (headEl) {
    var onScrollHead = function () { headEl.classList.toggle('is-stuck', win.scrollY > 8); };
    onScrollHead(); win.addEventListener('scroll', onScrollHead, { passive: true });
  }

  /* ---------- v3.7: cards slide up softly when they enter the view, in order ---------- */
  var cardSel = '.v-fc, .v-pain, .v-flow-step, .v-case, .v-stage, .v-plan, .v-contact--2';
  var cards = $$(cardSel);
  if (cards.length && 'IntersectionObserver' in win && !reduce) {
    cards.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(cardSel); });
      el.style.setProperty('--ri', sibs.indexOf(el));
      el.classList.add('ri');
    });
    var cio = new win.IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('ri-in'); cio.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    cards.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- v3.7: the first case opens by itself when the cases block scrolls in ---------- */
  var acc = $('[data-accordion]');
  if (acc && tog.length) {
    var opened = false;
    var openFirst = function () { if (!opened && tog[0].getAttribute('aria-expanded') !== 'true') { opened = true; tog[0].click(); } };
    if ('IntersectionObserver' in win) {
      var aio = new win.IntersectionObserver(function (entries) { if (entries[0].isIntersecting) { openFirst(); aio.disconnect(); } }, { threshold: 0.25 });
      aio.observe(acc);
    } else { openFirst(); }
  }

  /* ---------- v3.7: hero — word slides out of the bars; right block is typed ---------- */
  var typeEl = $('[data-type]');
  if (typeEl) {
    var html = typeEl.innerHTML, parts = html.split(/<br\s*\/?>/i);
    if (reduce) { typeEl.classList.add('is-typed'); }
    else {
      typeEl.innerHTML = parts.map(function () { return '<span class="tw-line"></span>'; }).join('<br>');
      var lines = typeEl.querySelectorAll('.tw-line'), li = 0, ci = 0;
      var tick = function () {
        if (li >= parts.length) { typeEl.classList.add('is-typed'); return; }
        var txt = parts[li].replace(/&nbsp;/g, '\u00a0');
        lines[li].textContent = txt.slice(0, ++ci);
        if (ci >= txt.length) { li++; ci = 0; setTimeout(tick, 160); } else { setTimeout(tick, 42); }
      };
      setTimeout(tick, 1100);
    }
  }

  /* ---------- v3.3: footer wordmark stretches to the full content width ---------- */
  var fit = $('[data-fit]');
  if (fit) {
    var word = fit.firstElementChild;
    var fitWord = function () {
      fit.style.fontSize = '100px';
      var w = word.getBoundingClientRect().width;
      if (w) fit.style.fontSize = (100 * fit.clientWidth / w).toFixed(2) + 'px';
    };
    fitWord();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitWord);
    win.addEventListener('resize', fitWord);
  }

  /* ---------- v3.2: hero — thin streaks run along random grid lines ---------- */
  var streaks = $('[data-streaks]');
  if (streaks && !reduce && !root.classList.contains('m-off')) {
    var cell = function () { return Math.max(1, Math.min(1, win.innerWidth / 1920) * 80); };
    var spawn = function () {
      if (document.hidden || streaks.childElementCount >= 2) return;
      var w = streaks.clientWidth, h = streaks.clientHeight, c = cell(), el = document.createElement('i');
      var horiz = Math.random() < 0.6, t = 1.2 + Math.random() * 0.8;
      el.className = 'mv-streak ' + (horiz ? 'mv-streak--h' : 'mv-streak--v');
      if (horiz) {
        var row = Math.floor(Math.random() * Math.max(1, Math.floor(h / c))) * c;
        var x0 = Math.floor(Math.random() * Math.max(1, Math.floor(w / c) - 4)) * c;
        el.style.cssText = 'top:' + row + 'px;left:' + x0 + 'px;--dx:' + (c * 4) + 'px;--t:' + t + 's';
      } else {
        var col = Math.floor(Math.random() * Math.max(1, Math.floor(w / c))) * c;
        var y0 = Math.floor(Math.random() * Math.max(1, Math.floor(h / c) - 3)) * c;
        el.style.cssText = 'left:' + col + 'px;top:' + y0 + 'px;--dy:' + (c * 3) + 'px;--t:' + t + 's';
      }
      el.addEventListener('animationend', function () { el.remove(); });
      streaks.appendChild(el);
    };
    (function loop() { spawn(); setTimeout(loop, 1500 + Math.random() * 2000); })();
  }
}

if (typeof document !== 'undefined' && !document.querySelector('x-dc')) {
  document.addEventListener('DOMContentLoaded', function () { initMavpy(document.querySelector('.mv')); });
}
