GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

INSERT INTO public.user_roles (user_id, role)
SELECT '92ffcef0-b37b-4dfe-aadc-0dc9df8b606f'::uuid, 'admin'::public.app_role
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = '92ffcef0-b37b-4dfe-aadc-0dc9df8b606f'::uuid
    AND role = 'admin'::public.app_role
);

WITH first_user AS (
  SELECT id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
)
INSERT INTO public.user_roles (user_id, role)
SELECT fu.id, 'admin'::public.app_role
FROM first_user fu
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE role = 'admin'::public.app_role
)
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = fu.id AND ur.role = 'admin'::public.app_role
);