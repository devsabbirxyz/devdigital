## Testimonials Section Fixes

### 1. Mobile — Vertical Auto-Scroll (like reference image)
Replace current horizontal snap-scroll with a **vertical upward marquee animation**:
- Stack all mobile testimonial cards vertically (pill-shaped cards with avatar left + name/stars/feedback right, matching the uploaded reference)
- Cards slowly scroll upward continuously (CSS `animate-marquee-up`, ~25-30s loop)
- Duplicate the list so the loop is seamless
- Container has fixed height (~500px) with `overflow-hidden` and top/bottom fade masks
- Each card uses rounded-full pill shape with neon purple glow on the active/centered one

### 2. Desktop — Re-center the Carousel
The active center card is currently shifted slightly to one side. Fix by:
- Ensuring the active card is positioned exactly at center (`left-1/2 -translate-x-1/2` with `x: 0`)
- Verify the perspective container has symmetric padding so left/right depth cards are balanced
- Active card sits perfectly in the middle horizontally

### Files to Edit
- `src/components/sections/Testimonials.tsx` — rewrite mobile block to vertical marquee; verify desktop centering
- `src/index.css` — confirm `animate-marquee-up` keyframe exists (already added previously); add fade mask if needed

No database, admin, or other section changes.
