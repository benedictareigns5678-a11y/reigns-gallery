# DESIGN.md — "After Closing Time"

## Color tokens
- `--wall`      #0E1512  deep viridian-black. Museum wall at night. Never flat black.
- `--bone`      #EDE6D6  aged bone; all type on dark. Never pure white.
- `--brass`     #C8A24B  gilt brass: frames, plaque rules, active states, keylines.
- `--oxblood`   #6E1F26  velvet; room labels and rare emphasis only (<8% usage).
- `--candle`    #E4C97E  signal gold: hover ignition, the cursor spotlight.
- `--study`     #F2ECDF  the one lit room (The Maker). Ink on it: #141915.
- Hairlines: brass at ~30% alpha. Grain/plaster texture at 2–3% over dark fields.

## Typography
- Display: Fraunces (variable, optical sizing on). Headings, work titles, room
  names. Heroes 10–14vw, tracking -2%, Roman + Italic mixed inside one headline
  ("Welcome to my website *collection.*" keeps that device).
- Body: Hanken Grotesk, 17px/1.6.
- Plaque: Space Mono, uppercase, 11–12px, tracked +10%. All metadata:
  `No. 03 · EST. MMXXVI · MEDIUM: E-COMMERCE · STATUS: LIVE`.
- Type is the lighting plan: bone type on dark walls reads as lit lettering.

## Motion
- Lenis smooth scroll (lerp 0.09). House ease cubic-bezier(0.16,1,0.3,1).
  Micro 0.35s, reveals 0.9s, field transitions 1.2s.
- The cursor is the flashlight: soft candle radial (~350px, screen blend)
  roams dark sections; tightens over a work; becomes a brass ring labelled
  VIEW / ENQUIRE over links. Touch + reduced-motion: static ambient light.
- Load sequence ≤1.6s: dark → name tracks in → gilt rule draws → hero staggers.
- Reveals: line-masked headlines (70ms stagger), works scale 1.12→1 in frames.
- Transform/opacity only. 60fps or the effect is cut.

## Signature moments
1. The flashlight cursor (the soul; first 3 seconds must cause the pause).
2. The Collection: pinned horizontal promenade; vertical scroll walks the wall.
   Works hang dimmed (85% brightness, slight desat) and wake on approach.
3. The Maker: the page's one bone-lit room (animated color-field inversion).
4. Footer: the owner's name at monument scale, cropped by the viewport bottom.

## Bans
Purple/indigo gradients, glassmorphism, emoji icons, Inter as display,
raw naked screenshots, equal card grids, drop-shadow depth (light does depth),
em dashes in copy, #000/#fff.
