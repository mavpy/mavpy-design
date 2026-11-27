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
  if (mascot && !reduce && !root.classList.contains('m-off') && win.matchMedia('(min-width: 1200px)').matches) {
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
      $$('.v-price').forEach(function (pr) { pr.classList.toggle('is-3', key === 'p3'); });
      $$('.v-price [data-p1]').forEach(function (b) { b.style.opacity = '0'; setTimeout(function () { b.innerHTML = b.dataset[key]; b.style.opacity = '1'; }, 160); });
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

  /* v3.14: the page always opens at the very top, under the header — even after a menu link put a #anchor in the URL;
     menu links scroll to their section without writing the anchor into the address */
  if ('scrollRestoration' in win.history) win.history.scrollRestoration = 'manual';
  if (win.location.hash && win.history.replaceState) win.history.replaceState(null, '', win.location.pathname + win.location.search);
  win.scrollTo(0, 0);
  win.addEventListener('load', function () { win.scrollTo(0, 0); });
  win.addEventListener('pageshow', function (e) { if (e.persisted) win.scrollTo(0, 0); });
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id ? doc.getElementById(id) : null;
    if (!target && id !== 'top' && id !== '') return;
    e.preventDefault();
    if (target) {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      /* content above can grow while we travel (a case opens, cards reveal) — settle on the section */
      var tries = 0, settle = function () {
        var off = parseFloat(getComputedStyle(target).scrollMarginTop) || 0, d = target.getBoundingClientRect().top - off;
        if (Math.abs(d) > 4 && tries++ < 4) { target.scrollIntoView({ behavior: 'auto', block: 'start' }); setTimeout(settle, 250); }
      };
      setTimeout(settle, 900);
    }
    else win.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* v3.14: on phones the reviews stop running — one review in the centre, ← → to page through */
  var revBox = $('[data-revs]'), revNav = $('.v-rev-nav');
  if (revBox && revNav) {
    var phone = win.matchMedia('(max-width: 600px)');
    var all = Array.prototype.slice.call(revBox.querySelectorAll('.v-review:not([aria-hidden])'));
    var n = Math.round(all.length / 2) || all.length, cards = all.slice(0, n), cur = 0;
    var count = revNav.querySelector('.v-rev-count');
    var show = function () {
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === cur); });
      if (count) count.textContent = (cur + 1) + ' / ' + n;
    };
    var setMode = function () {
      var on = phone.matches;
      revBox.classList.toggle('is-slider', on);
      revNav.setAttribute('aria-hidden', on ? 'false' : 'true');
      revNav.querySelectorAll('button').forEach(function (b) { b.tabIndex = on ? 0 : -1; });
      show();
    };
    revNav.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dir]'); if (!b) return;
      cur = (cur + Number(b.getAttribute('data-dir')) + n) % n; show();
    });
    if (phone.addEventListener) phone.addEventListener('change', setMode); else phone.addListener(setMode);
    setMode();
  }

  /* ---------- v3.7: sticky header gets a background once the page scrolls ---------- */
  var headEl = $('.mv-head');
  if (headEl) {
    var onScrollHead = function () { headEl.classList.toggle('is-stuck', win.scrollY > 24); };
    onScrollHead(); win.addEventListener('scroll', onScrollHead, { passive: true });
  }

  /* ---------- v3.7: cards slide up softly when they enter the view, in order ---------- */
  var cardSel = '.v-fc, .v-pain, .v-case, .v-stage, .v-plan, .v-contact--2';
  var cards = $$(cardSel);
  if (cards.length && 'IntersectionObserver' in win && !reduce) {
    cards.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(cardSel); });
      el.style.setProperty('--ri', sibs.indexOf(el));
      el.classList.add('ri');
    });
    var cio = new win.IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('ri-in'); cio.unobserve(en.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -18% 0px' });
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

  /* ---------- v3.8: typed text (hero right block on load, process details on scroll), no caret ---------- */
  var typeIt = function (el, startDelay, done, speed) {
    speed = speed || 28;
    var parts = el.innerHTML.split(/<br\s*\/?>/i);
    if (reduce) { if (done) done(); return; }
    el.style.minHeight = el.offsetHeight + 'px';
    el.innerHTML = parts.map(function () { return '<span class="tw-line"></span>'; }).join('<br>');
    el.classList.remove('tw-wait');
    var lines = el.querySelectorAll('.tw-line'), li = 0, ci = 0;
    var tick = function () {
      if (li >= parts.length) { el.classList.add('is-typed'); if (done) done(); return; }
      var tmp = document.createElement('span'); tmp.innerHTML = parts[li];
      var txt = tmp.textContent;
      lines[li].textContent = txt.slice(0, ++ci);
      if (ci >= txt.length) { li++; ci = 0; setTimeout(tick, speed * 5); } else { setTimeout(tick, speed); }
    };
    setTimeout(tick, startDelay);
  };
  $$('[data-type]:not([data-type="scroll"])').forEach(function (el) { typeIt(el, 1100); });
  /* process (v3.11): each card slides in; the moment it lands the amber line draws and its text types fast;
     the next card starts when the previous one is ~2/3 in — one smooth chain 1 → 2 → 3 */
  var steps = $$('#how .v-flow-step');
  if (steps.length && 'IntersectionObserver' in win && !reduce) {
    steps.forEach(function (st) { st.classList.add('pseq'); var m = st.querySelector('[data-type="scroll"]'); if (m) m.classList.add('tw-wait'); });
    /* v3.12: cards slide in one after another without pauses; once all are in, texts type —
       card 1, card 2 0.7 s later, card 3 another 0.7 s later (overlapping); each line draws with its text */
    /* v3.13: cards slide in top to bottom; each card's text types fast the moment that card has landed */
    var runStep = function () {
      steps.forEach(function (st, k) {
        setTimeout(function () {
          st.classList.add('pseq-in');
          setTimeout(function () {
            st.classList.add('pseq-line');
            var txt = st.querySelector('[data-type="scroll"]');
            if (txt) typeIt(txt, 0, null, 8);
          }, 450);
        }, k * 220);
      });
    };
    var sio = new win.IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { sio.disconnect(); runStep(0); }
    }, { threshold: 0.25, rootMargin: '0px 0px -15% 0px' });
    sio.observe(steps[0]);
  }


  /* ---------- v3.11: hero — the big word fills the container exactly (UA and EN, every width);
     on tablet/mobile «НОВІ КЛІЄНТИ» stays on one line and fills the width like «MORE» ---------- */
  var heroIn = $('.mv-hero-in'), heroBig = $('.mv-hero .mv-clients'), heroTop = $('.mv-hero .mv-more');
  if (heroIn && heroBig) {
    var isUa = (doc.documentElement.lang || '').indexOf('uk') === 0;
    var natural = function (el, disp) {
      var od = el.style.display, ow = el.style.width; el.style.display = disp; el.style.width = 'max-content';
      var w = el.getBoundingClientRect().width; el.style.display = od; el.style.width = ow; return w;
    };
    var fitHero = function () {
      var cs = win.getComputedStyle(heroIn);
      var W = heroIn.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      heroBig.style.fontSize = '100px';
      var w = natural(heroBig, 'inline-block');
      if (w) heroBig.style.fontSize = (100 * W / w).toFixed(2) + 'px';
      if (false && isUa && heroTop) {
        heroTop.style.fontSize = '';
        if (win.innerWidth < 1200) {
          var word = heroTop.querySelector('.mv-more-w'), bars = heroTop.querySelector('.mv-bars');
          heroTop.style.fontSize = '100px';
          var tw = word ? natural(word, 'inline-block') : 0;
          var gap = parseFloat(win.getComputedStyle(heroTop).columnGap) || 0;
          var room = W - (bars ? bars.getBoundingClientRect().width + gap : 0) - 2;
          if (tw) heroTop.style.fontSize = (100 * room / tw).toFixed(2) + 'px';
        }
      }
    };
    fitHero();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitHero);
    win.addEventListener('resize', fitHero);
  }

  /* ---------- v3.12: entrance animation no longer locks the button transform — hover grows it like everywhere ---------- */
  $$('.mv-btn.a-rise').forEach(function (el) {
    el.addEventListener('animationend', function () { el.classList.remove('a-rise'); el.style.opacity = '1'; });
  });

  /* ---------- v3.3: footer wordmark stretches to the full content width ---------- */
  var fit = $('[data-fit]');
  if (fit) {
    var word = fit.firstElementChild;
    var fitWord = function () {
      fit.style.fontSize = '100px';
      var w = word.getBoundingClientRect().width;
      if (w) fit.style.fontSize = (99 * fit.clientWidth / w).toFixed(2) + 'px';
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
