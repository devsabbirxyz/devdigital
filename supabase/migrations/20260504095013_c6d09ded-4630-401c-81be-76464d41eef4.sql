
DROP POLICY IF EXISTS "Anyone can submit" ON public.contact_submissions;
CREATE POLICY "Anyone can submit valid form" ON public.contact_submissions
  FOR INSERT
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 100
    AND char_length(trim(email)) BETWEEN 3 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND char_length(trim(message)) BETWEEN 1 AND 5000
    AND (phone IS NULL OR char_length(phone) <= 50)
    AND (plan IS NULL OR char_length(plan) <= 100)
  );
