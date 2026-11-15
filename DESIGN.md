# DESIGN.md: the studio portfolio (since 2026-11-15)

The previous "Colour first" gallery is kept at git tag `v1-colour-first`.

## The idea
One person, lit by their work. The page is near-black with cream type. One
brand colour (`--c`) at a time lights the portrait card, the glow, the second
name line and the rooms. Whoever is on screen owns the light: the hero, the
work carousel (the card in front) or the brand section.

## Page
1. **Hero.** The portrait card with "SULEIMAN / SALLAH" across it. Drag
   across it and the light moves through every work's colour. The name fits
   the full width. On phones the 9:16 portrait fills the screen like a cover.
2. **Info.** The portrait continues beside a spec table (services, sites
   built, design + build, colours collected, availability).
3. **Statement.** Words fill from grey to cream as you scroll, then two
   short "Because" paragraphs.
4. **Work: GALLERY.** A three.js curved glass carousel of every work in
   `js/works.js`. Drag, flick, trackpad or arrow keys; it loops and snaps.
   The room takes the colour of the card in front. Phones use the phone
   screenshots as tall cards.
5. **BRANDS.** A simple intro (title, one paragraph, button) above a grid of
   5:4 brand cards, two per row. Hover tilts the photo off a coloured frame
   and VIEW PROJECT stickers pop in. Each card opens `brand/<name>/`.
6. **Start a project.** A big mailto link.

## Tokens
- Background `#0c0b0a`, ink `#ece6dc`, mute 50% ink, rules 16% ink.
- Type: Hanken Grotesk (400/500). **Signature: every capital A in display
  type, and in the name, is an Instrument Serif italic A.**
- Labels are 12px uppercase 500.

## Motion rules (keep them)
- One colour property (`--c`, registered with `@property`) transitions;
  nothing repaints layout.
- The carousel renders only while it's near the screen. Pointer input is
  smoothed into one update per frame. Native scrolling.
- Reduced motion turns off intros, inertia and reveals.
- Hover rules use `any-hover`, because the owner's laptop is a touchscreen.

## Brand case studies
`brand/gelee/` stacks the 22 GELÉE boards in six chapters. From the next brand
on, case studies are wide 16:9 brand-world frames (see the owner's notes).
