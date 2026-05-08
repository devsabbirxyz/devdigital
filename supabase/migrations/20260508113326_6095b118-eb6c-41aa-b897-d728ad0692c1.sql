CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  client_image text,
  rating integer NOT NULL DEFAULT 5,
  feedback text NOT NULL DEFAULT '',
  show_desktop boolean NOT NULL DEFAULT true,
  show_mobile boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
ON public.testimonials FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage testimonials"
ON public.testimonials FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.testimonials (client_name, rating, feedback, sort_order) VALUES
('Sarah Johnson', 5, 'Outstanding work! Delivered beyond my expectations and the design is simply premium.', 1),
('Michael Chen', 5, 'Professional, fast, and incredibly talented. My website traffic doubled in a month.', 2),
('Aisha Rahman', 5, 'Truly impressed with the AI automation setup. Saved us hours every week.', 3),
('David Park', 4, 'Great communication and beautiful UI. Highly recommend for any digital project.', 4),
('Lina Gomez', 5, 'A pleasure to work with. The brand glow-up was exactly what I needed.', 5);