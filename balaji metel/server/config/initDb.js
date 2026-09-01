const { pool, rootPool } = require('./database');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    // Create database using root pool (no DB specified)
    const rootConn = await rootPool.getConnection();
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    rootConn.release();

    // Now use the main pool (which targets the DB) for tables
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(120) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(220) NOT NULL UNIQUE,
        category_id INT,
        short_description VARCHAR(500),
        description TEXT,
        features JSON,
        material VARCHAR(200),
        available_sizes JSON,
        is_published BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_specifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        spec_key VARCHAR(100) NOT NULL,
        spec_value VARCHAR(255) NOT NULL,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        application VARCHAR(200) NOT NULL,
        industry VARCHAR(200),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        company VARCHAR(200),
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(100),
        product_id INT,
        product_name VARCHAR(200),
        message TEXT NOT NULL,
        status ENUM('new', 'contacted', 'completed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // Backfill: add the `subject` column for databases created before this field existed.
    const [subjectColumnRows] = await connection.query(`
      SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'subject'
    `);
    if (subjectColumnRows[0].cnt === 0) {
      await connection.query(`ALTER TABLE inquiries ADD COLUMN subject VARCHAR(100) AFTER phone`);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS website_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_group VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_email (email)
      )
    `);

    // Seed/Update Admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', ['Balajimetal5302@gmail.com']);
    if (users.length === 0) {
      await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin', 'Balajimetal5302@gmail.com', hashedPassword, 'admin']);
    } else {
      await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'Balajimetal5302@gmail.com']);
    }

    // Seed Categories
    const categories = ['Couplings', 'Pulleys', 'Hand Wheels', 'Accessories'];
    for (const cat of categories) {
      const slug = cat.toLowerCase().replace(/\s+/g, '-');
      const [existingCat] = await connection.query('SELECT * FROM categories WHERE slug = ?', [slug]);
      if (existingCat.length === 0) {
        await connection.query('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [cat, slug, `${cat} category`]);
      }
    }

    // Seed Website Settings
    const defaultSettings = {
      company_name: 'Balaji Metal',
      company_tagline: 'Precision Engineering Solutions',
      company_phone: '+91-76000 60193',
      company_phone_2: '+91-70960 70727',
      company_email: 'Balajimetal5302@gmail.com',
      company_address: 'Survey No., Balaji Metal, P. 43/44, Main Road, Ta. Kotda Sangani, Veraval, Padavala, Gujarat - 360025',
      company_whatsapp: '+917600060193',
      google_maps_embed: 'https://www.google.com/maps?q=Survey+No.%2C+Balaji+Metal%2C+P.+43%2F44%2C+Main+Road%2C+Ta.+Kotda+Sangani%2C+Veraval%2C+Padavala%2C+Gujarat+360025&output=embed',
      business_hours: 'Mon-Sat: 9:00 AM - 7:00 PM'
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await connection.query('INSERT IGNORE INTO website_settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
    }

    // Seed Products
    const [existingProducts] = await connection.query('SELECT * FROM products LIMIT 1');
    if (existingProducts.length === 0) {
      const [couplings] = await connection.query('SELECT id FROM categories WHERE slug = ?', ['couplings']);
      const [pulleys] = await connection.query('SELECT id FROM categories WHERE slug = ?', ['pulleys']);
      
      const couplingId = couplings[0]?.id;
      const pulleyId = pulleys[0]?.id;

      if (couplingId) {
        const [prod1] = await connection.query(
          'INSERT INTO products (name, slug, category_id, short_description, description, features, material, available_sizes, is_published, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [
            'Pin Bush Coupling', 
            'pin-bush-coupling', 
            couplingId, 
            'High-performance flexible coupling engineered for reliable power transmission in heavy-duty industrial machinery.',
            'Pin Bush Coupling is a cushioned flexible coupling manufactured to absorb shock loads, damp torsional vibrations, and compensate for axial, radial, and angular misalignment between shafts. Ideal for heavy machinery drives.', 
            JSON.stringify(['High torque transmission', 'Torsional vibration dampening', 'Easy installation and maintenance', 'Durable rubber/polyurethane bushes', 'Fail-safe design']),
            'Cast Iron (FG 220 / FG 250) / Mild Steel / EN8', 
            JSON.stringify(['Size 100', 'Size 125', 'Size 150', 'Size 200', 'Size 250', 'Size 300', 'Size 350', 'Size 400']),
            true, 
            true
          ]
        );
        
        await connection.query(
          'INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)', 
          [
            prod1.insertId, 'Bore Range', '12mm - 160mm', 1, 
            prod1.insertId, 'Torque Rating', '100 Nm - 15,000 Nm', 2, 
            prod1.insertId, 'Max Speed', '1,500 - 4,000 RPM', 3, 
            prod1.insertId, 'Bush Material', 'Nitrile Rubber / Polyurethane', 4
          ]
        );

        await connection.query(
          'INSERT INTO product_applications (product_id, application, industry) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)', 
          [
            prod1.insertId, 'Centrifugal Pumps & Compressors', 'Chemical & Process',
            prod1.insertId, 'Conveyor Belt Drives', 'Mining & Cement',
            prod1.insertId, 'Generator Sets & Turbines', 'Power Generation'
          ]
        );

        const [prod2] = await connection.query(
          'INSERT INTO products (name, slug, category_id, short_description, description, features, material, available_sizes, is_published, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [
            'Star Bush Coupling', 
            'star-bush-coupling', 
            couplingId, 
            'Versatile elastomeric star coupling offering exceptional vibration isolation and flexible misalignment handling.',
            'Star Bush Coupling (Spider Coupling) utilizes a high-grade elastomer star element inserted between two jaw hubs. It delivers maintenance-free, lubrication-free operation with superior torsional flexibility.', 
            JSON.stringify(['No lubrication required', 'Quick spider element replacement', 'Electrical insulation between shafts', 'Compact and lightweight', 'High temperature resistance']),
            'Cast Iron / Aluminium / EN8 Steel', 
            JSON.stringify(['L-050', 'L-070', 'L-090', 'L-095', 'L-100', 'L-110', 'L-150', 'L-190', 'L-225']),
            true, 
            true
          ]
        );

        await connection.query(
          'INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)', 
          [
            prod2.insertId, 'Bore Range', '9mm - 75mm', 1, 
            prod2.insertId, 'Max Torque', '12.5 Nm - 2,400 Nm', 2, 
            prod2.insertId, 'Spider Material', 'NBR Rubber / Urethane / Hytrel', 3
          ]
        );

        await connection.query(
          'INSERT INTO product_applications (product_id, application, industry) VALUES (?, ?, ?), (?, ?, ?)', 
          [
            prod2.insertId, 'Electric Motor Drives', 'Manufacturing',
            prod2.insertId, 'Blowers & Fans', 'HVAC & Industrial Automation'
          ]
        );
      }

      if (pulleyId) {
        const [prod3] = await connection.query(
          'INSERT INTO products (name, slug, category_id, short_description, description, features, material, available_sizes, is_published, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [
            'V-Belt Pulley', 
            'v-belt-pulley', 
            pulleyId, 
            'Precision-machined V-belt pulleys dynamically balanced for smooth energy transmission and extended belt life.',
            'Manufactured with high-grade cast iron and CNC-turned grooves, our V-Belt Pulleys ensure precise belt fitment, minimal slippage, and maximum drive efficiency across SPA, SPB, SPC, and SPZ belt profiles.', 
            JSON.stringify(['Dynamically balanced for vibration-free running', 'Standard Taper Lock Bush or Pilot Bore fitment', 'Accurate groove angle profile', 'High wear resistance', 'Corrosion-protective coating']),
            'Cast Iron (Grade FG 200/250) / Ductile Iron', 
            JSON.stringify(['SPA (1 to 6 Grooves)', 'SPB (1 to 10 Grooves)', 'SPC (2 to 12 Grooves)', 'SPZ (1 to 6 Grooves)']),
            true, 
            true
          ]
        );

        await connection.query(
          'INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)', 
          [
            prod3.insertId, 'Groove Profiles', 'SPA, SPB, SPC, SPZ, A, B, C', 1, 
            prod3.insertId, 'PCD Range', '50mm - 1250mm', 2, 
            prod3.insertId, 'Bore Type', 'Pilot Bore / Taper Bush (1008 to 5050)', 3, 
            prod3.insertId, 'Balancing', 'Static & Dynamic Balancing (ISO 1940 Grade G6.3)', 4
          ]
        );

        await connection.query(
          'INSERT INTO product_applications (product_id, application, industry) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)', 
          [
            prod3.insertId, 'Crusher Drives', 'Mining & Construction',
            prod3.insertId, 'Textile Loom Drives', 'Textile Machinery',
            prod3.insertId, 'Agricultural Equipment', 'Agriculture & Farming'
          ]
        );
      }

      // Hand Wheel
      const [handWheels] = await connection.query('SELECT id FROM categories WHERE slug = ?', ['hand-wheels']);
      const handWheelId = handWheels[0]?.id;
      if (handWheelId) {
        const [prod4] = await connection.query(
          'INSERT INTO products (name, slug, category_id, short_description, description, features, material, available_sizes, is_published, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [
            'Hand Wheel', 
            'hand-wheel', 
            handWheelId, 
            'Ergonomically designed precision-cast hand wheels for smooth, reliable manual control of industrial valves and machinery.', 
            'Heavy-duty industrial hand wheels manufactured with precision casting and fine machining for smooth operation in gate valves, globe valves, sluice gates, lathes, and industrial control equipment. Available in solid, spoke, revolving handle, and dish patterns with polished rim or powder-coated finish for superior ergonomics and corrosion resistance.', 
            JSON.stringify(['Ergonomic grip contour', 'High tensile strength casting', 'Keyway or square bore option', 'Polished rim with powder-coated body', 'Revolving or fixed handle mounting available']),
            'Cast Iron (FG 200) / Mild Steel / Stainless Steel (SS 304/316)', 
            JSON.stringify(['100mm (4")', '125mm (5")', '150mm (6")', '200mm (8")', '250mm (10")', '300mm (12")', '400mm (16")', '500mm (20")']),
            true, 
            true
          ]
        );

        await connection.query(
          'INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)', 
          [
            prod4.insertId, 'Outer Diameter', '50mm - 500mm', 1, 
            prod4.insertId, 'Bore Options', 'Round Keyway / Square / Hexagon (10mm - 50mm)', 2, 
            prod4.insertId, 'Material Options', 'CI / MS / Stainless Steel 304/316', 3, 
            prod4.insertId, 'Surface Finish', 'Black Powder Coated / Chrome Plated / Polished Rim', 4, 
            prod4.insertId, 'Design Types', '2-Spoke, 3-Spoke, 4-Spoke, Solid Dish', 5
          ]
        );

        await connection.query(
          'INSERT INTO product_applications (product_id, application, industry) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)', 
          [
            prod4.insertId, 'Industrial Valve Control (Gate, Globe, Butterfly)', 'Oil & Gas, Chemical', 
            prod4.insertId, 'Machine Tool Adjustment (Lathe, Milling)', 'Manufacturing & Machining', 
            prod4.insertId, 'Sluice & Dam Gate Actuation', 'Water & Waste Management'
          ]
        );
      }
    }

    // Seed default product images so guest catalogue and admin product manager
    // both show a relevant image immediately after database initialization.
    const defaultProductImages = [
      ['pin-bush-coupling', 'pin-bush-coupling.png', 'Pin Bush Coupling', 1],
      ['star-bush-coupling', 'star-bush-coupling.png', 'Star Bush Coupling', 2],
      ['v-belt-pulley', 'v-belt-pulley.png', 'V-Belt Pulley', 3],
      ['hand-wheel', 'hand-wheel.png', 'Hand Wheel', 4]
    ];

    for (const [slug, filename, originalName, sortOrder] of defaultProductImages) {
      const [productRows] = await connection.query('SELECT id FROM products WHERE slug = ? LIMIT 1', [slug]);
      if (!productRows.length) continue;

      const [imageRows] = await connection.query(
        'SELECT id FROM product_images WHERE product_id = ? AND is_featured = 1 LIMIT 1',
        [productRows[0].id]
      );

      if (!imageRows.length) {
        await connection.query(
          'INSERT INTO product_images (product_id, filename, original_name, is_featured, sort_order) VALUES (?, ?, ?, TRUE, ?)',
          [productRows[0].id, filename, originalName, sortOrder]
        );
      }
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

module.exports = initDatabase;
