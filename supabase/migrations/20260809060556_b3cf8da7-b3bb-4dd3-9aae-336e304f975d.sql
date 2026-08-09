-- 1) Remove public/anon direct INSERT access to orders (PII spam vector).
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.orders FROM authenticated;
GRANT ALL ON public.orders TO service_role;

-- 2) Harden the SECURITY DEFINER role check: callers may only check their own roles,
--    and anonymous users cannot call it at all.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _user_id IS NULL OR _user_id IS DISTINCT FROM auth.uid() THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
    )
  END
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;