const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../config/mailer');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const [users] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    
    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role || 'editor']);
    
    res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: users[0] });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(oldPassword, users[0].password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNew, req.user.id]);
    
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    // Check if user exists
    const [users] = await pool.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Don't reveal if email exists or not (security)
      return res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing tokens for this email
    await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);

    // Store the reset token
    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, resetToken, expiresAt]
    );

    // Send the reset email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Find the token in DB and check if expired
    const [resets] = await pool.query(
      'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (resets.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token. Please request a new one.' });
    }

    const resetRecord = resets[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, resetRecord.email]);

    // Delete the used token
    await pool.query('DELETE FROM password_resets WHERE email = ?', [resetRecord.email]);

    res.status(200).json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

