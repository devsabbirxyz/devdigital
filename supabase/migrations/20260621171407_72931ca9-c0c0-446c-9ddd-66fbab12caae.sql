-- process_steps table
CREATE TABLE public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Sparkles',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.process_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.process_steps TO authenticated;
GRANT ALL ON public.process_steps TO service_role;

ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active process steps"
  ON public.process_steps FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert process steps"
  ON public.process_steps FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update process steps"
  ON public.process_steps FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete process steps"
  ON public.process_steps FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER process_steps_updated_at
  BEFORE UPDATE ON public.process_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- process_settings table (single-row config)
CREATE TABLE public.process_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title text NOT NULL DEFAULT 'How I Turn Ideas Into Reality',
  section_subtitle text NOT NULL DEFAULT 'From Concept to Completion — A Simple, Transparent, and Results-Driven Process',
  timeline_title text NOT NULL DEFAULT 'Timeline',
  timeline_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_text text NOT NULL DEFAULT 'Ready to bring your idea to life? Let''s build something amazing together.',
  cta_button_label text NOT NULL DEFAULT 'Start Your Project',
  cta_button_link text NOT NULL DEFAULT '#contact',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.process_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.process_settings TO authenticated;
GRANT ALL ON public.process_settings TO service_role;

ALTER TABLE public.process_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view process settings"
  ON public.process_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins insert process settings"
  ON public.process_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update process settings"
  ON public.process_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete process settings"
  ON public.process_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER process_settings_updated_at
  BEFORE UPDATE ON public.process_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed default steps
INSERT INTO public.process_steps (step_number, title, description, icon, sort_order) VALUES
('01', 'Discovery & Strategy', 'I start by understanding your business, goals, and project requirements. Then I craft a clear roadmap so the project moves in the right direction from day one.', 'Lightbulb', 1),
('02', 'Design & Development', 'Following the plan, I design a modern, fast, and user-friendly experience — then build it to the highest standard with clean, scalable code.', 'Palette', 2),
('03', 'Launch & Ongoing Support', 'After thorough testing I launch your project and provide the support and updates you need so your business keeps moving forward without interruption.', 'Rocket', 3);

-- Seed default settings (single row)
INSERT INTO public.process_settings (timeline_items) VALUES (
  '[
    {"day":"Day 1","label":"Requirement Discussion & Planning","icon":"Calendar"},
    {"day":"Day 2–5","label":"Design & Development","icon":"Palette"},
    {"day":"Day 6–7","label":"Testing, Launch & Support","icon":"Rocket"}
  ]'::jsonb
);
