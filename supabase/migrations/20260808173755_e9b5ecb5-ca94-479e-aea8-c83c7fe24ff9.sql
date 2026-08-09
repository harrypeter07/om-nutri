CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  accent text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price numeric NOT NULL,
  compare_at_price numeric,
  description text,
  benefits text[] NOT NULL DEFAULT '{}',
  ingredients text,
  images text[] NOT NULL DEFAULT '{}',
  stock int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  rating_avg numeric NOT NULL DEFAULT 0,
  rating_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are public" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT WITH CHECK (approved = false);
CREATE POLICY "Admins read all reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL DEFAULT 'Panipat',
  pincode text,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  whatsapp_sent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.categories (name, slug, icon, accent, sort_order) VALUES
  ('Weight Gain', 'weight-gain', 'TrendingUp', '#2D8CFF', 1),
  ('Weight Loss', 'weight-loss', 'Flame', '#F59E0B', 2),
  ('Pre-Workout', 'pre-workout', 'Zap', '#38E1C6', 3),
  ('Healthy Gain', 'healthy-gain', 'Leaf', '#22C55E', 4),
  ('General Supplements', 'general-supplements', 'Pill', '#0B1F4D', 5);

INSERT INTO public.products (name, slug, category_id, price, compare_at_price, description, benefits, ingredients, images, stock, is_featured, rating_avg, rating_count)
SELECT v.name, v.slug, c.id, v.price, v.compare_at_price, v.description, v.benefits, v.ingredients, v.images, v.stock, v.is_featured, v.rating_avg, v.rating_count
FROM (VALUES
  ('Whey Protein Isolate 1kg','whey-protein-isolate-1kg','general-supplements',2899,3499,'Fast-absorbing whey isolate with 27g protein per scoop. Our best-selling protein at the Panipat store, ideal right after training.',ARRAY['27g protein per scoop','Under 1g sugar','Mixes instantly, no lumps','Genuine sealed pack'],'Whey protein isolate, cocoa powder, natural flavour, sucralose, digestive enzyme blend.',ARRAY['/images/p-whey.jpg'],24,true,4.8,26),
  ('Whey Protein Concentrate 2kg','whey-protein-concentrate-2kg','general-supplements',4299,4999,'Everyday whey concentrate in a value 2kg pack. Great protein-per-rupee for lifters training 5-6 days a week.',ARRAY['24g protein per scoop','5.5g BCAA','Value 2kg pack','Smooth chocolate taste'],'Whey protein concentrate, cocoa, natural and artificial flavour, sucralose.',ARRAY['/images/p-whey.jpg'],18,true,4.6,19),
  ('Serious Mass Gainer 3kg','serious-mass-gainer-3kg','weight-gain',3499,3999,'High-calorie mass gainer for anyone struggling to put on weight. Blend it with milk twice a day for a clean calorie surplus.',ARRAY['1250 kcal per serving with milk','50g protein per serving','Added vitamins and minerals','Easy on the stomach'],'Maltodextrin, whey protein concentrate, cocoa, vitamin and mineral premix, digestive enzymes.',ARRAY['/images/p-gainer.jpg'],15,true,4.7,22),
  ('Lean Weight Gainer 1kg','lean-weight-gainer-1kg','weight-gain',1699,1999,'A leaner gainer for people who want size without excess fat. Balanced carbs to protein ratio at 3:1.',ARRAY['600 kcal per serving','No added sugar','Lean 3:1 carb-protein ratio','Trial-friendly 1kg pack'],'Oat flour, maltodextrin, whey concentrate, MCT powder, natural flavour.',ARRAY['/images/p-gainer.jpg'],20,false,4.4,11),
  ('Creatine Monohydrate 250g','creatine-monohydrate-250g','pre-workout',949,1199,'Micronised creatine monohydrate — the most researched strength supplement there is. One scoop daily, any time.',ARRAY['3g pure creatine per scoop','Micronised for easy mixing','Supports strength and power','83 servings per jar'],'100% micronised creatine monohydrate.',ARRAY['/images/p-preworkout.jpg'],30,true,4.9,31),
  ('Explosive Pre-Workout 300g','explosive-pre-workout-300g','pre-workout',1499,1799,'Caffeine, citrulline and beta-alanine pre-workout for serious pump and focus. Take 20 minutes before training.',ARRAY['200mg caffeine per scoop','6g citrulline malate','Strong pump and focus','Blue raspberry flavour'],'Citrulline malate, beta-alanine, caffeine anhydrous, taurine, natural flavour, sucralose.',ARRAY['/images/p-preworkout.jpg'],22,false,4.5,14),
  ('Thermo Fat Burner 60 Caps','thermo-fat-burner-60-caps','weight-loss',1299,1599,'Green tea and L-carnitine based thermogenic to support a fat-loss phase alongside diet and training.',ARRAY['Green tea extract and L-carnitine','Supports metabolism','Appetite control','30-day supply'],'Green tea extract, L-carnitine tartrate, garcinia cambogia, caffeine, chromium.',ARRAY['/images/p-burner.jpg'],26,false,4.2,9),
  ('L-Carnitine Liquid 500ml','l-carnitine-liquid-500ml','weight-loss',1099,1299,'Liquid L-carnitine for cardio days. Helps shuttle fatty acids for energy during fasted or steady-state training.',ARRAY['1500mg per serving','Sugar-free','Fast absorbing liquid','Citrus flavour'],'L-carnitine liquid, purified water, citric acid, natural flavour, sucralose.',ARRAY['/images/p-burner.jpg'],17,false,4.3,7),
  ('Daily Multivitamin 60 Tabs','daily-multivitamin-60-tabs','healthy-gain',699,899,'Full-spectrum multivitamin for lifters and anyone eating in a deficit. One tablet with breakfast.',ARRAY['24 vitamins and minerals','Supports immunity and recovery','No artificial colours','2-month supply'],'Vitamin A, C, D3, E, B-complex, zinc, magnesium, selenium, iron.',ARRAY['/images/p-wellness.jpg'],35,true,4.6,16),
  ('Omega-3 Fish Oil 60 Softgels','omega-3-fish-oil-60-softgels','healthy-gain',799,999,'Triple-strength fish oil for joints, heart and recovery. Molecularly distilled, no fishy aftertaste.',ARRAY['1000mg fish oil per softgel','180mg EPA, 120mg DHA','Mercury tested','Enteric coated'],'Fish oil concentrate, gelatin, glycerin, purified water, natural tocopherol.',ARRAY['/images/p-wellness.jpg'],28,false,4.5,12)
) AS v(name, slug, cat_slug, price, compare_at_price, description, benefits, ingredients, images, stock, is_featured, rating_avg, rating_count)
JOIN public.categories c ON c.slug = v.cat_slug;

INSERT INTO public.reviews (product_id, customer_name, rating, comment, approved)
SELECT p.id, v.customer_name, v.rating, v.comment, true
FROM (VALUES
  ('whey-protein-isolate-1kg','Rohit Kumar',5,'Bought from the Panipat store itself. Genuine product, mixes clean and Sameer bhai explained the whole dosage properly.'),
  ('whey-protein-isolate-1kg','Aman Sehrawat',5,'Third tub now. Better price than online and I get it the same day.'),
  ('serious-mass-gainer-3kg','Vikas Malik',5,'Gained 4kg in two months with this along with proper meals. Very happy.'),
  ('creatine-monohydrate-250g','Deepak Rana',5,'Simple, pure creatine. Strength on bench went up within three weeks.'),
  ('daily-multivitamin-60-tabs','Priya Sharma',4,'Taking it daily, feel less tired during evening workouts.'),
  ('explosive-pre-workout-300g','Sahil Chauhan',4,'Good pump and no crash afterwards. Flavour is decent.')
) AS v(slug, customer_name, rating, comment)
JOIN public.products p ON p.slug = v.slug;