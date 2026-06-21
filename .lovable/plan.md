## Stats / Counter Section — "আমার অর্জন"

### কোথায় বসবে?
**About section এর ঠিক পরে, Services-এর আগে** (`src/pages/Index.tsx`-এ order: Hero → About → **Stats** → Services → Projects …)।

কারণ:
- About-এ ইউজার পরিচয় পায় → এরপরই credibility/proof দেখানো সবচেয়ে শক্তিশালী (classic SaaS/Agency pattern)।
- Services-এর আগে stats দেখলে ভিজিটর trust নিয়ে নিচে scroll করে।
- Hero-র নিচে রাখলে hero-র CTA-র focus নষ্ট হয়, তাই সেটা avoid করছি।

বিকল্প: চাইলে Projects-এর পরে রাখা যায় (কাজ দেখানোর পর সংখ্যায় summary)। কিন্তু About-Services-এর মাঝখানেই বেশি impactful।

---

### কী বানাবো

**Frontend — `src/components/sections/Stats.tsx`**
- 4 card desktop (grid-cols-4), mobile 2x2 (grid-cols-2)
- glassmorphism + neon purple glow (existing `glass-strong`, `neon-glow`, `--gradient-primary` tokens)
- Lucide icon প্রতি card-এ (admin থেকে icon name select)
- Counter animation: framer-motion `useInView` + `useMotionValue` + `animate()`, 0 → target, 2.5s ease-out, শুধু একবার trigger
- Hover: `-translate-y-2`, glow intensify, smooth transition
- Background: subtle floating particles (CSS only, existing pattern)
- Suffix support ("+", "%") — number parse করে separately render

**Admin — `src/pages/admin/StatsAdmin.tsx`**
CRUD (Add/Edit/Delete/Reorder) for stat cards:
- value (number), suffix ("+", "%", "")
- title (Bangla)
- description (optional)
- icon (Lucide icon name, dropdown from common set: Briefcase, Users, Award, Smile, TrendingUp, Star, Code, Zap)
- order (up/down buttons)
- active toggle

AdminLayout-এ নতুন tab: **"Stats"** (icon: `TrendingUp`)

**Database — নতুন table `stats`**
columns: `id, value (int), suffix (text), title (text), description (text), icon (text), sort_order (int), active (bool), created_at, updated_at`
- RLS: anyone can SELECT active stats; only admin INSERT/UPDATE/DELETE
- Seed 4 default rows: 170+ প্রোজেক্ট, 30+ ক্লায়েন্ট, 5+ বছর, 100% সন্তুষ্টি

---

### Technical details
- Counter: `motion.span` + `useInView({ once: true, amount: 0.4 })` triggers `animate(0, value, { duration: 2.5, onUpdate: v => setDisplay(Math.floor(v)) })`
- Icon render: `const Icon = (LucideIcons as any)[name] ?? Sparkles`
- Section lazy-loaded in `Index.tsx` (existing `lazy()` pattern)
- Activity log: stats create/edit/delete logged via existing `logActivity()`
- কোনো hardcoded color নয় — শুধু existing semantic tokens (`--primary`, `--gradient-primary`, `glass-strong`, `neon-glow`)

---

### Files
**Create:** `src/components/sections/Stats.tsx`, `src/pages/admin/StatsAdmin.tsx`, migration for `stats` table
**Edit:** `src/pages/Index.tsx` (add Stats import + place after About), `src/pages/admin/AdminLayout.tsx` (add Stats tab)

Approve হলে migration দিয়ে শুরু করবো।
