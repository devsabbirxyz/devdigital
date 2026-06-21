CREATE TABLE public.before_after_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  before_image text NOT NULL,
  after_image text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.before_after_results TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.before_after_results TO authenticated;
GRANT ALL ON public.before_after_results TO service_role;

ALTER TABLE public.before_after_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active results"
  ON public.before_after_results FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can view all results"
  ON public.before_after_results FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert results"
  ON public.before_after_results FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update results"
  ON public.before_after_results FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete results"
  ON public.before_after_results FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER before_after_results_updated_at
  BEFORE UPDATE ON public.before_after_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.before_after_results (title, description, category, before_image, after_image, sort_order) VALUES
  ('E-commerce Redesign', 'Transformed a slow, outdated store into a fast, modern shopping experience that doubled conversions.', 'web', 'https://placehold.co/800x600/1a1a2e/666?text=Before', 'https://placehold.co/800x600/271552/e94560?text=After', 1),
  ('SaaS Landing Page', 'Rebuilt a confusing landing page into a high-converting funnel with clear messaging.', 'web', 'https://placehold.co/800x600/1a1a2e/666?text=Before', 'https://placehold.co/800x600/271552/e94560?text=After', 2),
  ('Brand Identity Refresh', 'Modernized a dated brand into a sleek, premium identity that resonates with target customers.', 'design', 'https://placehold.co/800x600/1a1a2e/666?text=Before', 'https://placehold.co/800x600/271552/e94560?text=After', 3);