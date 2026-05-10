## Plan — Site fixes & improvements

### 1. Site title & favicon
- `index.html`: change `<title>` to **"Your All Solution Is Here"** and update meta og:title / twitter:title to match.
- Favicon: **apni logo image ta chat e upload korun** (PNG preferred). Ami `public/favicon.png` te copy korbo, `public/favicon.ico` delete korbo, ar `<link rel="icon" href="/favicon.png" type="image/png">` add korbo.

### 2. Hero carousel — URL + device upload (per image)
Update `src/pages/admin/HeroAdmin.tsx`:
- Existing `hero_images` table already supports per-image rows with `image_url` (text) and Supabase Storage upload to the `site-assets` bucket. We'll keep Supabase Storage (no base64).
- Replace bulk uploader with **per-row editor** for each carousel image showing:
  - URL text input (paste link)
  - "Upload from device" file picker (uploads to `site-assets/hero/...`, fills the URL)
  - Live thumbnail preview
  - Delete + drag/sort order
- Upload always wins if both used in same edit (overwrites URL field with uploaded URL).

### 3. Admin button in Footer
- `src/components/sections/Footer.tsx`: under social icons row, add a small low-opacity glass button labeled "Admin" → `Link to="/admin"`. Styled with `text-xs opacity-40 hover:opacity-100 glass px-3 py-1 rounded-full`.

### 4. Contact form fix
- `src/components/site/ContactPopup.tsx` and main `Contact.tsx` form: keep current Supabase insert (works + powers Submissions tab) AND keep the existing `sendFormsubmit` helper to mirror submissions to formsubmit.co. Verify the helper points to `developersabbir.x@gmail.com` with `_subject`, `_captcha=false`, `_template=table`. Fix any current breakage (check `src/lib/formsubmit.ts`).
- On success: sonner toast "✓ Message sent successfully!" + reset form fields.
- Apply same flow to Pricing popup form.

### 5. Submissions tab (admin login fix)
- User reports cannot log in to `/admin`. Likely missing admin role for their account. Plan:
  - Verify `user_roles` table — check if any admin exists. If user has signed up but is not admin, we'll insert their `user_id` as admin via a data update (need their email).
  - The `assign_first_admin` trigger only assigns admin to the very first signup. If they signed up after someone else, they're stuck on `user` role.
  - **Action needed from user:** confirm the email used to sign up at `/auth`. Ami sheta diye admin role assign kore debo.
- Defensive cleanup in `src/pages/admin/Submissions.tsx`:
  - Show "-" for null fields, empty state message, refresh on tab focus, already has delete button (kept).

### 6. Vercel routing
- **Skip.** Apni Lovable e deploy korchen — SPA fallback already built in. `vercel.json` lagbe na. `BrowserRouter` already use hocche (`src/App.tsx`).

### 7. Speed optimization
- `src/App.tsx`: convert non-home pages to `React.lazy` + `<Suspense fallback={...}>`:
  - `AllProjects`, `Auth`, `AdminLayout`, `BlogPost`, `ServicePage`, `NotFound`
  - Keep `Index` eager (homepage = LCP).
- `vite.config.ts`: add `build.rollupOptions.output.manualChunks` splitting `react/react-dom/react-router-dom` (vendor), `framer-motion` (animations), Radix UI (ui). Set `chunkSizeWarningLimit: 1000`.
- `index.html`: add `<link rel="preconnect">` for Google Fonts (gstatic + googleapis).
- Add `loading="lazy"` and `decoding="async"` to below-the-fold `<img>` tags in `Projects`, `Blog`, `Testimonials`, `About`. Hero stays eager.

### What I will NOT do
- Will not store images as base64 (you chose Supabase Storage).
- Will not add `vercel.json` (Lovable hosting).
- Will not modify `supabase/client.ts` or `types.ts` (auto-generated).
- Will not change DB schema — all tables already exist.

### Need from you before I start
1. **Upload the logo image** in chat (for favicon).
2. **Email used to sign up at `/auth`** so I can grant admin role for the Submissions tab.

Once you reply with those two, I'll implement everything in one pass.