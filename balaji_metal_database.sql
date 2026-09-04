-- ============================================================
--  Balaji Metal — Full Database Setup
--  Import this file in XAMPP phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS `balaji_metal`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `balaji_metal`;

-- ─── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','editor') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `category_id` INT,
  `short_description` VARCHAR(500),
  `description` TEXT,
  `features` JSON,
  `material` VARCHAR(200),
  `available_sizes` JSON,
  `is_published` BOOLEAN DEFAULT FALSE,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255),
  `is_featured` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `product_specifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `spec_key` VARCHAR(100) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `product_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `application` VARCHAR(200) NOT NULL,
  `industry` VARCHAR(200),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `company` VARCHAR(200),
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `subject` VARCHAR(100),
  `product_id` INT,
  `product_name` VARCHAR(200),
  `message` TEXT NOT NULL,
  `status` ENUM('new','contacted','completed') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `website_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT,
  `setting_group` VARCHAR(50) DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_token` (`token`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── SEED: Admin User ────────────────────────────────────────
-- Password: Admin@123 (bcrypt hashed)
INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'Balajimetal5302@gmail.com', '$2b$10$7oCkfuzQJ702Ye1cSTPet.Zyv34mzAiMeP6ABWGXLC1CODqUe7Ive', 'admin');

-- ─── SEED: Categories ────────────────────────────────────────
INSERT IGNORE INTO `categories` (`name`, `slug`, `description`) VALUES
('Couplings',   'couplings',   'Couplings category'),
('Pulleys',     'pulleys',     'Pulleys category'),
('Hand Wheels', 'hand-wheels', 'Hand Wheels category'),
('Accessories', 'accessories', 'Accessories category');

-- ─── SEED: Website Settings ──────────────────────────────────
INSERT IGNORE INTO `website_settings` (`setting_key`, `setting_value`) VALUES
('company_name',      'Balaji Metal'),
('company_tagline',   'Precision Engineering Solutions'),
('company_phone',     '+91-76000 60193'),
('company_phone_2',   '+91-70960 70727'),
('company_email',     'Balajimetal5302@gmail.com'),
('company_address',   'Survey No., Balaji Metal, P. 43/44, Main Road, Ta. Kotda Sangani, Veraval, Padavala, Gujarat - 360025'),
('company_whatsapp',  '+917600060193'),
('google_maps_embed', 'https://www.google.com/maps?q=Survey+No.%2C+Balaji+Metal%2C+P.+43%2F44%2C+Main+Road%2C+Ta.+Kotda+Sangani%2C+Veraval%2C+Padavala%2C+Gujarat+360025&output=embed'),
('business_hours',    'Mon-Sat: 9:00 AM - 7:00 PM');

-- ─── SEED: Sample Products ───────────────────────────────────
INSERT IGNORE INTO `products`
  (`name`, `slug`, `category_id`, `short_description`, `description`, `features`, `material`, `available_sizes`, `is_published`, `is_featured`)
VALUES
(
  'Pin Bush Coupling', 'pin-bush-coupling',
  (SELECT id FROM categories WHERE slug='couplings'),
  'High-performance flexible coupling engineered for reliable power transmission in heavy-duty industrial machinery.',
  'Pin Bush Coupling is a cushioned flexible coupling manufactured to absorb shock loads, damp torsional vibrations, and compensate for axial, radial, and angular misalignment between shafts.',
  '["High torque transmission","Torsional vibration dampening","Easy installation and maintenance","Durable rubber/polyurethane bushes","Fail-safe design"]',
  'Cast Iron (FG 220 / FG 250) / Mild Steel / EN8',
  '["Size 100","Size 125","Size 150","Size 200","Size 250","Size 300","Size 350","Size 400"]',
  TRUE, TRUE
),
(
  'Star Bush Coupling', 'star-bush-coupling',
  (SELECT id FROM categories WHERE slug='couplings'),
  'Versatile elastomeric star coupling offering exceptional vibration isolation and flexible misalignment handling.',
  'Star Bush Coupling (Spider Coupling) utilizes a high-grade elastomer star element inserted between two jaw hubs. Delivers maintenance-free, lubrication-free operation.',
  '["No lubrication required","Quick spider element replacement","Electrical insulation between shafts","Compact and lightweight","High temperature resistance"]',
  'Cast Iron / Aluminium / EN8 Steel',
  '["L-050","L-070","L-090","L-095","L-100","L-110","L-150","L-190","L-225"]',
  TRUE, TRUE
),
(
  'V-Belt Pulley', 'v-belt-pulley',
  (SELECT id FROM categories WHERE slug='pulleys'),
  'Precision-machined V-belt pulleys dynamically balanced for smooth energy transmission and extended belt life.',
  'Manufactured with high-grade cast iron and precision-turned grooves, our V-Belt Pulleys ensure precise belt fitment, minimal slippage, and maximum drive efficiency.',
  '["Dynamically balanced for vibration-free running","Standard Taper Lock Bush or Pilot Bore fitment","Accurate groove angle profile","High wear resistance","Corrosion-protective coating"]',
  'Cast Iron (Grade FG 200/250) / Ductile Iron',
  '["SPA (1 to 6 Grooves)","SPB (1 to 10 Grooves)","SPC (2 to 12 Grooves)","SPZ (1 to 6 Grooves)"]',
  TRUE, TRUE
),
(
  'Hand Wheel', 'hand-wheel',
  (SELECT id FROM categories WHERE slug='hand-wheels'),
  'Ergonomically designed precision-cast hand wheels for smooth, reliable manual control of industrial valves and machinery.',
  'Heavy-duty industrial hand wheels manufactured with precision casting and fine machining for smooth operation in gate valves, globe valves, sluice gates, lathes, and industrial control equipment.',
  '["Ergonomic grip contour","High tensile strength casting","Keyway or square bore option","Polished rim with powder-coated body","Revolving or fixed handle mounting available"]',
  'Cast Iron (FG 200) / Mild Steel / Stainless Steel (SS 304/316)',
  '["100mm (4\")","125mm (5\")","150mm (6\")","200mm (8\")","250mm (10\")","300mm (12\")","400mm (16\")","500mm (20\")"]',
  TRUE, TRUE
);

-- ─── SEED: Specifications ────────────────────────────────────
INSERT IGNORE INTO `product_specifications` (`product_id`, `spec_key`, `spec_value`, `sort_order`) VALUES
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Bore Range',     '12mm - 160mm',           1),
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Torque Rating',  '100 Nm - 15,000 Nm',    2),
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Max Speed',      '1,500 - 4,000 RPM',     3),
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Bush Material',  'Nitrile Rubber / Polyurethane', 4),

((SELECT id FROM products WHERE slug='star-bush-coupling'), 'Bore Range',    '9mm - 75mm',            1),
((SELECT id FROM products WHERE slug='star-bush-coupling'), 'Max Torque',    '12.5 Nm - 2,400 Nm',   2),
((SELECT id FROM products WHERE slug='star-bush-coupling'), 'Spider Material','NBR Rubber / Urethane / Hytrel', 3),

((SELECT id FROM products WHERE slug='v-belt-pulley'), 'Groove Profiles', 'SPA, SPB, SPC, SPZ, A, B, C', 1),
((SELECT id FROM products WHERE slug='v-belt-pulley'), 'PCD Range',       '50mm - 1250mm',           2),
((SELECT id FROM products WHERE slug='v-belt-pulley'), 'Bore Type',       'Pilot Bore / Taper Bush (1008 to 5050)', 3),
((SELECT id FROM products WHERE slug='v-belt-pulley'), 'Balancing',       'Static & Dynamic Balancing (ISO 1940 Grade G6.3)', 4),

((SELECT id FROM products WHERE slug='hand-wheel'), 'Outer Diameter', '50mm - 500mm',               1),
((SELECT id FROM products WHERE slug='hand-wheel'), 'Bore Options',   'Round Keyway / Square / Hexagon (10mm - 50mm)', 2),
((SELECT id FROM products WHERE slug='hand-wheel'), 'Material Options','CI / MS / Stainless Steel 304/316', 3),
((SELECT id FROM products WHERE slug='hand-wheel'), 'Surface Finish', 'Black Powder Coated / Chrome Plated / Polished Rim', 4),
((SELECT id FROM products WHERE slug='hand-wheel'), 'Design Types',   '2-Spoke, 3-Spoke, 4-Spoke, Solid Dish', 5);

-- ─── SEED: Applications ──────────────────────────────────────
INSERT IGNORE INTO `product_applications` (`product_id`, `application`, `industry`) VALUES
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Centrifugal Pumps & Compressors', 'Chemical & Process'),
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Conveyor Belt Drives',            'Mining & Cement'),
((SELECT id FROM products WHERE slug='pin-bush-coupling'), 'Generator Sets & Turbines',       'Power Generation'),

((SELECT id FROM products WHERE slug='star-bush-coupling'), 'Electric Motor Drives',          'Manufacturing'),
((SELECT id FROM products WHERE slug='star-bush-coupling'), 'Blowers & Fans',                 'HVAC & Industrial Automation'),

((SELECT id FROM products WHERE slug='v-belt-pulley'), 'Crusher Drives',                     'Mining & Construction'),
((SELECT id FROM products WHERE slug='v-belt-pulley'), 'Textile Loom Drives',                'Textile Machinery'),
((SELECT id FROM products WHERE slug='v-belt-pulley'), 'Agricultural Equipment',              'Agriculture & Farming'),

((SELECT id FROM products WHERE slug='hand-wheel'), 'Industrial Valve Control (Gate, Globe, Butterfly)', 'Oil & Gas, Chemical'),
((SELECT id FROM products WHERE slug='hand-wheel'), 'Machine Tool Adjustment (Lathe, Milling)',          'Manufacturing & Machining'),
((SELECT id FROM products WHERE slug='hand-wheel'), 'Sluice & Dam Gate Actuation',                       'Water & Waste Management');

-- ─── SEED: Default Product Images ──────────────────────────
-- These files are included in server/uploads/products/
INSERT INTO `product_images` (`product_id`, `filename`, `original_name`, `is_featured`, `sort_order`)
SELECT p.id, 'pin-bush-coupling.png', 'Pin Bush Coupling', TRUE, 1 FROM products p
WHERE p.slug = 'pin-bush-coupling'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.is_featured = TRUE);

INSERT INTO `product_images` (`product_id`, `filename`, `original_name`, `is_featured`, `sort_order`)
SELECT p.id, 'star-bush-coupling.png', 'Star Bush Coupling', TRUE, 2 FROM products p
WHERE p.slug = 'star-bush-coupling'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.is_featured = TRUE);

INSERT INTO `product_images` (`product_id`, `filename`, `original_name`, `is_featured`, `sort_order`)
SELECT p.id, 'v-belt-pulley.png', 'V-Belt Pulley', TRUE, 3 FROM products p
WHERE p.slug = 'v-belt-pulley'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.is_featured = TRUE);

INSERT INTO `product_images` (`product_id`, `filename`, `original_name`, `is_featured`, `sort_order`)
SELECT p.id, 'hand-wheel.png', 'Hand Wheel', TRUE, 4 FROM products p
WHERE p.slug = 'hand-wheel'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.is_featured = TRUE);

-- ─── Done ────────────────────────────────────────────────────
-- Admin Login: Balajimetal5302@gmail.com / Admin@123
