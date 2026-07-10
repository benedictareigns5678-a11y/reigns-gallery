/* ==============================================================
   REIGNS — gallery engine. You never need to edit this file.
   Reads GALLERY, ROOMS and WORKS from js/works.js.
   ============================================================== */

(function () {
  "use strict";

  var grid = document.querySelector("[data-grid]");
  var roomsBar = document.querySelector("[data-rooms]");
  var emptyNote = document.querySelector("[data-empty]");
  var activeRoom = "all";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- identity: pour GALLERY config into the page ---------- */

  function text(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  text("[data-gallery-name]", GALLERY.name);
  text("[data-owner]", GALLERY.owner);
  text("[data-tagline]", GALLERY.tagline);
  text("[data-established]", GALLERY.established);
  text("[data-year]", String(new Date().getFullYear()));
  text("[data-count]", String(WORKS.length));
  document.title = GALLERY.name + " — " + GALLERY.tagline;

  document.querySelectorAll("[data-mailto]").forEach(function (el) {
    el.setAttribute(
      "href",
      "mailto:" + GALLERY.email + "?subject=" +
        encodeURIComponent("Commission — via " + GALLERY.name)
    );
  });
  text("[data-email-text]", GALLERY.email);

  var occupiedRooms = ROOMS.filter(function (r) {
    return r.id !== "all" && WORKS.some(function (w) { return w.room === r.id; });
  });
  text("[data-rooms-count]", String(occupiedRooms.length));

  /* ---------- helpers ---------- */

  function roomById(id) {
    for (var i = 0; i < ROOMS.length; i++) {
      if (ROOMS[i].id === id) return ROOMS[i];
    }
    return null;
  }

  function tally(roomId) {
    if (roomId === "all") return WORKS.length;
    return WORKS.filter(function (w) { return w.room === roomId; }).length;
  }

  function pad(n) {
    return n < 10 ? "00" + n : n < 100 ? "0" + n : String(n);
  }

  /* Acquisition numbers: oldest work = No. 001 */
  var acquisition = new Map();
  WORKS.slice()
    .reverse()
    .forEach(function (w, i) { acquisition.set(w, pad(i + 1)); });

  /* ---------- rooms bar ---------- */

  ROOMS.forEach(function (room) {
    var count = tally(room.id);
    if (room.id !== "all" && count === 0) return; // hide empty rooms

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "room-btn";
    btn.setAttribute("aria-pressed", room.id === activeRoom ? "true" : "false");
    btn.dataset.room = room.id;
    if (room.hue) btn.style.setProperty("--hue", room.hue);
    btn.innerHTML =
      (room.id !== "all" ? '<span class="swatch" aria-hidden="true"></span>' : "") +
      "<span>" + room.label + "</span>" +
      '<span class="tally">' + count + "</span>";
    btn.addEventListener("click", function () { setRoom(room.id); });
    roomsBar.appendChild(btn);
  });

  function setRoom(id) {
    if (id === activeRoom) return;
    activeRoom = id;
    roomsBar.querySelectorAll(".room-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.room === id ? "true" : "false");
    });
    render();
  }

  document.querySelectorAll("[data-back-to-all]").forEach(function (b) {
    b.addEventListener("click", function () { setRoom("all"); });
  });

  /* ---------- rendering the collection ---------- */

  var observer = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
  }

  function workCard(work, featured) {
    var room = roomById(work.room);
    var no = acquisition.get(work);

    var article = document.createElement("article");
    article.className = "work" + (featured ? " work--featured" : "");
    if (room && room.hue) article.style.setProperty("--hue", room.hue);
    if (!observer) article.classList.add("is-visible");

    var canvas;
    if (work.image) {
      canvas =
        '<div class="work-canvas"><img src="' + work.image + '" alt="Screenshot of ' +
        work.title + '" loading="lazy" /></div>';
    } else {
      canvas =
        '<div class="work-canvas"><div class="poster" data-variant="' +
        (parseInt(no, 10) % 3) + '" style="--ink-a:' + work.ink[0] +
        ";--ink-b:" + work.ink[1] + '">' +
        '<span class="poster-medium">' + work.medium + "</span>" +
        '<span class="poster-no">' + no + "</span>" +
        '<span class="poster-title">' + work.title + "</span>" +
        "</div></div>";
    }

    article.innerHTML =
      '<a class="work-link" href="' + work.url + '" target="_blank" rel="noopener">' +
      '<div class="work-frame">' + canvas + "</div>" +
      '<div class="placard">' +
      '<span class="placard-no">No. ' + no + "</span>" +
      '<span class="placard-main">' +
      '<span class="placard-title">' + work.title +
      (featured ? '<span class="placard-flag">Currently hanging</span>' : "") +
      "</span>" +
      '<span class="placard-meta">' +
      (room ? "Room " + room.numeral + " — " + room.label : work.room) +
      '<span class="dot">●</span>' + work.year +
      "</span></span>" +
      '<span class="placard-visit">Visit the work <span class="arrow">&#8599;</span></span>' +
      "</div></a>";

    return article;
  }

  function render() {
    grid.innerHTML = "";

    var shown = activeRoom === "all"
      ? WORKS
      : WORKS.filter(function (w) { return w.room === activeRoom; });

    emptyNote.hidden = shown.length !== 0;

    shown.forEach(function (work, i) {
      var featured = activeRoom === "all" && i === 0;
      var card = workCard(work, featured);
      grid.appendChild(card);
      if (observer) {
        /* stagger the entrance slightly for cards already in view */
        card.style.transitionDelay = Math.min(i * 60, 300) + "ms";
        observer.observe(card);
      }
    });
  }

  render();
})();
