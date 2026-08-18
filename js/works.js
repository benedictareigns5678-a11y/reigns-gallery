/* =============================================================
   THE ONLY FILE YOU EVER NEED TO EDIT.
   -------------------------------------------------------------
   1. GALLERY — your name, email, the year the gallery opened.
   2. WORKS   — one entry per website you built, newest first.

   To add a website: copy any block between { ... }, paste it at
   the TOP of the WORKS list, and change the details.
   To show a real screenshot: put the image in the /shots folder
   and set  image: "shots/your-file.jpg"
   ============================================================= */

const GALLERY = {
  name: "Suleiman Sallah",
  tagline: "Portfolio — a collection of built websites",
  owner: "Suleiman Sallah",
  email: "benedictareigns5678@gmail.com",
  established: "MMXXVI",
};

/* =============================================================
   YOUR WORKS — newest first. The first one is the piece
   "currently hanging" at the head of the promenade.
   Fields:
     title   — the name of the piece
     url     — the live website (opens in a new tab)
     year    — year completed
     medium  — one short line describing what it is
     image   — "shots/file.jpg" for a real screenshot, or null
     preview — optional "shots/file.mp4" scrolling capture
     ink     — two colors used to paint the plate if no image
   ============================================================= */

const WORKS = [
  {
    title: "Aurora",
    url: "https://aurora-hypercar.vercel.app/",
    year: 2026,
    medium: "All-electric hypercar marque",
    image: "shots/aurora-hypercar.jpg",
    ink: ["#e8e8e8", "#f26a1b"],
  },
  {
    title: "Étoile",
    url: "https://etoile-restaurant-tan.vercel.app/",
    year: 2026,
    medium: "Michelin-selection restaurant, tasting menu",
    image: "shots/etoile.jpg",
    ink: ["#efe9dc", "#8a6a4a"],
  },
  {
    title: "Nova Pulse",
    url: "https://nova-pulse-delta.vercel.app/",
    year: 2026,
    medium: "Running shoe product page",
    image: "shots/nova-pulse.jpg",
    ink: ["#eeece3", "#4d5a35"],
  },
  {
    title: "Nexora",
    url: "https://nexora-hazel-two.vercel.app/",
    year: 2026,
    medium: "AI work management for teams",
    image: "shots/nexora.jpg",
    ink: ["#ded6ff", "#7c5cff"],
  },
  {
    title: "Nexus Esports",
    url: "https://nexus-esports-kappa.vercel.app/",
    year: 2026,
    medium: "Esports tournaments, teams and rankings",
    image: "shots/nexus-esports.jpg",
    ink: ["#e6ddff", "#7c3aed"],
  },
  {
    title: "Pulp & Peel",
    url: "https://pulp-and-peel.vercel.app/",
    year: 2026,
    medium: "Bowl bar, sourced weekly",
    image: "shots/pulp-and-peel.jpg",
    ink: ["#ffd6ea", "#c8106b"],
  },
  {
    title: "Zapp",
    url: "https://zapp-landing.vercel.app/",
    year: 2026,
    medium: "Small-batch energy drink, sold loud",
    image: "shots/zapp.jpg",
    ink: ["#f7f3e4", "#b4e600"],
  },
  {
    title: "Aurelia Interior Studio",
    url: "https://aurelia-interior-studio.vercel.app/",
    year: 2026,
    medium: "Bespoke interiors, concept to completion",
    image: "shots/aurelia-interior.jpg",
    ink: ["#f2ece4", "#b9a894"],
  },
  {
    title: "Maison Aurèle",
    url: "https://maison-aurele-six.vercel.app/",
    year: 2026,
    medium: "Grasse perfume maison, composed by hand",
    image: "shots/maison-aurele.jpg",
    ink: ["#f0e0c8", "#b8863f"],
  },
  {
    title: "Lumière",
    url: "https://lumiere-delta-ashy.vercel.app/",
    year: 2026,
    medium: "A tightly edited shelf of modern beauty icons",
    image: "shots/lumiere.jpg",
    ink: ["#f2e9dc", "#e34a24"],
  },
  {
    title: "Varden",
    url: "https://varden-gules.vercel.app/",
    year: 2026,
    medium: "Oslo atelier of enduring architecture",
    image: "shots/varden.jpg",
    ink: ["#e7e2d8", "#8a7f6b"],
  },
  {
    title: "Meridian Market",
    url: "https://meridian-market-peach.vercel.app/",
    year: 2026,
    medium: "Merch drop storefront, Vol. 01",
    image: "shots/meridian-market.jpg",
    ink: ["#eaffb0", "#a3e635"],
  },
];
