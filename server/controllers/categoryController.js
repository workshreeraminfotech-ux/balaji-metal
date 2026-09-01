const { pool } = require('../config/database');
const slugify = require('slugify');

exports.getAll = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, created_at DESC');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.getActive = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, is_active, sort_order } = req.body;
    let slug = slugify(name, { lower: true, strict: true });
    
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description, is_active !== undefined ? is_active : 1, sort_order || 0]
    );
    res.status(201).json({ success: true, message: 'Category created', categoryId: result.insertId });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, is_active, sort_order } = req.body;
    let slug = slugify(name, { lower: true, strict: true });

    await pool.query(
      'UPDATE categories SET name = ?, slug = ?, description = ?, is_active = ?, sort_order = ? WHERE id = ?',
      [name, slug, description, is_active, sort_order, id]
    );
    res.status(200).json({ success: true, message: 'Category updated' });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [products] = await pool.query('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id]);
    if (products.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category in use by products' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
