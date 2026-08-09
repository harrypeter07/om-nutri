-- Replace has_role() usage in policies with an inline, RLS-respecting subquery
-- so the SECURITY DEFINER function no longer needs to be callable by clients.

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins read orders" ON public.orders;
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins read all reviews" ON public.reviews;
CREATE POLICY "Admins read all reviews" ON public.reviews FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update reviews" ON public.reviews;
CREATE POLICY "Admins update reviews" ON public.reviews FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

DROP POLICY IF EXISTS "Admins delete reviews" ON public.reviews;
CREATE POLICY "Admins delete reviews" ON public.reviews FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role));

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;