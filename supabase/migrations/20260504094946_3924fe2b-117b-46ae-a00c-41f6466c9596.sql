
-- Fix search_path on trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Lock down SECURITY DEFINER function execution to internal use only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten storage bucket: don't allow listing all files, only direct access to known paths
DROP POLICY IF EXISTS "Public can view site assets" ON storage.objects;
CREATE POLICY "Public can read site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets' AND (storage.foldername(name))[1] IS NOT NULL);
