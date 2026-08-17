/* ==============================================================
   Suleiman Sallah — portfolio engine. You never need to edit this.
   Reads GALLERY and WORKS from js/works.js.
   ============================================================== */

(function () {
  "use strict";

  /* ---------- identity ---------- */

  function text(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  text("[data-owner]", GALLERY.owner);
  text("[data-year]", String(new Date().getFullYear()));
  text("[data-count]", String(WORKS.length));
  document.title = GALLERY.owner + " — Website Portfolio";

  document.querySelectorAll("[data-mailto]").forEach(function (el) {
    el.setAttribute(
      "href",
      "mailto:" + GALLERY.email + "?subject=" +
        encodeURIComponent("New project — via " + GALLERY.owner)
    );
  });
  text("[data-email-text]", GALLERY.email);

  /* ---------- the featured piece: newest work ---------- */

  var featured = WORKS[0];

  if (featured) {
    text("[data-featured-title]", featured.title);
    text("[data-featured-date]", String(featured.year));

    var fLink = document.querySelector("[data-featured-link]");
    var fImg = document.querySelector("[data-featured-img]");

    if (fLink) fLink.setAttribute("href", featured.url);
    if (fImg && featured.image) {
      fImg.setAttribute("src", featured.image);
      fImg.setAttribute("alt", featured.title + " — " + featured.medium);
    }
  }

  /* ---------- the grid ---------- */

  var grid = document.querySelector("[data-grid]");
  var emptyNote = document.querySelector("[data-empty]");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function shotFor(work) {
    if (work.image) {
      return '<img src="' + esc(work.image) + '" alt="' + esc(work.title + " — " + work.medium) +
        '" loading="lazy" decoding="async" />';
    }
    /* no capture yet: a flat plate in the work's own colours */
    return '<span class="card-plate" style="background:' +
      esc(work.ink ? work.ink[0] : "#e4e4e4") + '"></span>';
  }

  function cardMarkup(work) {
    return (
      '<article class="card">' +
      '<a class="card-shot" href="' + esc(work.url) + '" target="_blank" rel="noopener" ' +
      'aria-label="' + esc(work.title) + ', opens in a new tab">' +
      shotFor(work) +
      '<span class="card-overlay">' +
      '<span class="card-overlay-name">' + esc(work.title) + "</span>" +
      '<span class="card-overlay-visit">Visit site &#8599;</span>' +
      "</span></a>" +
      '<div class="card-meta">' +
      '<span class="card-tag">Website</span>' +
      '<h3 class="card-title">' + esc(work.title) + "</h3>" +
      '<p class="card-desc">' + esc(work.medium) +
      ' <span class="card-year">&middot; ' + esc(work.year) + "</span></p>" +
      "</div></article>"
    );
  }

  function render() {
    grid.innerHTML = WORKS.map(cardMarkup).join("");
    if (emptyNote) emptyNote.hidden = WORKS.length !== 0;
  }

  render();
})();
