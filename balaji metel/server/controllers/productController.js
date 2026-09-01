const { pool } = require('../config/database');
const slugify = require('slugify');

exports.getAllProducts = async (req, res, next) => {
  try {
    const query = `
      SELECT p.*, c.name as category_name, 
        (SELECT filename FROM product_images pi WHERE pi.product_id = p.id AND pi.is_featured = 1 LIMIT 1) as featured_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const [products] = await pool.query(query);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getPublishedProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category_id = req.query.category_id;

    let baseQuery = 'FROM products p WHERE p.is_published = 1';
    const params = [];

    if (search) {
      baseQuery += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }

    if (category_id) {
      baseQuery += ' AND p.category_id = ?';
      params.push(category_id);
    }

    const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT p.*, 
        (SELECT filename FROM product_images pi WHERE pi.product_id = p.id AND pi.is_featured = 1 LIMIT 1) as featured_image
      ${baseQuery}
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [products] = await pool.query(dataQuery, [...params, limit, offset]);

    res.status(200).json({ 
      success: true, 
      data: products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?`, [id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC', [product.id]);
    const [specs] = await pool.query('SELECT * FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC', [product.id]);
    const [applications] = await pool.query('SELECT * FROM product_applications WHERE product_id = ?', [product.id]);

    product.images = images;
    product.specifications = specs;
    product.applications = applications;

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = ?`, [slug]);
      
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const product = products[0];
    
    const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC', [product.id]);
    const [specs] = await pool.query('SELECT * FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC', [product.id]);
    const [applications] = await pool.query('SELECT * FROM product_applications WHERE product_id = ?', [product.id]);

    product.images = images;
    product.specifications = specs;
    product.applications = applications;

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { name, category_id, short_description, description, features, material, available_sizes, is_published, is_featured, specifications, applications } = req.body;
    
    let slug = slugify(name, { lower: true, strict: true });
    
    const [result] = await conn.query(`
      INSERT INTO products (name, slug, category_id, short_description, description, features, material, available_sizes, is_published, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, category_id || null, short_description, description, features ? JSON.stringify(features) : null, material, available_sizes ? JSON.stringify(available_sizes) : null, is_published ? 1 : 0, is_featured ? 1 : 0]
    );
    
    const productId = result.insertId;

    if (specifications && Array.isArray(specifications)) {
      for (let i = 0; i < specifications.length; i++) {
        await conn.query('INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)', [productId, specifications[i].spec_key, specifications[i].spec_value, i]);
      }
    }

    if (applications && Array.isArray(applications)) {
      for (let app of applications) {
        await conn.query('INSERT INTO product_applications (product_id, application, industry) VALUES (?, ?, ?)', [productId, app.application, app.industry]);
      }
    }

    await conn.commit();
    res.status(201).json({ success: true, message: 'Product created', productId, data: { id: productId } });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

exports.updateProduct = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { name, category_id, short_description, description, features, material, available_sizes, is_published, is_featured, specifications, applications } = req.body;
    
    await conn.beginTransaction();

    await conn.query(`
      UPDATE products 
      SET name = ?, category_id = ?, short_description = ?, description = ?, features = ?, material = ?, available_sizes = ?, is_published = ?, is_featured = ?
      WHERE id = ?`,
      [name, category_id || null, short_description, description, features ? JSON.stringify(features) : null, material, available_sizes ? JSON.stringify(available_sizes) : null, is_published ? 1 : 0, is_featured ? 1 : 0, id]
    );

    if (specifications) {
      await conn.query('DELETE FROM product_specifications WHERE product_id = ?', [id]);
      for (let i = 0; i < specifications.length; i++) {
        await conn.query('INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)', [id, specifications[i].spec_key, specifications[i].spec_value, i]);
      }
    }

    if (applications) {
      await conn.query('DELETE FROM product_applications WHERE product_id = ?', [id]);
      for (let app of applications) {
        await conn.query('INSERT INTO product_applications (product_id, application, industry) VALUES (?, ?, ?)', [id, app.application, app.industry]);
      }
    }

    await conn.commit();
    res.status(200).json({ success: true, message: 'Product updated' });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');
    
    const [images] = await pool.query('SELECT filename FROM product_images WHERE product_id = ?', [id]);
    for (const img of images) {
      const filePath = path.join(__dirname, '../uploads/products/', img.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

exports.togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET is_published = NOT is_published WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT id, is_published FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Publish status toggled', data: rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET is_featured = NOT is_featured WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT id, is_featured FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Featured status toggled', data: rows[0] });
  } catch (error) {
    next(error);
  }
};
