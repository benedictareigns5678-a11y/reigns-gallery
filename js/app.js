/* ==============================================================
   Suleiman Sallah — portfolio engine. You never need to edit this.
   Reads GALLERY and WORKS from js/works.js.
   ============================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- identity ---------- */

  function text(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  var WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function inWords(n) {
    if (n < 20) return WORDS[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + WORDS[n % 10].toLowerCase() : "");
    return String(n);
  }

  text("[data-owner]", GALLERY.owner);
  text("[data-year]", String(new Date().getFullYear()));
  text("[data-count]", String(WORKS.length));
  text("[data-count-words]", inWords(WORKS.length));
  document.title = GALLERY.owner + " — Website Portfolio";

  var mailto = "mailto:" + GALLERY.email + "?subject=" +
    encodeURIComponent("New project — via " + GALLERY.owner);
  document.querySelectorAll("[data-mailto]").forEach(function (el) {
    el.setAttribute("href", mailto);
  });
  text("[data-email-text]", GALLERY.email);

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* image paths: shots/name.jpg -> shots/w/name-960.webp etc. */
  function base(work) { return work.image ? work.image.replace(/^shots\//, "").replace(/\.\w+$/, "") : null; }
  function webp(work, w) { return "shots/w/" + base(work) + "-" + w + ".webp"; }
  function srcset(work) { return webp(work, 960) + " 960w, " + webp(work, 1600) + " 1600w"; }

  /* ==============================================================
     THE COLOUR WALL
     ============================================================== */

  var wall = document.querySelector("[data-wall]");
  if (wall && WORKS.length) buildWall();

  function buildWall() {
    var bandsEl = wall.querySelector("[data-bands]");
    var stage = wall.querySelector("[data-stage]");
    var stageImgs = stage.querySelectorAll(".stage-img");
    var capText = wall.querySelector(".cap-text");
    var capName = wall.querySelector("[data-cap-name]");
    var capMedium = wall.querySelector("[data-cap-medium]");
    var capLink = wall.querySelector("[data-cap-link]");

    /* --- order the wall by colour: hue, nudged so darker shades lead --- */
    function hsl(hex) {
      var n = parseInt(hex.slice(1), 16);
      var r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h = 0;
      if (d) {
        if (max === r) h = ((g - b) / d + 6) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
      }
      return { h: h * 60, l: (max + min) / 2 };
    }

    var items = WORKS.map(function (w, i) {
      var c = w.colour || (w.ink ? w.ink[1] : "#888888");
      var k = hsl(c);
      return { work: w, colour: c, key: k.h + 50 * k.l, newest: i === 0 };
    }).sort(function (a, b) { return a.key - b.key; });

    items.push({ yours: true });   /* the empty band, always last */

    var startIndex = 0;
    items.forEach(function (it, i) { if (it.newest) startIndex = i; });

    /* --- build the bands --- */
    bandsEl.innerHTML = items.map(function (it, i) {
      if (it.yours) {
        return '<a class="band band--yours" href="#contact" style="--i:' + i + '" tabindex="-1" ' +
          'aria-label="Your brand, next on the wall. Start a project">' +
          '<span class="yours-inner" aria-hidden="true">Your brand, next on the wall' +
          '<small>Start a project</small></span></a>';
      }
      var w = it.work;
      return '<a class="band" href="' + esc(w.url) + '" target="_blank" rel="noopener" tabindex="-1" ' +
        'style="--c:' + esc(it.colour) + ';--i:' + i + '" ' +
        'aria-label="' + esc(w.title + ", " + w.medium + ". Opens the live site in a new tab") + '">' +
        (w.image ? '<span class="band-img"><img alt="" decoding="async" data-srcset="' + srcset(w) + '" /></span>' : "") +
        "</a>";
    }).join("");

    var bands = Array.prototype.slice.call(bandsEl.children);
    var ring = document.createElement("span");      /* marks the open band: focus ring / strip selection */
    ring.className = "wall-ring";
    ring.setAttribute("aria-hidden", "true");
    bandsEl.appendChild(ring);
    var capInner = wall.querySelector(".cap-inner");

    var current = -1;
    var mode = "";            /* "deck" or "strip" */
    var phone = false;
    var geo = { wc: 28, open: 900, gap: 4 };
    var bandsLeft = 0;        /* cached in layout(): reading it live would force layout mid-animation */

    /* ---------------------------------------------------------------
       Motion. Every band is as wide as an open band and they are
       stacked left to right, each one covering the last. Opening a band
       only slides the bands after it along: transforms, run by the
       compositor, so the wall never makes the page lay itself out again
       mid-sweep. Each move is a Web Animation whose curve is also
       evaluated here, so a sweep can retarget mid-flight without a jump.
       --------------------------------------------------------------- */
    var DUR = reduceMotion ? 0 : 620;
    function ease(t) { return 1 - Math.pow(1 - t, 4); }           /* quart out */
    var EASING = (function () {
      var pts = [];
      for (var k = 0; k <= 24; k++) pts.push(ease(k / 24).toFixed(4));
      var lin = "linear(" + pts.join(", ") + ")";
      return (window.CSS && CSS.supports && CSS.supports("transition-timing-function", lin))
        ? lin : "cubic-bezier(0.25, 1, 0.5, 1)";
    })();

    function mover(el) { return { el: el, from: 0, to: 0, t0: 0, anim: null }; }
    var movers = bands.map(mover);
    var ringM = mover(ring), capM = mover(capInner);

    function posNow(m, now) {
      if (!m.anim || !DUR) return m.to;
      var t = Math.min(1, (now - m.t0) / DUR);
      return m.from + (m.to - m.from) * ease(t);
    }

    function px(x) { return "translate3d(" + x.toFixed(2) + "px,0,0)"; }

    function moveTo(m, x, now, instant) {
      var cur = posNow(m, now);
      if (!instant && !m.anim && Math.abs(m.to - x) < 0.5) return;   /* already there */
      if (m.anim) { m.anim.cancel(); m.anim = null; }
      m.to = x;
      m.el.style.transform = px(x);
      if (instant || !DUR || Math.abs(cur - x) < 0.5 || !m.el.animate) return;
      m.from = cur;
      m.t0 = now;
      var a = m.el.animate([{ transform: px(cur) }, { transform: px(x) }], { duration: DUR, easing: EASING });
      m.anim = a;
      a.onfinish = function () { if (m.anim === a) m.anim = null; };
    }

    /* where band i's visible left edge sits once the wall settles on open band o */
    function xOf(i, o) {
      return i * (geo.wc + geo.gap) + (i > o ? geo.open - geo.wc : 0);
    }

    function settle(instant) {
      var now = performance.now();
      movers.forEach(function (m, i) { moveTo(m, xOf(i, current) - geo.gap, now, instant); });
      moveTo(ringM, xOf(current, current), now, instant);
      moveTo(capM, mode === "deck" ? xOf(current, current) : 0, now, instant);
    }

    /* hover targets come from the settled geometry, never the moving DOM,
       so the wall can't flicker between two bands while it animates */
    function indexAt(clientX) {
      var x = clientX - bandsLeft;
      for (var i = bands.length - 1; i > 0; i--) {
        if (x >= xOf(i, current) - geo.gap / 2) return i;
      }
      return 0;
    }

    /* --- images load on demand; all of them once the visitor engages --- */
    function loadBand(i) {
      var img = bands[i].querySelector("img");
      if (!img || img.getAttribute("srcset")) return;
      img.setAttribute("sizes", Math.round(geo.open) + "px");
      img.setAttribute("srcset", img.getAttribute("data-srcset"));
      var done = function () { bands[i].classList.add("is-loaded"); };
      if (img.complete && img.naturalWidth) done();
      else img.addEventListener("load", done, { once: true });
    }
    var hydrated = false;
    function hydrateAll() {
      if (hydrated || mode !== "deck") return;
      hydrated = true;
      bands.forEach(function (_, i) { loadBand(i); });
    }

    /* --- layout: work out band sizes for this screen --- */
    function layout() {
      var cw = bandsEl.clientWidth;
      var n = bands.length;
      var nextMode = cw >= 900 ? "deck" : "strip";
      var wasPhone = phone, changed = nextMode !== mode;
      phone = window.innerWidth < 640;
      if (changed) {
        mode = nextMode;
        wall.classList.toggle("is-strip", mode === "strip");
      }
      if (mode === "strip" && current >= 0 && (changed || wasPhone !== phone)) showOnStage(items[current]);
      if (mode === "deck" && current >= 0 && changed) loadBand(current);
      wall.classList.toggle("is-phone", mode === "strip" && phone);

      if (mode === "deck") {
        var gap = 4;
        var top = wall.getBoundingClientRect().top + window.scrollY;
        var avail = window.innerHeight - top - 72 - 28;     /* room for the caption */
        var h = Math.max(360, Math.min(avail, 760));
        var open = h * 1.6;
        var wc = (cw - open - (n - 1) * gap) / (n - 1);
        if (wc < 18) { wc = 18; open = cw - (n - 1) * (wc + gap); h = Math.min(h, open / 1.6); }
        if (wc > 56) { wc = 56; open = cw - (n - 1) * (wc + gap); }
        geo = { wc: wc, open: open, gap: gap };
        wall.style.setProperty("--h", Math.round(h) + "px");
      } else {
        var g = 3, c = (cw - (n - 1) * g) / (n - 1 + 3);
        geo = { wc: c, open: 3 * c, gap: g };
        wall.style.removeProperty("--h");
      }
      wall.style.setProperty("--gap", geo.gap + "px");
      wall.style.setProperty("--open", geo.open.toFixed(2) + "px");
      bandsLeft = bandsEl.getBoundingClientRect().left;

      bands.forEach(function (b) {
        var img = b.querySelector("img");
        if (img && img.getAttribute("srcset")) img.setAttribute("sizes", Math.round(geo.open) + "px");
      });
      if (current >= 0) settle(true);
    }

    /* --- open a band --- */
    function open(i, opts) {
      opts = opts || {};
      i = Math.max(0, Math.min(bands.length - 1, i));
      if (i === current) return;
      var prev = current;
      current = i;

      if (prev >= 0) {
        bands[prev].classList.remove("is-open");
        bands[prev].setAttribute("tabindex", "-1");
      }
      bands[i].classList.add("is-open");
      bands[i].setAttribute("tabindex", "0");
      bandsEl.classList.toggle("is-yours-open", !!items[i].yours);
      if (mode === "deck") loadBand(i);
      settle(prev < 0);

      var it = items[i];
      if (it.yours) {
        capName.textContent = "Yours";
        capMedium.textContent = "The next band on the wall";
        capLink.textContent = "Start a project";
        capLink.setAttribute("href", "#contact");
        capLink.removeAttribute("target");
      } else {
        capName.textContent = it.work.title;
        capMedium.textContent = it.work.medium;
        capLink.innerHTML = 'Open the live site <span aria-hidden="true">&#8599;</span>';
        capLink.setAttribute("href", it.work.url);
        capLink.setAttribute("target", "_blank");
      }
      if (prev >= 0 && !reduceMotion && capText.animate) {
        capText.animate(
          [{ opacity: 0, transform: "translate3d(0,5px,0)" }, { opacity: 1, transform: "none" }],
          { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
      }

      if (mode === "strip") showOnStage(it);
      if (opts.focus) bands[i].focus({ preventScroll: true });
    }

    /* --- compact layout: the stage crossfades between two images --- */
    var front = 0;
    function showOnStage(it) {
      stage.classList.toggle("is-yours", !!it.yours);
      if (it.yours) {
        stage.setAttribute("href", "#contact");
        stage.removeAttribute("target");
        stage.setAttribute("aria-label", "Start a project");
        stageImgs.forEach(function (im) { im.classList.remove("is-on"); });
        return;
      }
      var w = it.work;
      stage.style.setProperty("--c", it.colour);
      stage.setAttribute("href", w.url);
      stage.setAttribute("target", "_blank");
      stage.setAttribute("aria-label", w.title + ", opens the live site in a new tab");

      var next = stageImgs[1 - front];
      var src = phone && w.mobile ? w.mobile : (w.image ? webp(w, 960) : "");
      var token = String(Math.random());
      next.dataset.token = token;
      stageImgs[front].dataset.token = "";
      var reveal = function () {
        if (next.dataset.token !== token) return;
        next.classList.add("is-on");
        stageImgs[front].classList.remove("is-on");
        front = 1 - front;
      };
      if (!src) { stageImgs[front].classList.remove("is-on"); return; }
      if (next.getAttribute("src") === src && next.complete) { reveal(); return; }
      next.classList.remove("is-on");
      next.onload = reveal;
      next.onerror = function () {   /* no phone capture yet: use the desktop one */
        if (phone && w.image && next.getAttribute("src") !== webp(w, 960)) next.src = webp(w, 960);
      };
      next.src = src;

      /* warm the neighbours so scrubbing feels instant */
      [current - 1, current + 1].forEach(function (j) {
        var n = items[j];
        if (n && n.work) { var pre = new Image(); pre.src = phone && n.work.mobile ? n.work.mobile : webp(n.work, 960); }
      });
    }

    /* --- input --- */
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    /* pointer input is folded into one update per frame */
    var wantX = 0, frame = 0;
    function want(x) {
      wantX = x;
      if (!frame) frame = requestAnimationFrame(function () { frame = 0; open(indexAt(wantX)); });
    }

    bandsEl.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || scrubbing) return;   /* mouse: hovering looks through, in both layouts */
      hydrateAll();
      want(e.clientX);
    });

    /* touch on the deck (large tablets): first tap opens, second visits */
    bandsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".band");
      if (!b) return;
      var i = bands.indexOf(b);
      if (mode === "strip") { e.preventDefault(); return; }   /* the stage is the link there */
      if (i !== current) { e.preventDefault(); open(i); }
    });

    /* the strip is a scrubber: drag a thumb across the colours */
    var scrubbing = false;
    bandsEl.addEventListener("pointerdown", function (e) {
      if (mode !== "strip") return;
      scrubbing = true;
      bandsEl.setPointerCapture(e.pointerId);
      open(indexAt(e.clientX));
      e.preventDefault();
    });
    bandsEl.addEventListener("pointermove", function (e) {
      if (scrubbing) want(e.clientX);
    });
    ["pointerup", "pointercancel"].forEach(function (t) {
      bandsEl.addEventListener(t, function () { scrubbing = false; });
    });

    /* swipe the stage to step through */
    var sx = 0, sy = 0, swiped = false;
    stage.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; swiped = false; });
    stage.addEventListener("pointerup", function (e) {
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiped = true;
        open(current + (dx < 0 ? 1 : -1));
      }
    });
    stage.addEventListener("click", function (e) { if (swiped) { e.preventDefault(); swiped = false; } });

    /* keyboard: one tab stop; arrows walk the wall */
    bandsEl.addEventListener("keydown", function (e) {
      var k = e.key, to = null;
      if (k === "ArrowRight" || k === "ArrowDown") to = current + 1;
      else if (k === "ArrowLeft" || k === "ArrowUp") to = current - 1;
      else if (k === "Home") to = 0;
      else if (k === "End") to = bands.length - 1;
      if (to === null) return;
      e.preventDefault();
      hydrateAll();
      open(to, { focus: true });
    });
    bandsEl.addEventListener("focusin", function (e) {
      var i = bands.indexOf(e.target);
      var visible = true;
      try { visible = e.target.matches(":focus-visible"); } catch (err) {}
      bandsEl.classList.toggle("is-focused", visible);
      if (i >= 0 && i !== current) open(i);
    });
    bandsEl.addEventListener("focusout", function () { bandsEl.classList.remove("is-focused"); });

    wall.addEventListener("pointerenter", hydrateAll, { once: true });

    /* --- go --- */
    var rq = 0;
    window.addEventListener("resize", function () {
      cancelAnimationFrame(rq);
      rq = requestAnimationFrame(layout);
    });

    layout();
    if (!reduceMotion) {
      wall.classList.add("is-arriving");
      setTimeout(function () { wall.classList.remove("is-arriving"); }, 1800);
    }
    open(startIndex);
    if (mode === "deck") {
      var first = bands[startIndex].querySelector("img");
      if (first) first.setAttribute("fetchpriority", "high");
    }

    /* fonts can move the wall: settle the layout once they're in */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    /* after load, quietly fetch the rest so the first sweep is instant */
    window.addEventListener("load", function () {
      var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1200); };
      idle(hydrateAll, { timeout: 2500 });
    });
  }

  /* ==============================================================
     SELECTED WORK — the colour rooms
     ============================================================== */

  var roomsEl = document.querySelector("[data-rooms]");
  if (roomsEl) buildRooms();

  function buildRooms() {
    var featured = WORKS.filter(function (w) { return w.featured; });
    if (!featured.length) { roomsEl.hidden = true; return; }

    function rgb(hex) { var n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    function hex(c) { return "#" + c.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }
    function mix(a, b, t) { a = rgb(a); b = rgb(b); return hex(a.map(function (v, i) { return v + (b[i] - v) * t; })); }
    function lum(h) {
      return rgb(h).reduce(function (acc, v, i) {
        v /= 255; v = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        return acc + v * [0.2126, 0.7152, 0.0722][i];
      }, 0);
    }

    var INK = "#161513", PAPER = "#f3f1ec";

    roomsEl.innerHTML = featured.map(function (w, i) {
      var c = w.colour || "#555555";
      var room = mix(c, INK, 0.4);              /* the brand's colour, a shade deeper so its site stands off the wall */
      var dark = lum(room) < 0.3;
      var fg = dark ? PAPER : INK;
      var next = featured[i + 1];
      var nextLink = next
        ? '<a class="room-next" href="#room-' + (i + 1) + '">Next <i style="background:' + esc(next.colour) + '"></i>' + esc(next.title) + "</a>"
        : '<a class="room-next" href="#work">Next: every site, by the kind of brand</a>';
      var alt = esc(w.title + " — " + w.medium);
      return (
        '<article class="room' + (i % 2 ? " room--flip" : "") + (dark ? "" : " room--light") + '" id="room-' + i + '" ' +
        'data-room="' + esc(room) + '" style="--room:' + esc(room) + ";--room-deep:" + esc(mix(c, INK, 0.62)) + ";--fg:" + fg + '">' +
          '<div class="room-head">' +
            '<p class="room-kind">' + esc(w.kind || "Website") + ", " + esc(w.year) + "</p>" +
            '<h2 class="room-name">' + esc(w.title) + "</h2>" +
            '<p class="room-story">' + esc(w.story || w.medium) + "</p>" +
          "</div>" +
          '<div class="room-media">' +
            '<a class="room-desk" href="' + esc(w.url) + '" target="_blank" rel="noopener" aria-label="' + esc(w.title) + ', opens the live site in a new tab">' +
              '<img src="' + webp(w, 960) + '" srcset="' + srcset(w) + '" sizes="(min-width: 1000px) 62vw, 100vw" ' +
              'width="1600" height="1000" alt="' + alt + ', desktop" loading="lazy" decoding="async" />' +
            "</a>" +
            (w.mobile ? '<span class="room-phone"><img src="' + esc(w.mobile) + '" width="390" height="844" alt="' +
              esc(w.title) + ' on a phone" loading="lazy" decoding="async" /></span>' : "") +
          "</div>" +
          '<div class="room-foot">' +
            (w.made ? '<p class="room-made"><b>What I made</b>' + esc(w.made) + "</p>" : "") +
            '<a class="room-visit u-link" href="' + esc(w.url) + '" target="_blank" rel="noopener">Visit ' + esc(w.title) +
              ' <span aria-hidden="true">&#8599;</span></a>' +
          "</div>" +
          nextLink +
        "</article>"
      );
    }).join("");

    var rooms = Array.prototype.slice.call(roomsEl.querySelectorAll(".room"));
    var layers = Array.prototype.slice.call(document.querySelectorAll(".room-light i"));
    var front = 0, lit = null;

    /* the light in the room: two fixed full-screen layers that crossfade
       (opacity only), so a colour change never repaints the page */
    function light(colour) {
      if (colour === lit) return;
      lit = colour;
      if (!colour) {
        layers.forEach(function (l) { l.classList.remove("is-on"); });
        document.querySelector('meta[name="theme-color"]').setAttribute("content", PAPER);
        return;
      }
      var back = layers[1 - front];
      back.style.backgroundColor = colour;
      back.classList.add("is-on");
      layers[front].classList.remove("is-on");
      front = 1 - front;
      document.querySelector('meta[name="theme-color"]').setAttribute("content", colour);
    }

    /* a room is "on" while it holds the middle of the screen */
    var active = null;
    var inBand = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) inBand.add(e.target); else inBand.delete(e.target);
      });
      var on = null;
      rooms.forEach(function (r) { if (inBand.has(r)) on = r; });
      if (on === active) return;
      if (active) active.classList.remove("is-lit");
      active = on;
      if (on) { on.classList.add("is-lit", "has-entered"); }
      light(on ? on.getAttribute("data-room") : null);
    }, { rootMargin: "-46% 0px -46% 0px" });
    rooms.forEach(function (r) { io.observe(r); });

    /* the "Next" links glide to the next room */
    roomsEl.addEventListener("click", function (e) {
      var a = e.target.closest(".room-next");
      if (!a) return;
      var t = document.querySelector(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  /* ==============================================================
     THE INDEX — every site, by the kind of brand
     ============================================================== */

  var indexEl = document.querySelector("[data-index]");
  if (indexEl) buildIndex();

  function buildIndex() {
    var KINDS = ["Fashion and beauty", "Food and drink", "Product and tech", "Interiors and architecture"];
    WORKS.forEach(function (w) { if (w.kind && KINDS.indexOf(w.kind) < 0) KINDS.push(w.kind); });
    var flat = [];
    var groups = KINDS.map(function (k) {
      return { kind: k, works: WORKS.filter(function (w) { return (w.kind || KINDS[0]) === k; }) };
    }).filter(function (g) { return g.works.length; });

    text("[data-kind-count]", inWords(groups.length).toLowerCase());

    indexEl.innerHTML = groups.map(function (g) {
      return '<div class="ix-group"><h3 class="ix-kind">' + esc(g.kind) + "<span>" + g.works.length + "</span></h3>" +
        '<ul class="ix-rows">' + g.works.map(function (w) {
          var i = flat.push(w) - 1;
          return '<li><a class="ix-row" href="' + esc(w.url) + '" target="_blank" rel="noopener" data-i="' + i + '" ' +
            'style="--c:' + esc(w.colour || "#888888") + '">' +
            '<span class="ix-chip">' + (w.image ? '<img src="' + esc("shots/w/" + base(w) + "-480.webp") +
              '" width="480" height="300" alt="" loading="lazy" decoding="async" />' : "") + "</span>" +
            '<span class="ix-name">' + esc(w.title) + "</span>" +
            '<span class="ix-medium">' + esc(w.medium) + "</span>" +
            '<span class="ix-year">' + esc(w.year) + "</span>" +
            '<span class="ix-go" aria-hidden="true">&#8599;</span>' +
            '<span class="sr-only">, opens in a new tab</span>' +
          "</a></li>";
        }).join("") + "</ul></div>";
    }).join("");

    var rows = Array.prototype.slice.call(indexEl.querySelectorAll(".ix-row"));
    var win = document.querySelector("[data-window]");
    if (!win || !rows.length) return;
    var frame = win.querySelector(".window-frame");
    var panes = Array.prototype.slice.call(win.querySelectorAll(".window-pane"));
    var wName = win.querySelector("[data-window-name]");
    var wKind = win.querySelector("[data-window-kind]");
    var front = 0, shown = -1, timer = 0;
    var SLIDE = "cubic-bezier(0.25, 1, 0.5, 1)";

    /* the window opens the way the wall does: the colour sweeps in
       first, then the site appears on it */
    function show(i, instant) {
      if (i === shown) return;
      shown = i;
      var w = flat[i];
      rows.forEach(function (r, j) { r.classList.toggle("is-on", j === i); });
      wName.textContent = w.title;
      wKind.textContent = (w.kind || "") + ", " + w.year;

      var pane = panes[1 - front], old = panes[front];
      var img = pane.querySelector("img");
      pane.getAnimations().concat(img.getAnimations()).forEach(function (a) { a.cancel(); });
      pane.style.backgroundColor = w.colour || "#888888";
      pane.style.zIndex = 2;
      old.style.zIndex = 1;
      img.style.opacity = 0;
      front = 1 - front;

      var src = w.image ? webp(w, 960) : "";
      var appear = function () {
        if (shown !== i) return;
        if (instant || reduceMotion || !img.animate) { img.style.opacity = 1; return; }
        img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "ease", fill: "forwards" })
          .onfinish = function () { img.style.opacity = 1; };
      };
      if (src) {
        if (img.getAttribute("src") !== src) img.src = src;
        var ready = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        ready.then(function () { setTimeout(appear, instant || reduceMotion ? 0 : 260); });
      }
      if (!instant && !reduceMotion && pane.animate) {
        pane.animate([{ transform: "translate3d(-101%,0,0)" }, { transform: "none" }], { duration: 640, easing: SLIDE });
        img.animate([{ transform: "translate3d(101%,0,0)" }, { transform: "none" }], { duration: 640, easing: SLIDE });
      }
    }

    function intend(i) {
      clearTimeout(timer);
      timer = setTimeout(function () { show(i); }, 70);   /* skim past rows without a storm of sweeps */
    }

    indexEl.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = e.target.closest(".ix-row");
      if (r) intend(+r.getAttribute("data-i"));
    });
    indexEl.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse") indexEl.classList.add("is-pointing");
    });
    indexEl.addEventListener("pointerleave", function () {
      clearTimeout(timer);
      indexEl.classList.remove("is-pointing");
    });
    indexEl.addEventListener("focusin", function (e) {
      var r = e.target.closest(".ix-row");
      if (r) show(+r.getAttribute("data-i"));
    });

    show(0, true);
  }

  /* ==============================================================
     CONTACT — the 18th band. The visitor picks their own colour.
     ============================================================== */

  var yours = document.querySelector("[data-yours]");
  if (yours) buildYours();

  function buildYours() {
    var chosen = yours.querySelector("[data-yours-chosen]");
    var cta = document.querySelector("[data-yours-cta]");
    var copyBtn = document.querySelector("[data-copy]");
    var h = 18, l = 0.46, picked = false, frame = 0, rect = null;

    function hslHex(h, s, l) {
      function f(n) {
        var k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
        var c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return ("0" + Math.round(c * 255).toString(16)).slice(-2);
      }
      return ("#" + f(0) + f(8) + f(4)).toUpperCase();
    }
    function lumOf(hex) {
      var n = parseInt(hex.slice(1), 16);
      return [n >> 16 & 255, n >> 8 & 255, n & 255].reduce(function (acc, v, i) {
        v /= 255; v = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        return acc + v * [0.2126, 0.7152, 0.0722][i];
      }, 0);
    }

    function paint() {
      frame = 0;
      var hex = hslHex(h, 0.7, l);
      var light = lumOf(hex) > 0.22;
      yours.style.backgroundColor = hex;
      yours.classList.add("is-picked");
      yours.classList.toggle("is-light", light);
      chosen.textContent = hex;
      yours.setAttribute("aria-valuenow", String(Math.round(h)));
      yours.setAttribute("aria-valuetext", "Your colour: " + hex);
      cta.innerHTML = "Start a project in " + hex + ' <span aria-hidden="true">&#8599;</span>';
      cta.setAttribute("href", "mailto:" + GALLERY.email + "?subject=" +
        encodeURIComponent("New project — our colour is " + hex) + "&body=" +
        encodeURIComponent("Hello Suleiman,\n\nOur brand colour is " + hex + ".\n\nA few lines about the brand:\n\n\nA website we wish was ours:\n"));
    }
    function request() { picked = true; if (!frame) frame = requestAnimationFrame(paint); }

    /* across the band: hue. down the band: light to deep */
    function fromPoint(x, y) {
      if (!rect) rect = yours.getBoundingClientRect();
      var fx = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      var fy = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
      h = fx * 359;
      l = 0.66 - fy * 0.38;
      request();
    }

    yours.addEventListener("pointerenter", function () { rect = yours.getBoundingClientRect(); });
    yours.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse" || e.buttons || e.pointerType === "pen") fromPoint(e.clientX, e.clientY);
    });
    yours.addEventListener("pointerdown", function (e) { rect = yours.getBoundingClientRect(); fromPoint(e.clientX, e.clientY); });
    window.addEventListener("scroll", function () { rect = null; }, { passive: true });
    window.addEventListener("resize", function () { rect = null; });

    yours.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowRight") h = (h + 8) % 360;
      else if (k === "ArrowLeft") h = (h + 352) % 360;
      else if (k === "ArrowUp") l = Math.min(0.66, l + 0.04);
      else if (k === "ArrowDown") l = Math.max(0.28, l - 0.04);
      else if (k === "Enter") { if (picked) window.location.href = cta.getAttribute("href"); return; }
      else return;
      e.preventDefault();
      request();
    });

    if (copyBtn) copyBtn.addEventListener("click", function () {
      var done = function () {
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(GALLERY.email).then(done, function () {});
    });
  }

})();
