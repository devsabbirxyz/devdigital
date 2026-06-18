
CREATE TABLE public.showcase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  icon text,
  badge text,
  media_url text,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.showcase_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.showcase_items TO authenticated;
GRANT ALL ON public.showcase_items TO service_role;

ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active showcase items"
ON public.showcase_items FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage showcase items"
ON public.showcase_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_showcase_items_updated_at
BEFORE UPDATE ON public.showcase_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.site_settings (key, value)
VALUES (
  'showcase_section',
  jsonb_build_object(
    'enabled', true,
    'title', 'আমার দক্ষতা ও সেবাসমূহ',
    'subtitle', 'Digital Marketing, Web Development এবং AI Automation এর মাধ্যমে ব্যবসার দ্রুত বৃদ্ধি ও অটোমেশন সমাধান।',
    'background', '',
    'animation_speed', 1
  )
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.showcase_items (title, description, features, icon, badge, media_type, sort_order) VALUES
('Google Ads', 'High-intent search campaigns that turn clicks into customers.', '["Search & Display Ads","Keyword Research","Conversion Tracking"]'::jsonb, 'Search', 'Ads', 'image', 1),
('Facebook Ads', 'Scroll-stopping creatives and laser-targeted Meta campaigns.', '["Creative Strategy","Audience Targeting","Retargeting Funnels"]'::jsonb, 'Megaphone', 'Social', 'image', 2),
('SEO', 'Rank higher on Google with technical, on-page and content SEO.', '["Technical SEO","On-page Optimization","Content & Backlinks"]'::jsonb, 'TrendingUp', 'Organic', 'image', 3),
('Web Development', 'Premium, fast, conversion-focused websites and web apps.', '["React & Next.js","Performance & SEO","Custom CMS"]'::jsonb, 'Code2', 'Build', 'image', 4),
('AI Automation', 'Save hours with AI-powered workflows and assistants.', '["AI Chatbots","Content Automation","Custom AI Agents"]'::jsonb, 'Sparkles', 'AI', 'image', 5),
('Lead Generation', 'Predictable pipelines of qualified leads for your business.', '["Landing Pages","Lead Magnets","CRM Integration"]'::jsonb, 'Users', 'Growth', 'image', 6),
('Workflow Automation', 'Connect your tools and automate repetitive business tasks.', '["Zapier / Make","API Integrations","Custom Scripts"]'::jsonb, 'Workflow', 'Ops', 'image', 7);
