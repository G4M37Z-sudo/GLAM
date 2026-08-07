-- ============================================================================
-- GLAM — seed data (v1)
-- 6 categories × 5 products = 30 products.
-- Idempotent: ON CONFLICT DO NOTHING everywhere.
-- Image URLs use picsum.photos with the slug as seed for stable variety.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Categories
-- ----------------------------------------------------------------------------
insert into public.categories (slug, name, image_url, display_order) values
  ('electronics',         'Electronics',          'https://picsum.photos/seed/cat-electronics/600/400',         1),
  ('home-garden',         'Home & Garden',        'https://picsum.photos/seed/cat-home-garden/600/400',         2),
  ('fashion-accessories', 'Fashion Accessories',  'https://picsum.photos/seed/cat-fashion/600/400',             3),
  ('beauty-personal-care','Beauty & Personal Care','https://picsum.photos/seed/cat-beauty/600/400',              4),
  ('sports-outdoors',     'Sports & Outdoors',    'https://picsum.photos/seed/cat-sports/600/400',              5),
  ('gadgets',             'Gadgets',              'https://picsum.photos/seed/cat-gadgets/600/400',             6)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Helper: each product line below has slug, title, desc, base_cents, retail_cents,
-- moq, stock, featured, category_slug, img_count
-- We insert products, then images and tiers in second/third passes keyed by slug.
-- ----------------------------------------------------------------------------

insert into public.products (slug, title, description, specifications, category_id, base_price_cents, retail_price_cents, currency, moq, stock, is_featured, is_active) values
  -- ELECTRONICS
  ('wireless-earbuds-pro-x1',
   'Wireless Earbuds Pro X1 — Active Noise Cancelling',
   'Bluetooth 5.3 in-ear earbuds with hybrid ANC, 32h total battery life with the charging case, and IPX5 sweat resistance. Touch controls and USB-C fast charging make these ideal for commuting and workouts.',
   '{"battery_hours":32,"bluetooth":"5.3","anc":true,"waterproof":"IPX5","driver_mm":10,"weight_g":52}'::jsonb,
   (select id from public.categories where slug='electronics'),
   850,  2900, 'USD', 5,  420, true,  true),

  ('smart-watch-fit-s2',
   'Smart Watch Fit S2 — AMOLED Always-On Display',
   '1.43" AMOLED always-on display, 100+ sport modes, SpO2 and 24/7 heart rate monitoring, and 12-day battery. Aluminium alloy body with swappable silicone straps.',
   '{"display":"1.43 inch AMOLED","battery_days":12,"sport_modes":100,"gps":true,"water_rating":"5ATM"}'::jsonb,
   (select id from public.categories where slug='electronics'),
   1200, 4500, 'USD', 3,  300, true,  true),

  ('usb-c-hub-7-in-1',
   'USB-C Hub 7-in-1 with 4K HDMI',
   'Aluminium hub adds HDMI 4K@30Hz, 2x USB-A 3.0, USB-C PD 100W pass-through, SD and microSD readers, and Gigabit Ethernet from a single USB-C port.',
   '{"ports":7,"hdmi":"4K@30Hz","pd_watts":100,"ethernet":"Gigabit","material":"Aluminium"}'::jsonb,
   (select id from public.categories where slug='electronics'),
   950,  3200, 'USD', 10, 500, false, true),

  ('portable-charger-20000',
   'Portable Charger 20000mAh PD 22.5W',
   'High-capacity power bank with 22.5W Power Delivery, dual USB-A and USB-C output, and a built-in LED torch. Airline-approved for carry-on.',
   '{"capacity_mah":20000,"pd_watts":22.5,"outputs":3,"weight_g":420}'::jsonb,
   (select id from public.categories where slug='electronics'),
   1100, 3800, 'USD', 5,  350, true,  true),

  ('bluetooth-speaker-m10',
   'Bluetooth Speaker M10 — 360° Surround Sound',
   'Compact IPX7 waterproof speaker with dual passive radiators, 16h playback, TWS pairing, and built-in microphone for hands-free calls.',
   '{"battery_hours":16,"bluetooth":"5.1","waterproof":"IPX7","power_watts":20,"tws":true}'::jsonb,
   (select id from public.categories where slug='electronics'),
   780,  2500, 'USD', 10, 480, false, true),

  -- HOME & GARDEN
  ('ceramic-vase-minimal',
   'Handmade Ceramic Vase — Minimal Nordic Style',
   'Matte-glazed stoneware vase, 25cm tall, hand-thrown by small-batch artisans. Perfect for dried pampas or single-stem arrangements.',
   '{"height_cm":25,"material":"Stoneware","finish":"Matte glaze","color":"Sand"}'::jsonb,
   (select id from public.categories where slug='home-garden'),
   690,  2400, 'USD', 5,  220, true,  true),

  ('scented-candle-set-3',
   'Soy Wax Scented Candle Set — 3 Scents',
   'Set of three 180g soy-wax candles in amber glass jars: Vanilla Sandalwood, Citrus Verbena, and Midnight Cedar. 45-hour burn time each.',
   '{"count":3,"weight_g_each":180,"burn_hours":45,"wax":"Soy","scents":["Vanilla Sandalwood","Citrus Verbena","Midnight Cedar"]}'::jsonb,
   (select id from public.categories where slug='home-garden'),
   560,  1900, 'USD', 5,  300, false, true),

  ('bamboo-storage-box-l',
   'Bamboo Storage Box with Lid — Large',
   'Stackable bamboo box (40×30×20cm) with magnetic-close lid and ventilation slots. Moisture-resistant finish, sustainably sourced bamboo.',
   '{"material":"Bamboo","dimensions_cm":"40x30x20","stackable":true,"finish":"Moisture-resistant"}'::jsonb,
   (select id from public.categories where slug='home-garden'),
   870,  2900, 'USD', 5,  180, false, true),

  ('plant-pot-self-water',
   'Self-Watering Plant Pot — 18cm',
   'Modern matte-finish planter with a built-in water reservoir and wicking system that keeps plants hydrated for up to two weeks.',
   '{"diameter_cm":18,"material":"Recycled plastic","reservoir_l":1.2,"finish":"Matte"}'::jsonb,
   (select id from public.categories where slug='home-garden'),
   480,  1600, 'USD', 10, 400, false, true),

  ('throw-pillow-linen',
   'Linen Throw Pillow Cover 45×45cm',
   '100% French linen pillow cover with hidden YKK zip and double-stitched seams. Pre-washed for soft hand-feel; insert sold separately.',
   '{"material":"100% Linen","size_cm":"45x45","closure":"Hidden zip","care":"Machine washable"}'::jsonb,
   (select id from public.categories where slug='home-garden'),
   520,  1800, 'USD', 10, 350, false, true),

  -- FASHION ACCESSORIES
  ('sunglasses-classic-aviator',
   'Classic Aviator Sunglasses — Polarised',
   'Polarised UV400 lenses in a stainless steel aviator frame with adjustable nose pads. Includes microfiber pouch and cleaning cloth.',
   '{"lens":"Polarised UV400","frame":"Stainless steel","width_mm":142,"weight_g":28}'::jsonb,
   (select id from public.categories where slug='fashion-accessories'),
   430,  1500, 'USD', 10, 500, true,  true),

  ('baseball-cap-unisex',
   'Unisex Cotton Baseball Cap — Adjustable',
   'Six-panel brushed-cotton cap with curved brim, metal buckle adjuster, and reinforced stitching. One-size-fits-most with breathable eyelets.',
   '{"material":"Brushed cotton","closure":"Metal buckle","panels":6}'::jsonb,
   (select id from public.categories where slug='fashion-accessories'),
   310,  1200, 'USD', 20, 500, false, true),

  ('crossbody-bag-canvas',
   'Canvas Crossbody Bag — Daily Commute',
   'Waxed canvas crossbody with adjustable webbing strap, YKK zips, and five internal organiser pockets. 4L capacity in a slim profile.',
   '{"material":"Waxed canvas","capacity_l":4,"strap":"Adjustable webbing","pockets":5}'::jsonb,
   (select id from public.categories where slug='fashion-accessories'),
   580,  2200, 'USD', 5,  240, true,  true),

  ('scarf-cashmere-blend',
   'Cashmere Blend Scarf — 180×40cm',
   'Brushed cashmere-wool blend scarf with hand-knotted fringe. Lightweight enough for layering, warm enough for winter.',
   '{"material":"70% Wool / 30% Cashmere","size_cm":"180x40","weight_g":180}'::jsonb,
   (select id from public.categories where slug='fashion-accessories'),
   690,  2400, 'USD', 5,  200, false, true),

  ('beanie-merino-knit',
   'Merino Wool Knit Beanie — Ribbed',
   'Soft, itch-free merino wool beanie with a double-layer cuff for extra ear warmth. Naturally moisture-wicking and odour-resistant.',
   '{"material":"100% Merino wool","fit":"Slim","cuff":"Double-layer"}'::jsonb,
   (select id from public.categories where slug='fashion-accessories'),
   290,  1100, 'USD', 20, 480, false, true),

  -- BEAUTY & PERSONAL CARE
  ('face-serum-vitamin-c',
   'Vitamin C Brightening Face Serum 30ml',
   'Stabilised 15% L-ascorbic acid serum with hyaluronic acid and ferulic acid. Brightens dull skin and evens tone; comes in a UV-protective glass dropper bottle.',
   '{"volume_ml":30,"active":"15% L-ascorbic acid","skin_type":"All","cruelty_free":true}'::jsonb,
   (select id from public.categories where slug='beauty-personal-care'),
   520,  1900, 'USD', 5,  260, true,  true),

  ('makeup-brush-set-12',
   'Professional Makeup Brush Set — 12 Pieces',
   'Complete face and eye brush set with soft synthetic bristles, rose-gold aluminium ferrules, and a vegan leather roll-up case.',
   '{"count":12,"bristles":"Synthetic","ferrule":"Aluminium","case":"Vegan leather roll"}'::jsonb,
   (select id from public.categories where slug='beauty-personal-care'),
   740,  2600, 'USD', 3,  220, true,  true),

  ('jade-roller-gua-sha',
   'Jade Roller & Gua Sha Set',
   'Authentic Xiuyan jade facial roller with double-ended Gua Sha tool. Helps reduce puffiness and boost circulation when chilled.',
   '{"material":"Xiuyan jade","pieces":2,"includes":"Pouch"}'::jsonb,
   (select id from public.categories where slug='beauty-personal-care'),
   360,  1300, 'USD', 10, 400, false, true),

  ('hair-dryer-diffuser',
   'Universal Hair Dryer Diffuser Attachment',
   'Silicone diffuser attachment for curly and wavy hair. Universal fit on most dryers from 4.5 to 5.5cm nozzle diameter.',
   '{"material":"Silicone","fits_cm":"4.5-5.5","care":"Dishwasher safe"}'::jsonb,
   (select id from public.categories where slug='beauty-personal-care'),
   230,  900,  'USD', 20, 500, false, true),

  ('manicure-set-stainless',
   'Stainless Steel Manicure Set — 8 Tools',
   'Eight precision grooming tools in a vegan leather travel case: nail clipper, scissors, tweezers, file, cuticle pusher, and three cleaning implements.',
   '{"pieces":8,"material":"Stainless steel","case":"Vegan leather"}'::jsonb,
   (select id from public.categories where slug='beauty-personal-care'),
   410,  1500, 'USD', 5,  320, false, true),

  -- SPORTS & OUTDOORS
  ('yoga-mat-premium-6mm',
   'Premium Yoga Mat — 6mm TPE',
   'Non-slip 6mm TPE yoga mat with alignment lines and a carry strap. Closed-cell construction resists sweat and bacteria.',
   '{"thickness_mm":6,"material":"TPE","size_cm":"183x68","anti_slip":true}'::jsonb,
   (select id from public.categories where slug='sports-outdoors'),
   620,  2100, 'USD', 5,  280, true,  true),

  ('resistance-bands-set-5',
   'Resistance Bands Set — 5 Levels',
   'Five colour-coded latex bands (5–30kg resistance) with carabiner clips, two foam handles, ankle cuffs, and a zippered carry pouch.',
   '{"levels":5,"resistance_kg":"5-30","includes":["Handles","Ankle cuffs","Pouch"]}'::jsonb,
   (select id from public.categories where slug='sports-outdoors'),
   410,  1500, 'USD', 5,  350, false, true),

  ('foam-roller-high-density',
   'High-Density Foam Roller 60cm',
   'EPP foam roller for post-workout recovery. 60cm length with a textured surface for deep-tissue massage.',
   '{"material":"EPP foam","length_cm":60,"diameter_cm":15,"texture":"Textured"}'::jsonb,
   (select id from public.categories where slug='sports-outdoors'),
   480,  1700, 'USD', 5,  300, false, true),

  ('jump-rope-speed',
   'Speed Jump Rope — Ball Bearing',
   'Steel-wire speed rope with 360° ball-bearing handles and adjustable length. Includes a spare PVC-coated cable.',
   '{"cable":"Steel wire","bearings":true,"adjustable":true,"spare_cable":true}'::jsonb,
   (select id from public.categories where slug='sports-outdoors'),
   220,  900,  'USD', 20, 500, false, true),

  ('water-bottle-insulated-1l',
   'Insulated Water Bottle 1L — Stainless Steel',
   'Double-wall vacuum insulated 18/8 stainless steel bottle. Keeps drinks cold for 24h or hot for 12h; leakproof flip cap.',
   '{"capacity_l":1,"material":"18/8 Stainless","cold_hours":24,"hot_hours":12,"bpa_free":true}'::jsonb,
   (select id from public.categories where slug='sports-outdoors'),
   530,  1900, 'USD', 10, 480, true,  true),

  -- GADGETS
  ('mini-projector-hd',
   'Mini Projector — Native 720p HDMI/USB',
   'Portable LED projector with native 1280×720 resolution, 200 ANSI lumens, HDMI and USB inputs, and built-in 3W speaker.',
   '{"resolution":"1280x720","lumens":200,"lamp_life_h":30000,"inputs":["HDMI","USB","AV"]}'::jsonb,
   (select id from public.categories where slug='gadgets'),
   1490, 4900, 'USD', 3,  120, true,  true),

  ('retro-mech-keyboard',
   'Retro Mechanical Keyboard — 87 Keys Hot-Swap',
   'Tenkeyless mechanical keyboard with hot-swap sockets, RGB backlight, and double-shot PBT keycaps in a beige-and-brown retro colourway.',
   '{"keys":87,"switches":"Hot-swap (3/5 pin)","backlight":"RGB","keycaps":"Double-shot PBT"}'::jsonb,
   (select id from public.categories where slug='gadgets'),
   1340, 4500, 'USD', 3,  160, false, true),

  ('phone-stand-adjustable',
   'Adjustable Aluminium Phone Stand',
   'Foldable aluminium phone and tablet stand with anti-slip silicone pads. Adjustable height (8–15cm) and viewing angle (0–100°).',
   '{"material":"Aluminium","height_range_cm":"8-15","angle_range_deg":"0-100","foldable":true}'::jsonb,
   (select id from public.categories where slug='gadgets'),
   270,  1100, 'USD', 20, 500, false, true),

  ('magnetic-charger-15w',
   'Magnetic Wireless Charger 15W',
   'MagSafe-compatible magnetic wireless charger with 15W fast charge, USB-C input, and integrated 1.5m braided cable.',
   '{"power_watts":15,"input":"USB-C","cable_length_m":1.5,"compatible":"MagSafe / Qi"}'::jsonb,
   (select id from public.categories where slug='gadgets'),
   380,  1400, 'USD', 10, 420, false, true),

  ('desk-fan-usb',
   'USB Desk Fan — Quiet 4-Speed',
   'Whisper-quiet brushless motor desk fan with four speeds, 90° oscillation, and 5V USB power.',
   '{"speeds":4,"oscillation_deg":90,"power":"USB 5V","noise_db":"<30"}'::jsonb,
   (select id from public.categories where slug='gadgets'),
   310,  1200, 'USD', 10, 460, false, true)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Product images — 2 or 3 per product. Use product slug as picsum seed so
-- the same product always shows the same image, but different products vary.
-- ----------------------------------------------------------------------------
with prod as (select id, slug from public.products)
insert into public.product_images (product_id, url, display_order, is_cover)
select p.id,
       'https://picsum.photos/seed/' || p.slug || '/800/800',
       0, true
from prod p
on conflict do nothing;

with prod as (select id, slug from public.products)
insert into public.product_images (product_id, url, display_order, is_cover)
select p.id,
       'https://picsum.photos/seed/' || p.slug || '-b/800/800',
       1, false
from prod p
on conflict do nothing;

with prod as (select id, slug from public.products)
insert into public.product_images (product_id, url, display_order, is_cover)
select p.id,
       'https://picsum.photos/seed/' || p.slug || '-c/800/800',
       2, false
from prod p
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Price tiers — three descending tiers per product.
-- Tier 1 (qty 1)  ≈ retail price (single-unit B2C baseline)
-- Tier 2 (qty 10) ≈ mid wholesale discount
-- Tier 3 (qty 50) ≈ base wholesale (B2B bulk)
-- ----------------------------------------------------------------------------
with prod as (
  select p.id,
         p.slug,
         p.retail_price_cents,
         p.base_price_cents,
         p.moq
  from public.products p
)
insert into public.price_tiers (product_id, min_qty, unit_price_cents)
select p.id,
       greatest(p.moq, 1)::int          as min_qty,
       p.retail_price_cents            as unit_price_cents
from prod p
on conflict (product_id, min_qty) do nothing;

with prod as (
  select p.id, p.retail_price_cents, p.base_price_cents
  from public.products p
)
insert into public.price_tiers (product_id, min_qty, unit_price_cents)
select p.id,
       10 as min_qty,
       -- mid tier: weighted between retail and base, rounded
       round((p.retail_price_cents * 0.7 + p.base_price_cents * 0.3))::int
         as unit_price_cents
from prod p
on conflict (product_id, min_qty) do nothing;

with prod as (
  select p.id, p.base_price_cents
  from public.products p
)
insert into public.price_tiers (product_id, min_qty, unit_price_cents)
select p.id,
       50 as min_qty,
       -- bulk tier: slight bump above base for handling, but still the best deal
       round(p.base_price_cents * 0.9)::int as unit_price_cents
from prod p
on conflict (product_id, min_qty) do nothing;
