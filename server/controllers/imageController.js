const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

exports.upload = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const insertedIds = [];
    for (let file of files) {
      const [result] = await pool.query(
        'INSERT INTO product_images (product_id, filename, original_name) VALUES (?, ?, ?)',
        [productId, file.filename, file.originalname]
      );
      insertedIds.push(result.insertId);
    }

    const [newImages] = await pool.query(
      'SELECT * FROM product_images WHERE id IN (?) ORDER BY id ASC',
      [insertedIds]
    );

    res.status(201).json({ success: true, message: 'Images uploaded successfully', data: newImages });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [images] = await pool.query('SELECT filename FROM product_images WHERE id = ?', [id]);
    
    if (images.length > 0) {
      const filePath = path.join(__dirname, '../uploads/products/', images[0].filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await pool.query('DELETE FROM product_images WHERE id = ?', [id]);
    }
    
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

exports.reorder = async (req, res, next) => {
  try {
    const { imageIds } = req.body; // Array of IDs in new order
    if (Array.isArray(imageIds)) {
      for (let i = 0; i < imageIds.length; i++) {
        await pool.query('UPDATE product_images SET sort_order = ? WHERE id = ?', [i, imageIds[i]]);
      }
    }
    res.status(200).json({ success: true, message: 'Images reordered' });
  } catch (error) {
    next(error);
  }
};

exports.setFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [img] = await pool.query('SELECT product_id FROM product_images WHERE id = ?', [id]);
    if (img.length > 0) {
      const productId = img[0].product_id;
      await pool.query('UPDATE product_images SET is_featured = 0 WHERE product_id = ?', [productId]);
      await pool.query('UPDATE product_images SET is_featured = 1 WHERE id = ?', [id]);
    }
    res.status(200).json({ success: true, message: 'Featured image updated' });
  } catch (error) {
    next(error);
  }
};
