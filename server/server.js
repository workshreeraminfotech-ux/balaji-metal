require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const initDatabase = require('./config/initDb');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const imageRoutes = require('./routes/images');
const inquiryRoutes = require('./routes/inquiries');
const settingsRoutes = require('./routes/settings');
const dashboardRoutes = require('./routes/dashboard');
const sitemapController = require('./controllers/sitemapController');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any localhost port
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Dynamic Sitemap
app.get('/api/sitemap', sitemapController.generateSitemap);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize DB and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('⚠️  Database init failed (is MySQL running?):', err.message);
    // Still start the server so frontend can load
    app.listen(PORT, () => {
      console.log(`⚠️  Server running on port ${PORT} — but DB is not connected!`);
    });
  });
