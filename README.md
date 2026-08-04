# Suleiman Sallah — A Private Gallery of Built Websites

A gallery site for showing clients the websites you've built. Visitors walk
the promenade past every piece and click any one to open the live website in
a new tab.

Live at <https://reigns-gallery.vercel.app>

There are no categories. Everything hangs in one collection, newest first.

---

## The only file you edit: `js/works.js`

### Change your name or email
At the top of `js/works.js`, edit the `GALLERY` block.

### Add one of your websites
Copy this block and paste it at the **top** of the `WORKS` list. The piece at
the top is the one marked "Currently hanging".

```js
{
  title: "My Client's Site",
  url: "https://the-live-website.com",
  year: 2026,
  medium: "One short line about it",
  image: "shots/my-screenshot.jpg",   // or null
  ink: ["#e7e2d8", "#8a7f6b"],        // plate colors, used only while image is null
},
```

### Add a screenshot
1. Take a wide screenshot of the live site, roughly 1600×1000 px.
2. Save it into the `shots/` folder, e.g. `shots/aurelia.jpg`.
3. Set `image: "shots/aurelia.jpg"` on that work.

Until a work has a screenshot, the gallery paints an elegant plate for it, so
nothing ever looks broken. Acquisition numbers, the progress counter and the
"works on display" figure all update by themselves.

### Optional: a moving preview
Record a short, muted scrolling capture of the site as an `.mp4` (keep it
under about 3 MB), put it in `shots/`, and add `preview: "shots/name.mp4"` to
that work. It plays when a visitor steps close to the piece.

---

## Publishing a change

The site is pure HTML/CSS/JS, no build step. From this folder:

```bash
git add -A && git commit -m "Add new work" && git push && vercel deploy --prod --yes
```

The public link never changes; it updates in place.

---

## Folder map

```
reigns-gallery/
├── index.html      the page (don't need to touch)
├── css/style.css   the design (don't need to touch)
├── js/app.js       the engine (don't need to touch)
├── js/works.js     ← YOUR file: name, email, works
└── shots/          ← your screenshots go here
```

`PRODUCT.md` and `DESIGN.md` record the design direction ("a private museum,
after closing time") so any future work stays consistent with it.
