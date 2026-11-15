# Suleiman Sallah — brand and web design

A studio portfolio: the websites (a curved drag carousel) and the brand
identities (case-study pages). Every website opens the real site in a new tab.

Live at <https://reigns-gallery.vercel.app>

The page: a portrait hero lit by each work's colour, an info sheet, a
statement, the GALLERY carousel of every site, the BRANDS grid, and a
contact link. See `DESIGN.md`.

---

## The only file you edit: `js/works.js`

### Add one of your websites
Copy this block and paste it at the **top** of the `WORKS` list. The work at
the top is the first card in the carousel.

```js
{
  title: "My Client's Site",
  url: "https://the-live-website.com",
  year: 2026,
  medium: "One short line about it",
  image: "shots/my-site.jpg",          // 1600x1000 desktop screenshot
  mobile: "shots/m/my-site.webp",      // 390x844 phone screenshot (@2x)
  colour: "#c2260e",                   // the brand's own colour
  kind: "Food and drink",              // Fashion and beauty / Food and drink /
                                       // Product and tech / Interiors and architecture
  ink: ["#f4e9d8", "#c2260e"],
},
```

To give a work a full colour room, add `featured: true`, a `story` (two or
three sentences) and `made` (what you made).

### Screenshots
- `shots/name.jpg`: the 1600x1000 desktop screenshot.
- `shots/w/name-480.webp`, `name-960.webp`, `name-1600.webp`: lighter copies
  of it (the page uses these).
- `shots/m/name.webp`: the phone screenshot.

The carousel and the hero light pick up every work by themselves, and the
counts in the info sheet update by themselves.

### Add a brand identity
Make `brand/<name>/` (copy `brand/gelee/`), then add a card to the
`bgrid` in `index.html`: a 5:4 thumbnail, the `--back` frame colour, and
`data-colour` / `data-name` for the light.

---

## Publishing a change

The site is pure HTML/CSS/JS, no build step. From this folder:

```bash
git add -A && git commit -m "Add new work" && git push && vercel deploy --prod --yes
```

The public link never changes; it updates in place. `.vercelignore` keeps
local tooling and secrets out of the upload.
