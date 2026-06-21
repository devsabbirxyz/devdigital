## How I Turn Ideas Into Reality — Process Section

A new "Process" section with full admin control, placed between **Stats** and **Services** on the home page (natural flow: who I am → numbers → how I work → what I offer).

### 1. Database (new migration)

**Table: `process_steps`**
- `step_number` (text, e.g. "01")
- `title` (text, e.g. "Discovery & Strategy")
- `description` (text)
- `icon` (text — lucide icon name, e.g. "Lightbulb", "Palette", "Rocket")
- `sort_order` (int)
- `active` (bool)
- standard id / created_at / updated_at

**Table: `process_settings`** (single-row config so timeline + CTA + heading are fully editable)
- `section_title` (default: "How I Turn Ideas Into Reality")
- `section_subtitle` (default: "From Concept to Completion — A Simple, Transparent, and Results-Driven Process")
- `timeline_title` (default: "Timeline")
- `timeline_items` (jsonb array of `{ day, label, icon }`, e.g. `[{day:"Day 1", label:"Requirement Discussion & Planning", icon:"Calendar"}, ...]`)
- `cta_text` (default: "Ready to bring your idea to life? Let's build something amazing together.")
- `cta_button_label` (default: "Start Your Project")
- `cta_button_link` (default: "#contact")
- `active` (bool)

RLS: public SELECT where active = true; admin-only INSERT/UPDATE/DELETE. GRANTs included. Seed with 3 default steps + default settings row.

### 2. Frontend — `src/components/sections/Process.tsx` (new)

- Fetches `process_steps` + `process_settings` from Supabase
- All English copy
- Dark theme, glassmorphism cards, neon purple glow (matches Stats / FAQ)
- Layout:
  - Section heading + subtitle (from settings)
  - 3-column grid of step cards on desktop, stacked on mobile, each with: big step number, lucide icon, title, description
  - Timeline strip below (icons + day labels from `timeline_items`)
  - CTA block at the bottom with editable text + button
- Framer-motion `useInView` reveal animations, hover glow on cards
- Lazy-loaded in `src/pages/Index.tsx` between `<Stats />` and `<Services />`

### 3. Admin — `src/pages/admin/ProcessAdmin.tsx` (new)

Two panels in one page:

**Steps panel (CRUD)**
- Add / edit / delete steps (step number, title, description, icon name, sort_order, active toggle)
- Up / down reorder buttons (swap `sort_order`)
- Show/hide toggle
- `logActivity()` on every change

**Settings panel**
- Edit section title, subtitle, timeline title
- Editable timeline items list (add / edit / remove `{day, label, icon}` rows)
- Edit CTA text, button label, button link
- Save button writes the single settings row

Registered in `src/pages/admin/AdminLayout.tsx` as a new "Process" tab with a `Workflow` (lucide) icon, placed right after the "FAQ" tab.

### 4. Files

- **Create**: migration, `src/components/sections/Process.tsx`, `src/pages/admin/ProcessAdmin.tsx`
- **Edit**: `src/pages/Index.tsx` (lazy import + render), `src/pages/admin/AdminLayout.tsx` (new tab)

No fixed/hardcoded copy — every visible string (heading, subtitle, steps, icons, timeline days, CTA) is admin-editable.
