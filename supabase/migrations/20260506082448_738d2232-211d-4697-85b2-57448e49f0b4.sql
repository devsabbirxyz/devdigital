
-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (published = true OR private.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins manage blog" ON public.blog_posts FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_blog_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Service pages
CREATE TABLE public.service_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  floating_icons jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view service pages" ON public.service_pages FOR SELECT USING (true);
CREATE POLICY "Admins manage service pages" ON public.service_pages FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_sp_updated BEFORE UPDATE ON public.service_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TABLE public.service_page_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL REFERENCES public.service_pages(slug) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  price text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.service_page_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view cards" ON public.service_page_cards FOR SELECT USING (true);
CREATE POLICY "Admins manage cards" ON public.service_page_cards FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role));

-- Seed three service pages
INSERT INTO public.service_pages (slug, title, description, floating_icons) VALUES
('digital-marketing','Digital Marketing Services','Strategic digital marketing solutions including SEO, Social Media Marketing, Google Ads, Content Marketing, and Email Campaigns to grow your online presence and drive real results.','["Megaphone","TrendingUp","Target","Mail","Share2"]'::jsonb),
('web-development','Web Development Services','Custom, modern, and high-performance websites built with the latest technologies. From landing pages to full-stack web applications — clean code, beautiful design, fast delivery.','["Code2","Globe","Layers","Cpu","Rocket"]'::jsonb),
('ai-automation','AI Automation Services','Supercharge your business with intelligent AI automation. Save time, reduce costs, and scale faster with custom AI workflows, chatbots, and smart automation systems.','["Bot","Zap","Workflow","Brain","Sparkles"]'::jsonb);

INSERT INTO public.service_page_cards (page_slug,title,description,price,sort_order) VALUES
('digital-marketing','SEO Optimization','Rank higher on Google with on-page & technical SEO.','$299',0),
('digital-marketing','Social Media Management','Engaging content & community growth across platforms.','$399',1),
('digital-marketing','Google & Meta Ads','Performance ads with proven ROI.','$499',2),
('digital-marketing','Content Marketing','Strategy + content that converts.','$349',3),
('digital-marketing','Email Marketing','Funnels & broadcasts that drive sales.','$249',4),
('web-development','Landing Page Design','High-converting modern landing pages.','$399',0),
('web-development','Business Website','Multi-page professional websites.','$799',1),
('web-development','E-Commerce Store','Full online store with payments.','$1299',2),
('web-development','Web App Development','Custom full-stack applications.','$2499',3),
('web-development','Website Maintenance','Updates, backups & monitoring.','$99/mo',4),
('ai-automation','AI Chatbot Development','Smart chatbots for support & sales.','$599',0),
('ai-automation','Workflow Automation','Automate repetitive business tasks.','$499',1),
('ai-automation','Lead Generation Bot','24/7 lead capture & qualification.','$699',2),
('ai-automation','AI Content Generation','Scale content with AI workflows.','$399',3),
('ai-automation','CRM Automation','Sync & automate your CRM stack.','$799',4);

-- Seed sample blog posts
INSERT INTO public.blog_posts (slug,title,excerpt,content,sort_order) VALUES
('welcome-to-the-blog','Welcome to the Blog','First post — what to expect from this blog.','Welcome! This is the first post on my blog. Stay tuned for more insights on design, development, and AI.',0),
('design-trends-2026','Design Trends to Watch in 2026','Glassmorphism is back — here is how to use it well.','From neon accents to spatial UI, 2026 is shaping up to be an exciting year for digital design.',1),
('ai-automation-guide','A Beginner Guide to AI Automation','Save hours per week with simple AI workflows.','AI automation is no longer just for enterprises. Here is how small teams can leverage it today.',2);
