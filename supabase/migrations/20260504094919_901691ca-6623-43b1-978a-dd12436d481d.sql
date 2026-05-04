
-- ============ ROLES SYSTEM ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ CONTENT TABLES ============
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  plan TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_plans_updated BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============ ENABLE RLS ============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- user_roles
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings: public read, admin write
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- services
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- projects
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- pricing_plans
CREATE POLICY "Anyone can view plans" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Admins manage plans" ON public.pricing_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- contact_submissions: anyone can insert, only admins can read/manage
CREATE POLICY "Anyone can submit" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- hero_images
CREATE POLICY "Anyone can view hero images" ON public.hero_images FOR SELECT USING (true);
CREATE POLICY "Admins manage hero images" ON public.hero_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

CREATE POLICY "Public can view site assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admins upload site assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- ============ SEED DATA ============

-- Site settings defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('navigation', '{"logo_url": "", "brand_name": "PORTFOLIO", "menu_items": [{"label": "Home", "target": "home"}, {"label": "Solutions", "target": "services"}, {"label": "Plans", "target": "pricing"}, {"label": "Contact", "target": "contact"}]}'),
  ('hero', '{"title": "Crafting Digital Experiences That Inspire", "description": "Premium portfolio showcasing innovative design, cutting-edge development, and AI-powered automation solutions.", "primary_cta": "Hire Me", "secondary_cta": "View Work"}'),
  ('about', '{"title": "About Me", "tagline": "Designer · Developer · AI Specialist", "bio": "I build modern, future-ready digital products that blend stunning design with powerful technology. From web platforms to AI automations — I deliver work that drives real results.", "image_url": ""}'),
  ('footer', '{"brand_name": "PORTFOLIO", "slogan": "Building the future, one pixel at a time.", "phone": "+1 (555) 123-4567", "email": "hello@portfolio.com", "location": "New York, USA", "copyright": "© 2026 Portfolio. All rights reserved.", "socials": [{"platform": "facebook", "url": "#"}, {"platform": "instagram", "url": "#"}, {"platform": "linkedin", "url": "#"}, {"platform": "whatsapp", "url": "#"}]}'),
  ('contact', '{"email": "hello@portfolio.com", "phone": "+1 (555) 123-4567", "location": "New York, USA"}'),
  ('whatsapp', '{"enabled": true, "phone_number": "15551234567", "default_message": "Hi! I am interested in your services."}'),
  ('intro_video', '{"enabled": false, "video_url": "", "show_once": true}');

-- Services
INSERT INTO public.services (icon, title, description, sort_order) VALUES
  ('Megaphone', 'Digital Marketing', 'Data-driven campaigns that amplify your brand reach, drive engagement, and convert audiences into loyal customers.', 1),
  ('Code2', 'Web Development', 'High-performance, beautifully crafted websites and web apps built with the latest technologies for speed and scale.', 2),
  ('Bot', 'AI Automation', 'Smart workflows and AI-powered tools that eliminate repetitive tasks and supercharge your productivity.', 3);

-- Pricing plans
INSERT INTO public.pricing_plans (name, price, features, highlighted, sort_order) VALUES
  ('Basic', 'Custom', '["Landing page design", "Basic SEO setup", "Mobile responsive", "Email support", "1 revision round"]', false, 1),
  ('Standard', 'Custom', '["Multi-page website", "Advanced SEO", "Mobile responsive", "Priority email support", "3 revision rounds", "Analytics integration", "Performance optimization"]', true, 2),
  ('Premium', 'Custom', '["Full custom web app", "Advanced SEO + automation", "Mobile responsive", "24/7 priority support", "Unlimited revisions", "Analytics + dashboards", "AI integration", "Ongoing maintenance"]', false, 3);

-- Sample projects
INSERT INTO public.projects (title, description, image_url, featured, sort_order) VALUES
  ('NebulaPay Dashboard', 'Modern fintech dashboard with real-time analytics, transaction insights, and AI-powered fraud detection.', '', true, 1),
  ('Aurora E-commerce', 'High-converting e-commerce platform with custom checkout flow, AR product preview, and global shipping.', '', true, 2),
  ('PulseAI Assistant', 'Conversational AI assistant for customer support automation across web, mobile, and social channels.', '', true, 3),
  ('Lumen Studio Site', 'Award-winning agency website featuring scroll-driven storytelling, 3D visuals, and immersive animations.', '', true, 4);

-- Hero placeholder images (will be replaced with AI-generated later)
INSERT INTO public.hero_images (image_url, sort_order) VALUES
  ('', 1), ('', 2), ('', 3), ('', 4), ('', 5), ('', 6), ('', 7);
