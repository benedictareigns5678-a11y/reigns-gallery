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
     image   — "shots/file.jpg", the 1600x1000 desktop screenshot.
               Lighter copies live in shots/w/ (file-960.webp, file-1600.webp)
     mobile  — "shots/m/file.webp", the phone screenshot (390x844 @2x)
     colour  — the brand's own colour. It paints the work's band on the
               colour wall, and the wall is sorted by it.
     kind    — Fashion and beauty / Food and drink / Product and tech /
               Interiors and architecture
     featured— true for the pieces that get a full spread, with:
     story   — two or three sentences about the site
     made    — what I made, as a short list
     ink     — two colours used to paint the plate if no image
   ============================================================= */

const WORKS = [
  {
    title: "HUMWELL",
    url: "https://humwell.vercel.app/",
    year: 2026,
    medium: "Independent record label, eight sleeves on a snaking spiral",
    image: "shots/humwell.jpg",
    mobile: "shots/m/humwell.webp",
    colour: "#0e3a3d",
    kind: "Music and culture",
    featured: true,
    story: "A concept record label from Lisbon. Its eight sleeves snake along a 3D spiral as you scroll; open one and it flies flat into its own page, and the whole site takes on that record's colours. Turn the sound on and the spiral becomes a turntable you can scratch.",
    made: "The label and its eight releases, art direction for every sleeve, the WebGL spiral, the colour rooms, the turntable sound, the build",
    ink: ["#0e3a3d", "#6fd3c4"],
  },
  {
    title: "FERAL",
    url: "https://feral-phi.vercel.app/",
    year: 2026,
    medium: "Wild botanical soda, one 3D can you scroll, spin and shop",
    image: "shots/feral.jpg",
    mobile: "shots/m/feral.webp",
    colour: "#c2260e",
    kind: "Food and drink",
    featured: true,
    story: "A concept soda brand built around one 3D can. It travels down the page as you scroll, turns to show what's inside, then lands in the shop, where you can spin it and fill a pack.",
    made: "The brand, the can modelled in Blender, the scroll-driven 3D site, the shop",
    ink: ["#c2260e", "#f4e9d8"],
  },
  {
    title: "ASHEN",
    url: "https://ashen-roan.vercel.app/",
    year: 2026,
    medium: "SS27 lookbook, six looks on a turning ring",
    image: "shots/ashen.jpg",
    mobile: "shots/m/ashen.webp",
    colour: "#6b1e1b",
    kind: "Fashion and beauty",
    featured: true,
    story: "A concept SS27 lookbook. Six looks stand on a turning ring; pick one and the camera pushes into the garment, with every piece in the look ready to add to the bag.",
    made: "Art direction, the six AI-cast looks, the ring, the shop-the-look flow, the build",
    ink: ["#f1f0ec", "#6b1e1b"],
  },
  {
    title: "Chroma",
    url: "https://chroma-ss26.vercel.app/",
    year: 2026,
    medium: "SS26 campaign, four colourways, one silhouette",
    image: "shots/chroma.jpg",
    mobile: "shots/m/chroma.webp",
    colour: "#2258b0",
    kind: "Fashion and beauty",
    featured: true,
    story: "A concept SS26 campaign: one silhouette in four colourways. Each colour gets its own ground, then the fit grid, the cloth and a fitting room take you to the right size.",
    made: "Campaign art direction, the four-ground layout, the product story, the build",
    ink: ["#eef1f6", "#2258b0"],
  },
  {
    title: "Scooply",
    url: "https://scooply-nine.vercel.app/",
    year: 2026,
    medium: "Small-batch ice cream, pints shipped frozen",
    image: "shots/scooply.jpg",
    mobile: "shots/m/scooply.webp",
    colour: "#c85a22",
    kind: "Food and drink",
    ink: ["#fbf1e4", "#c85a22"],
  },
  {
    title: "Maison Sévrin",
    url: "https://maison-sevrin.vercel.app/",
    year: 2026,
    medium: "Paris maison, the Rupture FW26 collection",
    image: "shots/maison-sevrin.jpg",
    mobile: "shots/m/maison-sevrin.webp",
    colour: "#1b4bc4",
    kind: "Fashion and beauty",
    featured: true,
    story: "A concept Paris maison and its FW26 collection, Rupture, told like an atelier docket: the pieces, how they were made, what they cost to make, and an invitation to be measured.",
    made: "The house identity, editorial layout, motion, the build",
    ink: ["#f2f3f5", "#1b4bc4"],
  },
  {
    title: "Aurora",
    url: "https://aurora-hypercar.vercel.app/",
    year: 2026,
    medium: "All-electric hypercar marque",
    image: "shots/aurora-hypercar.jpg",
    mobile: "shots/m/aurora-hypercar.webp",
    colour: "#f26a1b",
    kind: "Product and tech",
    featured: true,
    story: "A concept electric hypercar marque. Forty cars, each one signed for; the site sells the car on air, range and the cabin, then closes on the allocation.",
    made: "Brand, art direction, the film-led hero, the build",
    ink: ["#e8e8e8", "#f26a1b"],
  },
  {
    title: "Étoile",
    url: "https://etoile-restaurant-tan.vercel.app/",
    year: 2026,
    medium: "Michelin-selection restaurant, tasting menu",
    image: "shots/etoile.jpg",
    mobile: "shots/m/etoile.webp",
    colour: "#8a6a4a",
    kind: "Food and drink",
    ink: ["#efe9dc", "#8a6a4a"],
  },
  {
    title: "Nova Pulse",
    url: "https://nova-pulse-delta.vercel.app/",
    year: 2026,
    medium: "Running shoe product page",
    image: "shots/nova-pulse.jpg",
    mobile: "shots/m/nova-pulse.webp",
    colour: "#4d5a35",
    kind: "Product and tech",
    ink: ["#eeece3", "#4d5a35"],
  },
  {
    title: "Nexora",
    url: "https://nexora-hazel-two.vercel.app/",
    year: 2026,
    medium: "AI work management for teams",
    image: "shots/nexora.jpg",
    mobile: "shots/m/nexora.webp",
    colour: "#7c5cff",
    kind: "Product and tech",
    ink: ["#ded6ff", "#7c5cff"],
  },
  {
    title: "Nexus Esports",
    url: "https://nexus-esports-kappa.vercel.app/",
    year: 2026,
    medium: "Esports tournaments, teams and rankings",
    image: "shots/nexus-esports.jpg",
    mobile: "shots/m/nexus-esports.webp",
    colour: "#7c3aed",
    kind: "Product and tech",
    ink: ["#e6ddff", "#7c3aed"],
  },
  {
    title: "Pulp & Peel",
    url: "https://pulp-and-peel.vercel.app/",
    year: 2026,
    medium: "Bowl bar, sourced weekly",
    image: "shots/pulp-and-peel.jpg",
    mobile: "shots/m/pulp-and-peel.webp",
    colour: "#c8106b",
    kind: "Food and drink",
    ink: ["#ffd6ea", "#c8106b"],
  },
  {
    title: "Zapp",
    url: "https://zapp-landing.vercel.app/",
    year: 2026,
    medium: "Small-batch energy drink, sold loud",
    image: "shots/zapp.jpg",
    mobile: "shots/m/zapp.webp",
    colour: "#b4e600",
    kind: "Food and drink",
    ink: ["#f7f3e4", "#b4e600"],
  },
  {
    title: "Aurelia Interior Studio",
    url: "https://aurelia-interior-studio.vercel.app/",
    year: 2026,
    medium: "Bespoke interiors, concept to completion",
    image: "shots/aurelia-interior.jpg",
    mobile: "shots/m/aurelia-interior.webp",
    colour: "#b9a894",
    kind: "Interiors and architecture",
    ink: ["#f2ece4", "#b9a894"],
  },
  {
    title: "Maison Aurèle",
    url: "https://maison-aurele-six.vercel.app/",
    year: 2026,
    medium: "Grasse perfume maison, composed by hand",
    image: "shots/maison-aurele.jpg",
    mobile: "shots/m/maison-aurele.webp",
    colour: "#b8863f",
    kind: "Fashion and beauty",
    ink: ["#f0e0c8", "#b8863f"],
  },
  {
    title: "Lumière",
    url: "https://lumiere-delta-ashy.vercel.app/",
    year: 2026,
    medium: "A tightly edited shelf of modern beauty icons",
    image: "shots/lumiere.jpg",
    mobile: "shots/m/lumiere.webp",
    colour: "#e34a24",
    kind: "Fashion and beauty",
    ink: ["#f2e9dc", "#e34a24"],
  },
  {
    title: "Varden",
    url: "https://varden-gules.vercel.app/",
    year: 2026,
    medium: "Oslo atelier of enduring architecture",
    image: "shots/varden.jpg",
    mobile: "shots/m/varden.webp",
    colour: "#8a7f6b",
    kind: "Interiors and architecture",
    ink: ["#e7e2d8", "#8a7f6b"],
  },
  {
    title: "Meridian Market",
    url: "https://meridian-market-peach.vercel.app/",
    year: 2026,
    medium: "Merch drop storefront, Vol. 01",
    image: "shots/meridian-market.jpg",
    mobile: "shots/m/meridian-market.webp",
    colour: "#a3e635",
    kind: "Product and tech",
    ink: ["#eaffb0", "#a3e635"],
  },
];
