/* =============================================================
   THE ONLY FILE YOU EVER NEED TO EDIT.
   -------------------------------------------------------------
   1. GALLERY  — your name, gallery name, email.
   2. ROOMS    — the categories clients can browse.
   3. WORKS    — one entry per website you built.
      To add a website: copy any block between { ... }, paste it
      at the TOP of the WORKS list, and change the details.
      To show a real screenshot: put the image in the /shots
      folder and set  image: "shots/your-file.jpg"
   ============================================================= */

const GALLERY = {
  name: "Suleiman Sallah",
  tagline: "Portfolio — a collection of built websites",
  owner: "Suleiman Sallah",
  email: "benedictareigns5678@gmail.com",
  established: "MMXXVI",
};

/* The rooms of the gallery. id must match the `room` on each work.
   `hue` is the room's signature color — it tints that room's dot,
   underline, and hover accents. */
const ROOMS = [
  { id: "all",          numeral: "",     label: "All Works",     hue: "#2b3fe6" },
  { id: "ecommerce",    numeral: "I",    label: "E-Commerce",    hue: "#e8501f" },
  { id: "saas",         numeral: "II",   label: "SaaS",          hue: "#2b3fe6" },
  { id: "startup",      numeral: "III",  label: "Startup",       hue: "#0e9f6e" },
  { id: "landing",      numeral: "IV",   label: "Landing Pages", hue: "#de9b00" },
  { id: "portfolio",    numeral: "V",    label: "Portfolio",     hue: "#d63a6b" },
  { id: "agency",       numeral: "VI",   label: "Agency",        hue: "#0e8c9c" },
  { id: "architecture", numeral: "VII",  label: "Architecture",  hue: "#6d5b8a" },
];

/* =============================================================
   YOUR WORKS — newest first. These 10 are EXAMPLES so you can
   see the gallery alive. Replace them with your real websites.
   Fields:
     title  — the name of the piece
     url    — the live website (opens in a new tab)
     room   — one of the room ids above
     year   — year completed
     medium — one short line describing what it is
     image  — "shots/file.jpg" for a real screenshot, or null
     ink    — two colors used to paint the placeholder poster
   ============================================================= */

const WORKS = [
  {
    title: "Lumière",
    url: "https://lumiere-delta-ashy.vercel.app/",
    room: "ecommerce",
    year: 2026,
    medium: "A tightly edited shelf of modern beauty icons",
    image: "shots/lumiere.jpg",
    ink: ["#f2e9dc", "#e34a24"],
  },
  {
    title: "Varden",
    url: "https://varden-gules.vercel.app/",
    room: "ecommerce",
    year: 2026,
    medium: "Oslo atelier of enduring architecture",
    image: "shots/varden.jpg",
    ink: ["#e7e2d8", "#8a7f6b"],
  },
  {
    title: "Meridian Market",
    url: "https://meridian-market-peach.vercel.app/",
    room: "ecommerce",
    year: 2026,
    medium: "Merch drop storefront — Vol. 01",
    image: "shots/meridian-market.jpg",
    ink: ["#eaffb0", "#a3e635"],
  },
];
