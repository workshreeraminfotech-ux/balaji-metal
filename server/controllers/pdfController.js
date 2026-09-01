const { pool } = require('../config/database');
const PDFDocument = require('pdfkit');

exports.generateQuotePdf = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [inquiries] = await pool.query('SELECT * FROM inquiries WHERE id = ?', [id]);

    if (inquiries.length === 0) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const inquiry = inquiries[0];
    const refNumber = `BM-${new Date().getFullYear()}-${String(inquiry.id).padStart(4, '0')}`;
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
      info: {
        Title: `Quotation ${refNumber} - Balaji Metal`,
        Author: 'Balaji Metal',
      }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Quotation-${refNumber}.pdf`);

    doc.pipe(res);

    // Colors
    const navy = '#0f172a';
    const orange = '#F97316';
    const gray = '#64748b';
    const lightGray = '#f1f5f9';

    // ======== HEADER ========
    doc.rect(0, 0, doc.page.width, 130).fill(navy);

    doc.fontSize(28).fill('#ffffff').font('Helvetica-Bold')
      .text('BALAJI METAL', 60, 35);

    doc.fontSize(11).fill(orange).font('Helvetica')
      .text('Industrial Couplings & Pulleys', 60, 68);

    doc.fontSize(9).fill('#94a3b8').font('Helvetica')
      .text('Rajkot, Gujarat, India  |  +91 76000 60193  |  Balajimetal5302@gmail.com', 60, 90);

    // Orange accent line
    doc.rect(0, 130, doc.page.width, 4).fill(orange);

    // ======== QUOTATION TITLE ========
    doc.fontSize(22).fill(navy).font('Helvetica-Bold')
      .text('QUOTATION', 60, 160);

    doc.fontSize(10).fill(gray).font('Helvetica')
      .text(`Ref: ${refNumber}`, 60, 188)
      .text(`Date: ${currentDate}`, 60, 204);

    // ======== DIVIDER ========
    doc.moveTo(60, 228).lineTo(doc.page.width - 60, 228).stroke('#e2e8f0');

    // ======== CUSTOMER DETAILS ========
    let y = 248;
    doc.fontSize(11).fill(orange).font('Helvetica-Bold')
      .text('BILL TO:', 60, y);
    y += 22;

    doc.fontSize(11).fill(navy).font('Helvetica-Bold')
      .text(inquiry.name || 'N/A', 60, y);
    y += 18;

    if (inquiry.company) {
      doc.fontSize(10).fill(gray).font('Helvetica')
        .text(inquiry.company, 60, y);
      y += 16;
    }

    doc.fontSize(10).fill(gray).font('Helvetica')
      .text(`Email: ${inquiry.email || 'N/A'}`, 60, y);
    y += 16;

    if (inquiry.phone) {
      doc.fontSize(10).fill(gray).font('Helvetica')
        .text(`Phone: ${inquiry.phone}`, 60, y);
      y += 16;
    }

    y += 16;

    // ======== PRODUCT TABLE ========
    const tableTop = y;
    const tableWidth = doc.page.width - 120;
    const col1 = 60;
    const col2 = 300;

    // Table header
    doc.rect(col1, tableTop, tableWidth, 32).fill(navy);
    doc.fontSize(10).fill('#ffffff').font('Helvetica-Bold')
      .text('DESCRIPTION', col1 + 12, tableTop + 10)
      .text('DETAILS', col2 + 12, tableTop + 10);

    // Table rows
    const rows = [
      ['Product', inquiry.product_name || 'As discussed'],
      ['Quantity', 'As per your requirement'],
      ['Delivery', '7-10 working days (approx.)'],
      ['Payment Terms', 'To be discussed'],
      ['Quotation Validity', '30 days from date of issue'],
    ];

    let rowY = tableTop + 32;
    rows.forEach((row, idx) => {
      const bgColor = idx % 2 === 0 ? lightGray : '#ffffff';
      doc.rect(col1, rowY, tableWidth, 28).fill(bgColor);

      doc.fontSize(10).fill(navy).font('Helvetica-Bold')
        .text(row[0], col1 + 12, rowY + 8);
      doc.fontSize(10).fill(gray).font('Helvetica')
        .text(row[1], col2 + 12, rowY + 8);

      rowY += 28;
    });

    // Table border
    doc.rect(col1, tableTop, tableWidth, rowY - tableTop).stroke('#e2e8f0');

    // ======== CUSTOMER MESSAGE ========
    if (inquiry.message) {
      rowY += 24;
      doc.fontSize(11).fill(orange).font('Helvetica-Bold')
        .text('CUSTOMER NOTES:', col1, rowY);
      rowY += 20;

      doc.rect(col1, rowY, tableWidth, 2).fill('#e2e8f0');
      rowY += 10;

      doc.fontSize(10).fill(gray).font('Helvetica')
        .text(`"${inquiry.message}"`, col1, rowY, { width: tableWidth, align: 'left' });

      rowY += doc.heightOfString(`"${inquiry.message}"`, { width: tableWidth }) + 10;
    }

    // ======== TERMS & CONDITIONS ========
    rowY += 24;
    doc.fontSize(11).fill(navy).font('Helvetica-Bold')
      .text('Terms & Conditions:', col1, rowY);
    rowY += 20;

    const terms = [
      'Prices are ex-factory Rajkot unless otherwise stated.',
      'GST and transportation charges extra as applicable.',
      'Delivery timeline starts after order confirmation and advance receipt.',
      'Quality as per industry standards. Custom specifications on request.',
      'This quotation is subject to our final confirmation.',
    ];

    terms.forEach((term, idx) => {
      doc.fontSize(9).fill(gray).font('Helvetica')
        .text(`${idx + 1}. ${term}`, col1 + 8, rowY, { width: tableWidth - 8 });
      rowY += 16;
    });

    // ======== SIGNATURE ========
    rowY += 30;
    doc.moveTo(col1, rowY).lineTo(200, rowY).stroke('#e2e8f0');
    rowY += 8;
    doc.fontSize(10).fill(navy).font('Helvetica-Bold')
      .text('For Balaji Metal', col1, rowY);
    rowY += 16;
    doc.fontSize(9).fill(gray).font('Helvetica')
      .text('Authorized Signatory', col1, rowY);

    // ======== FOOTER ========
    const footerY = doc.page.height - 60;
    doc.rect(0, footerY, doc.page.width, 60).fill(navy);
    doc.fontSize(8).fill('#94a3b8').font('Helvetica')
      .text('Balaji Metal  |  Rajkot, Gujarat, India  |  +91 76000 60193  |  Balajimetal5302@gmail.com', 0, footerY + 22, {
        width: doc.page.width,
        align: 'center'
      });

    doc.end();
  } catch (error) {
    next(error);
  }
};
