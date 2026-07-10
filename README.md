# REIGNS — Your Private Gallery

A luxury gallery website for showing clients the websites you've built.
Clients pick a room (category), browse the works, and click any piece to
open the live website in a new tab.

**The 10 works currently inside are EXAMPLES** so you can see the gallery
alive. Replace them with your real websites.

---

## The only file you edit: `js/works.js`

### Change your name / gallery name / email
At the top of `js/works.js`, edit the `GALLERY` block.

### Add one of your websites
Copy this block and paste it at the **top** of the `WORKS` list:

```js
{
  title: "My Client's Site",
  url: "https://the-live-website.com",
  room: "ecommerce",            // ecommerce, saas, startup, landing, portfolio, agency
  year: 2026,
  medium: "One short line about it",
  image: null,                  // or "shots/my-screenshot.jpg"
  ink: ["#3A2547", "#C9A96A"],  // poster colors (only used while image is null)
},
```

### Add a real screenshot (recommended)
1. Open the live website, take a wide screenshot (roughly 1600×1000 px).
2. Save it into the `shots/` folder, e.g. `shots/aurelia.jpg`.
3. On that work's entry, set `image: "shots/aurelia.jpg"`.

Until a work has a screenshot, the gallery paints an elegant poster for it
automatically — nothing ever looks broken.

### Remove the example works
Delete their blocks from the `WORKS` list. The room counts, numbering and
"works on display" counter all update by themselves. Rooms with zero works
hide themselves automatically.

---

## Putting it online (free, ~2 minutes)

The site is pure HTML/CSS/JS — no build step, nothing to install.

**Easiest:** go to <https://app.netlify.com/drop> and drag the whole
`reigns-gallery` folder onto the page. You get a live link immediately;
that link is what you send clients. (You can set a nicer name in Site
settings, or connect your own domain later.)

Vercel, GitHub Pages or any static host works the same way.

---

## Folder map

```
reigns-gallery/
├── index.html      the page (don't need to touch)
├── css/style.css   the design (don't need to touch)
├── js/app.js       the engine (don't need to touch)
├── js/works.js     ← YOUR file: name, email, rooms, works
└── shots/          ← your screenshots go here
```
