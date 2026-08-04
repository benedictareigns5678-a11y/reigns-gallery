/* ==============================================================
   SULEIMAN SALLAH — gallery engine. You never need to edit this.
   Reads GALLERY and WORKS from js/works.js.
   Museum-at-night build: Lenis + GSAP promenade + the flashlight.
   ============================================================== */

(function () {
  "use strict";

  /* ---------- environment ---------- */

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var wide = window.innerWidth >= 900;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";
  var usePin = hasGsap && finePointer && !reduceMotion && wide;
  var animate = hasGsap && !reduceMotion;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- identity: pour GALLERY config into the page ---------- */

  function text(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  text("[data-owner]", GALLERY.owner);
  text("[data-established]", GALLERY.established);
  text("[data-year]", String(new Date().getFullYear()));
  text("[data-count]", String(WORKS.length));
  document.title = GALLERY.name + " — A Private Gallery of Built Websites";

  document.querySelectorAll("[data-mailto]").forEach(function (el) {
    el.setAttribute(
      "href",
      "mailto:" + GALLERY.email + "?subject=" +
        encodeURIComponent("Commission — via " + GALLERY.name)
    );
  });
  text("[data-email-text]", GALLERY.email);

  /* ---------- helpers ---------- */

  function pad3(n) { return n < 10 ? "00" + n : n < 100 ? "0" + n : String(n); }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  /* Acquisition numbers: oldest work = No. 001 */
  var acquisition = new Map();
  WORKS.slice().reverse().forEach(function (w, i) { acquisition.set(w, pad3(i + 1)); });

  /* ---------- smooth scroll ---------- */

  var lenis = null;
  if (hasLenis && hasGsap && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- the promenade ---------- */

  var section = document.querySelector("[data-promenade]");
  var viewport = document.querySelector("[data-viewport]");
  var track = document.querySelector("[data-track]");
  var emptyNote = document.querySelector("[data-empty]");
  var progressNow = document.querySelector("[data-progress-now]");
  var progressTotal = document.querySelector("[data-progress-total]");
  var progressFill = document.querySelector("[data-progress-fill]");
  var pinTween = null;

  function mediaFor(work) {
    if (work.preview) {
      return (
        '<video muted loop playsinline preload="none"' +
        (work.image ? ' poster="' + work.image + '"' : "") +
        ' src="' + work.preview + '"></video>'
      );
    }
    if (work.image) {
      return '<img src="' + work.image + '" alt="' + work.title + " — " + work.medium + '" decoding="async" />';
    }
    return (
      '<div class="piece-poster" style="--ink-a:' + (work.ink ? work.ink[0] : "#1a241f") +
      ";--ink-b:" + (work.ink ? work.ink[1] : "#2a3a30") + '"><span>' + work.title + "</span></div>"
    );
  }

  function pieceMarkup(work, featured) {
    var no = acquisition.get(work);
    return (
      '<figure class="piece">' +
      '<a class="piece-link" data-cursor="View" href="' + work.url + '" target="_blank" rel="noopener">' +
      '<div class="piece-frame"><div class="piece-media">' + mediaFor(work) + "</div></div>" +
      '<figcaption class="plaque">' +
      '<span class="plaque-row"><span class="plaque-no">No. ' + no + "</span>" +
      '<span class="plaque-visit">Visit the work <i>&#8599;</i></span></span>' +
      '<span class="plaque-title">' + work.title +
      (featured ? '<span class="plaque-flag">Currently hanging</span>' : "") +
      "</span>" +
      '<span class="plaque-meta">Est. ' + work.year + "<b>&#183;</b>" +
      work.medium + "<b>&#183;</b>Status: Live</span>" +
      "</figcaption></a></figure>"
    );
  }

  function setProgress(p) {
    if (WORKS.length < 2) return;
    var now = Math.min(WORKS.length, Math.max(1, Math.round(p * (WORKS.length - 1)) + 1));
    progressNow.textContent = pad2(now);
    if (progressFill) progressFill.style.transform = "scaleX(" + Math.max(0, Math.min(1, p)) + ")";
  }

  var swipeBound = false;

  function bindSwipe() {
    if (swipeBound) return;
    swipeBound = true;
    viewport.addEventListener("scroll", function () {
      if (!section.classList.contains("is-swipe")) return;
      var max = viewport.scrollWidth - viewport.clientWidth;
      if (max > 0) setProgress(viewport.scrollLeft / max);
    }, { passive: true });
  }

  /* Measure only when the layout is final. Called again on load and on
     resize, because images and webfonts settle after the first pass and
     a too-early measurement would strand the wall in swipe mode. */
  function buildScroller() {
    if (pinTween) {
      pinTween.scrollTrigger && pinTween.scrollTrigger.kill();
      pinTween.kill();
      pinTween = null;
      gsap.set(track, { clearProps: "x" });
    }

    var canPin = hasGsap && finePointer && !reduceMotion && window.innerWidth >= 900;
    var distance = track.scrollWidth - viewport.clientWidth;

    if (canPin && distance > 60) {
      section.classList.remove("is-swipe");
      viewport.scrollLeft = 0;
      pinTween = gsap.to(track, {
        x: function () { return -(track.scrollWidth - viewport.clientWidth); },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: function () { return "+=" + Math.max(track.scrollWidth - viewport.clientWidth, 400); },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) { setProgress(self.progress); }
        }
      });
      ScrollTrigger.refresh();
    } else {
      section.classList.add("is-swipe");
      bindSwipe();
    }
  }

  function renderPromenade() {
    track.innerHTML = WORKS.map(function (w, i) {
      return pieceMarkup(w, i === 0);
    }).join("");

    emptyNote.hidden = WORKS.length !== 0;
    viewport.style.display = WORKS.length ? "" : "none";
    progressTotal.textContent = pad2(WORKS.length);
    setProgress(0);

    /* wake the frames: canvases settle from 1.12 into place */
    if (animate) {
      gsap.from(track.querySelectorAll(".piece-media img, .piece-media video, .piece-poster"), {
        scale: 1.12,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.06,
        clearProps: "transform",
        scrollTrigger: { trigger: section, start: "top 75%", once: true }
      });
    }

    /* videos wake on approach */
    track.querySelectorAll(".piece-link").forEach(function (link) {
      var video = link.querySelector("video");
      if (!video) return;
      link.addEventListener("mouseenter", function () { video.play().catch(function () {}); });
      link.addEventListener("mouseleave", function () { video.pause(); });
    });

    buildScroller();
  }

  /* ---------- the flashlight and the ring ---------- */

  var mx = innerWidth / 2, my = innerHeight / 2;
  var torch = document.querySelector("[data-torch]");
  var ring = document.querySelector("[data-ring]");
  var ringLabel = document.querySelector("[data-ring-label]");

  if (finePointer && !reduceMotion) {
    document.body.classList.add("has-torch");
    var tx = mx, ty = my, rx = mx, ry = my;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    document.addEventListener("mouseover", function (e) {
      var cursorEl = e.target.closest && e.target.closest("[data-cursor]");
      if (cursorEl) {
        ringLabel.textContent = cursorEl.getAttribute("data-cursor");
        ring.classList.add("is-on");
      } else {
        ring.classList.remove("is-on");
      }
      torch.classList.toggle("is-tight", Boolean(e.target.closest && e.target.closest(".piece-link")));
    });

    (function glow() {
      tx += (mx - tx) * 0.11; ty += (my - ty) * 0.11;
      rx += (mx - rx) * 0.26; ry += (my - ry) * 0.26;
      torch.style.transform = "translate3d(" + (tx - 180) + "px," + (ty - 180) + "px,0)" +
        (torch.classList.contains("is-tight") ? " scale(0.62)" : "");
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(glow);
    })();
  }

  /* ---------- magnetic pulls ---------- */

  if (animate && finePointer) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var qx = gsap.quickTo(el, "x", { duration: 0.4, ease: "expo.out" });
      var qy = gsap.quickTo(el, "y", { duration: 0.4, ease: "expo.out" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.32);
        qy((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      el.addEventListener("mouseleave", function () { qx(0); qy(0); });
    });
  }

  /* ---------- lights up: loader + entrance ---------- */

  var loader = document.querySelector("[data-loader]");

  function countUp() {
    document.querySelectorAll("[data-countup]").forEach(function (el) {
      var final = parseInt(el.textContent, 10) || 0;
      if (!animate) { el.textContent = String(final); return; }
      var obj = { v: 0 };
      gsap.to(obj, {
        v: final,
        duration: 1.2,
        ease: "expo.out",
        onUpdate: function () { el.textContent = String(Math.round(obj.v)); },
        onComplete: function () { el.textContent = String(final); }
      });
      /* whatever happens, the wall text is never wrong for long */
      setTimeout(function () { el.textContent = String(final); }, 2600);
    });
  }

  var introStarted = false;

  function startIntro() {
    if (introStarted) return;
    introStarted = true;

    gsap.set(".hero [data-line]", { yPercent: 110 });
    gsap.set("[data-intro]", { autoAlpha: 0, y: 18 });
    gsap.set("[data-masthead]", { autoAlpha: 0 });

    var tl = gsap.timeline();
    tl.to("[data-loader-word]", {
      opacity: 1,
      letterSpacing: "0.18em",
      textIndent: "0.18em",
      duration: 0.75,
      ease: "expo.out"
    })
      .to("[data-loader-rule]", { scaleX: 1, duration: 0.45, ease: "expo.out" }, "-=0.3")
      .to(loader, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "+=0.05")
      .set(loader, { display: "none" })
      .to(".hero [data-line]", { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, "-=0.35")
      .to("[data-intro]", { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }, "-=0.55")
      .to("[data-masthead]", { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, "-=0.6")
      .add(countUp, "-=0.9");
  }

  if (animate && loader) {
    /* opened in a background tab: hold the doors, play when the visitor walks in */
    if (document.hidden) {
      loader.style.opacity = "0";
      document.addEventListener("visibilitychange", function onVisible() {
        if (!document.hidden) {
          loader.style.opacity = "";
          document.removeEventListener("visibilitychange", onVisible);
          startIntro();
        }
      });
      /* fail-safe: never trap a visitor behind the loader */
      setTimeout(function () {
        if (!introStarted && document.hidden) {
          introStarted = true;
          loader.remove();
          countUp();
        }
      }, 5000);
    } else {
      startIntro();
    }
  } else {
    if (loader) loader.remove();
    countUp();
  }

  /* ---------- scroll reveals + the lit study ---------- */

  if (animate) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.from(el, {
        autoAlpha: 0,
        y: 32,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      });
    });

    gsap.from(".commission [data-line]", {
      yPercent: 110,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: ".commission", start: "top 70%", once: true }
    });

    /* stepping into the study, and back out */
    ScrollTrigger.create({
      trigger: ".study",
      start: "top 62%",
      end: "bottom 45%",
      onEnter: function () { document.body.classList.add("in-study"); },
      onEnterBack: function () { document.body.classList.add("in-study"); },
      onLeave: function () { document.body.classList.remove("in-study"); },
      onLeaveBack: function () { document.body.classList.remove("in-study"); }
    });
  }

  /* ---------- hang the collection ---------- */

  renderPromenade();

  window.addEventListener("load", function () {
    buildScroller();
    if (hasGsap) ScrollTrigger.refresh();

    /* deep links: the pinned promenade shifts anchor positions after
       the browser's native hash jump, so re-aim once layout is final */
    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target) {
        requestAnimationFrame(function () {
          if (lenis) lenis.scrollTo(target, { immediate: true });
          else target.scrollIntoView();
        });
      }
    }

    /* rotating a phone or resizing a window re-decides pin vs swipe */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildScroller, 220);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildScroller);
    }
  });
})();
