const { pool } = require('../config/database');

exports.getStats = async (req, res, next) => {
  try {
    const [productsCount] = await pool.query('SELECT COUNT(*) as total FROM products');
    const [inquiriesCount] = await pool.query('SELECT COUNT(*) as total FROM inquiries');
    const [newInquiriesCount] = await pool.query('SELECT COUNT(*) as total FROM inquiries WHERE status = "new"');
    const [recentInquiries] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 10');

    res.status(200).json({
      success: true,
      data: {
        totalProducts: productsCount[0].total,
        totalInquiries: inquiriesCount[0].total,
        newInquiries: newInquiriesCount[0].total,
        recentInquiries: recentInquiries
      }
    });
  } catch (error) {
    next(error);
  }
};
