const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // Only create if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not configured: EMAIL_USER and EMAIL_PASS missing in .env');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email notification to admin when a new inquiry is submitted
 */
const sendInquiryEmail = async (inquiryData) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('📧 Email skipped (not configured). Inquiry data:', inquiryData.name);
    return;
  }

  const { name, company, email, phone, subject, product_name, message } = inquiryData;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f4f6f8; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center; }
        .header h1 { color: #F97316; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header p { color: #94a3b8; margin: 8px 0 0; font-size: 14px; }
        .badge { display: inline-block; background: #F97316; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin: 16px 0; }
        .content { padding: 30px; }
        .info-grid { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .info-grid td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
        .info-grid td:first-child { color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 120px; }
        .info-grid td:last-child { color: #1e293b; font-size: 15px; }
        .message-box { background: #f8fafc; border-left: 4px solid #F97316; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
        .message-box p { color: #334155; line-height: 1.6; margin: 0; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
        .timestamp { color: #94a3b8; font-size: 12px; text-align: right; padding: 0 30px 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BALAJI METAL</h1>
          <p>Industrial Couplings & Pulleys</p>
          <span class="badge">🔔 New Inquiry Received</span>
        </div>
        <div class="content">
          <table class="info-grid">
            <tr><td>Customer</td><td><strong>${name}</strong></td></tr>
            ${company ? `<tr><td>Company</td><td>${company}</td></tr>` : ''}
            <tr><td>Email</td><td><a href="mailto:${email}" style="color:#F97316;">${email}</a></td></tr>
            ${phone ? `<tr><td>Phone</td><td><a href="tel:${phone}" style="color:#F97316;">${phone}</a></td></tr>` : ''}
            ${subject ? `<tr><td>Subject</td><td>${subject}</td></tr>` : ''}
            ${product_name ? `<tr><td>Product</td><td><strong>${product_name}</strong></td></tr>` : ''}
          </table>

          ${message ? `
          <h3 style="color:#1e293b; margin: 24px 0 8px; font-size: 15px;">📝 Customer Message</h3>
          <div class="message-box">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
        </div>
        <p class="timestamp">Received: ${timestamp}</p>
        <div class="footer">
          <p>This email was sent automatically from your Balaji Metal website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Balaji Metal Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🔔 New Inquiry${product_name ? ` - ${product_name}` : ''} | Balaji Metal`,
    html: htmlContent,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Inquiry notification sent to ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error('❌ Failed to send inquiry email:', error.message);
    // Don't throw — email failure should not block inquiry submission
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('📧 Password reset email skipped (not configured)');
    return false;
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f4f6f8; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center; }
        .header h1 { color: #F97316; margin: 0; font-size: 24px; }
        .content { padding: 30px; text-align: center; }
        .content p { color: #475569; font-size: 15px; line-height: 1.7; }
        .btn { display: inline-block; background: #F97316; color: white !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .note { color: #94a3b8; font-size: 13px; margin-top: 24px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BALAJI METAL</h1>
        </div>
        <div class="content">
          <h2 style="color:#1e293b;">Password Reset Request</h2>
          <p>You requested a password reset for your Balaji Metal admin account. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p class="note">This link is valid for <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>Balaji Metal — Industrial Couplings & Pulleys</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Balaji Metal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔑 Password Reset — Balaji Metal Admin',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    return false;
  }
};

module.exports = { sendInquiryEmail, sendPasswordResetEmail };
