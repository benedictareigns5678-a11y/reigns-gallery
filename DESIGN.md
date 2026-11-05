# DESIGN.md — "Colour first"

## The idea
Every site starts as a colour. Closed, a work is a band of its brand's own
colour; open, it is the website. The gallery has no colour of its own:
paper, ink and the brands' colours do all the work.

## Page
1. **The colour wall (hero).** All works as bands in hue order (darker shades
   lead), plus an 18th empty dashed band, "yours", which links to contact.
   Hover, focus or scrub opens a band; the caption rides underneath. Phones and
   tablets get a stage (the phone capture on phones) above a thumb-scrub strip.
2. **Colour rooms (selected work).** One full-screen spread per `featured`
   work. While a room holds the middle of the screen, the whole page takes on
   that brand's colour, mixed 40% toward ink so the site stands off the wall.
   Each room shows the desktop and phone captures, the story, what I made, and
   a link.
3. **The index.** Every site, grouped by `kind`. A colour chip on each row,
   and a sticky window that sweeps in the colour, then the site. Phones and
   tablets: a thumbnail in each row, no window.
4. **About.** One person, from the first idea to the live site.
5. **Contact, the 18th band opened.** Visitors move across the band to pick
   their own colour (x = hue, y = light to deep); it goes into their email.

## Tokens
- Paper `#f3f1ec`, ink `#161513`, soft ink `#6a675f`, line `#dcd8cf`,
  strong line `#b4afa4`.
- One typeface: Instrument Sans. Hierarchy by size and tone only, sentence
  case, no full stops on headlines.
- Links are plain underlines that wipe away on hover. No pill buttons.

## Motion rules (measured, keep them)
- The wall slides bands with transforms only (Web Animations, quart-out
  `linear()` curve). Never animate width, flex or layout.
- Room colour = two fixed layers crossfaded by opacity, never a repaint.
- Pointer input is folded into one update per frame. Hover targets come from
  settled geometry, never from the moving DOM.
- Native scrolling (no smooth-scroll library). Reduced motion turns it all off.
- Hover rules use `any-hover`, because the owner's laptop is a touchscreen.

## Bans
Giant condensed headlines with full stops, mono all-caps micro labels,
01/02 numbered lists, pill buttons, italic-serif accent words, equal card
grids, purple gradients, glassmorphism, emoji, #000/#fff.
