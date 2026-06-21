
CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value integer NOT NULL DEFAULT 0,
  suffix text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text DEFAULT '',
  icon text NOT NULL DEFAULT 'Sparkles',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.stats TO authenticated;
GRANT ALL ON public.stats TO service_role;

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats are viewable by everyone"
  ON public.stats FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert stats"
  ON public.stats FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stats"
  ON public.stats FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stats"
  ON public.stats FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER stats_updated_at
  BEFORE UPDATE ON public.stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.stats (value, suffix, title, description, icon, sort_order) VALUES
  (170, '+', 'প্রোজেক্ট সম্পন্ন', 'সফলভাবে ডেলিভার করা প্রোজেক্ট', 'Briefcase', 1),
  (30, '+', 'সন্তুষ্ট ক্লায়েন্ট', 'বিশ্বব্যাপী হ্যাপি ক্লায়েন্ট', 'Users', 2),
  (5, '+', 'বছরের অভিজ্ঞতা', 'ইন্ডাস্ট্রিতে দীর্ঘ অভিজ্ঞতা', 'Award', 3),
  (100, '%', 'ক্লায়েন্ট সন্তুষ্টি', 'মানসম্পন্ন কাজের নিশ্চয়তা', 'Smile', 4);
