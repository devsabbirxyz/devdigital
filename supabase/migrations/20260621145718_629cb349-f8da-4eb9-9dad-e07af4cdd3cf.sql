
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read activity logs" ON public.activity_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can insert own activity" ON public.activity_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
