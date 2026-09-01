const { pool } = require('../config/database');
const { sendInquiryEmail } = require('../config/mailer');

exports.create = async (req, res, next) => {
  try {
    const { name, company, email, phone, subject, product_id, product_name, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    await pool.query(
      'INSERT INTO inquiries (name, company, email, phone, subject, product_id, product_name, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, company, email, phone, subject || null, product_id || null, product_name, message]
    );

    // Send email notification to admin (fire-and-forget, won't block response)
    sendInquiryEmail({ name, company, email, phone, subject, product_name, message }).catch(err => {
      console.error('Email notification failed:', err.message);
    });

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status;

    let baseQuery = 'FROM inquiries WHERE 1=1';
    const params = [];

    if (search) {
      baseQuery += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      baseQuery += ' AND status = ?';
      params.push(status);
    }

    const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT * ${baseQuery}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [inquiries] = await pool.query(dataQuery, [...params, limit, offset]);

    res.status(200).json({ 
      success: true, 
      data: inquiries,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [inquiries] = await pool.query('SELECT * FROM inquiries WHERE id = ?', [id]);
    
    if (inquiries.length === 0) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    
    res.status(200).json({ success: true, data: inquiries[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const [inquiries] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');

    // CSV header
    const headers = ['Date', 'Customer Name', 'Company', 'Email', 'Phone', 'Subject', 'Product', 'Message', 'Status'];
    
    // Escape CSV values
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = inquiries.map(i => [
      i.created_at ? new Date(i.created_at).toLocaleDateString('en-IN') : '',
      escapeCsv(i.name),
      escapeCsv(i.company),
      escapeCsv(i.email),
      escapeCsv(i.phone),
      escapeCsv(i.subject),
      escapeCsv(i.product_name),
      escapeCsv(i.message),
      escapeCsv(i.status),
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
