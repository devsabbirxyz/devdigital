
-- 1. Restrict public read on site_settings so the 'whatsapp' row (contains CallMeBot API key) is not exposed to anon
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;
CREATE POLICY "Public can view non-secret settings"
  ON public.site_settings FOR SELECT
  USING (key <> 'whatsapp');

CREATE POLICY "Admins can view all settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- 2. Switch showcase_items policies to private.has_role
DROP POLICY IF EXISTS "Public can view active showcase items" ON public.showcase_items;
DROP POLICY IF EXISTS "Admins manage showcase items" ON public.showcase_items;

CREATE POLICY "Public can view active showcase items"
  ON public.showcase_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins view all showcase items"
  ON public.showcase_items FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage showcase items"
  ON public.showcase_items FOR ALL
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 3. Revoke EXECUTE on the publicly-exposed has_role to prevent admin enumeration
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
