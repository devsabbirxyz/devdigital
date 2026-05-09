## Hero Carousel — Stronger "Light Bulb" Glow Behind Center Image

### Goal
Make the neon purple glow behind the **center/active image** in the hero carousel much more visible — like a light bulb shining from behind the active card.

### Current Issue
A glow already exists, but it sits at `zIndex: 0` while side cards (with their own zIndex from `getStyle`) likely cover or wash it out. The image itself is opaque, so the glow only shows as a halo around the card edges and feels weak.

### Changes (Hero.tsx only)

1. **Move the glow to follow the active card position**
   - Keep it centered (active card is centered) but layer it correctly so the halo bleeds out around all four edges of the active card.

2. **Make the glow stronger and more "lamp-like"**
   - Add a second tighter inner glow on top of the existing wide one:
     - Inner core: smaller (~280px) bright purple radial, less blur (`blur-2xl`), higher opacity
     - Outer halo: existing wide 640px soft radial (kept)
   - Bump core color stops to use full `#a855f7` and a hot inner white-purple highlight (`#d8b4fe`) at center for a "bulb" feel.

3. **Add a subtle pulsing/breathing animation** (already using `animate-pulse-glow` — keep, but apply slightly different timing to inner vs outer for a layered shimmer).

4. **Z-index fix**
   - Outer halo stays at `z-0` (behind everything)
   - Add an additional **front rim glow** rendered as an absolutely positioned element *just behind* the active card (z-index between back cards and active card) so light visibly spills around the active image edges in front of side cards too.

5. **Optional touch**: extend the active card's own ring with a soft outer `box-shadow: 0 0 80px #a855f7` so the card itself appears lit from behind.

### Files
- `src/components/sections/Hero.tsx` — only this file changes.

No DB, no admin, no other sections affected.
