## Plan: Site Structure Reorganization

### Goal
Match the exact section order requested by the user and add the missing "Before & After Results" section.

### Current vs Target Order

| # | Current | Target |
|---|---------|--------|
| 1 | Navbar | Navbar |
| 2 | Hero | Hero |
| 3 | About | About |
| 4 | Stats | Stats Counter |
| 5 | Process | Services |
| 6 | Services | Projects |
| 7 | Projects | Interactive Showcase |
| 8 | Pricing | Process / Timeline |
| 9 | Testimonials | Pricing |
| 10 | Contact | Before & After Results (NEW) |
| 11 | Blog | Client Feedback |
| 12 | FAQ | FAQ |
| 13 | Footer | Contact |
| 14 | | Footer |

### Changes Required

#### 1. Reorder sections in `src/pages/Index.tsx`
Move `ShowcaseScroll` from its current hidden position (it is not in `Index.tsx` currently) into the flow after Projects and before Process.
Move `Process` after `ShowcaseScroll`.
Move `Testimonials` after the new Before & After section.
Move `FAQ` before `Contact`.

Decision needed: Blog section is currently between Contact and FAQ. It is not in the user's requested structure. It will be removed from the homepage.

#### 2. Navbar Menu Update
Update `src/components/site/Navbar.tsx` default menu items to reflect new section anchors:
- Home
- About
- Services
- Projects
- Process
- Pricing
- Results
- Contact

#### 3. New Section: "Before & After Results"

**Database:**
- `before_after_results` table with columns: `id`, `title`, `before_image`, `after_image`, `description`, `category`, `sort_order`, `active`, `created_at`, `updated_at`.
- RLS: public SELECT where active=true, admin-only INSERT/UPDATE/DELETE.
- Seed with 2-3 default examples.

**Frontend (`src/components/sections/BeforeAfter.tsx`):**
- Dark theme, glassmorphism cards, neon purple glow.
- Side-by-side Before/After image comparison slider (drag handle).
- Category filter tabs.
- Framer-motion scroll animations.
- Mobile responsive: stacked layout on mobile, slider on desktop.

**Admin (`src/pages/admin/BeforeAfterAdmin.tsx`):**
- Full CRUD: add/edit/delete result entries.
- Upload before/after images.
- Reorder via sort_order.
- Toggle active/inactive.
- Category management.
- Log activity on changes.

#### 4. Interactive Showcase Integration
`ShowcaseScroll` exists but is NOT rendered in `Index.tsx`. It will be imported and placed between Projects and Process.

#### 5. Admin Layout Update
Add a "Results" tab to `AdminLayout.tsx` with an appropriate icon (e.g., `GitCompare`).

### Files to Create
- `src/components/sections/BeforeAfter.tsx`
- `src/pages/admin/BeforeAfterAdmin.tsx`
- `supabase/migrations/` for `before_after_results` table

### Files to Edit
- `src/pages/Index.tsx` — reorder imports and JSX
- `src/components/site/Navbar.tsx` — update default menu items
- `src/pages/admin/AdminLayout.tsx` — add Results tab
- `src/integrations/supabase/types.ts` — add new table types

### Notes
- All existing admin panels (Stats, FAQ, Process, etc.) remain untouched.
- The Blog section will be removed from the homepage flow. It can still exist as a standalone `/blog/:slug` route.
- All text will be in English, following the user's recent direction.
