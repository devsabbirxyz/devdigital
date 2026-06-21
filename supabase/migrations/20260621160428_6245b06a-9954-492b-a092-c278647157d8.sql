CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active faqs" ON public.faqs
  FOR SELECT USING (active = true);
CREATE POLICY "Admins can read all faqs" ON public.faqs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert faqs" ON public.faqs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update faqs" ON public.faqs
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete faqs" ON public.faqs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('আপনি কী ধরনের সেবা প্রদান করেন?', 'আমি Digital Marketing, Web Development এবং AI Automation সম্পর্কিত বিভিন্ন সেবা প্রদান করি।', 1),
('একটি ওয়েবসাইট তৈরি করতে কতদিন সময় লাগে?', 'প্রোজেক্টের ধরন অনুযায়ী সাধারণত ৩–১৪ দিনের মধ্যে সম্পন্ন করা হয়।', 2),
('Digital Marketing এর মাধ্যমে কী ধরনের ফলাফল পাওয়া যায়?', 'সঠিক কৌশল ব্যবহার করলে ব্র্যান্ড ভিজিবিলিটি, লিড এবং সেলস উল্লেখযোগ্যভাবে বৃদ্ধি পায়।', 3),
('AI Automation কীভাবে ব্যবসার উপকার করে?', 'AI Automation সময় বাঁচায়, কাজের গতি বাড়ায় এবং repetitive task স্বয়ংক্রিয়ভাবে সম্পন্ন করে।', 4),
('কাজ শুরু করার আগে কি consultation দেওয়া হয়?', 'হ্যাঁ, কাজ শুরু করার আগে project requirement নিয়ে আলোচনা করা হয়।', 5),
('কাজ শেষ হওয়ার পরে support পাওয়া যাবে?', 'হ্যাঁ, project delivery এর পরেও প্রয়োজনীয় support প্রদান করা হয়।', 6);