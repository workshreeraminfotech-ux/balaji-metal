const { pool } = require('../config/database');

exports.generateSitemap = async (req, res, next) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://balajimetal.co';

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/products', priority: '0.9', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    // Dynamic product pages from DB
    const [products] = await pool.query(
      'SELECT slug, updated_at FROM products WHERE is_published = 1 ORDER BY sort_order ASC'
    );

    const productPages = products.map(p => ({
      url: `/products/${p.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    const allPages = [...staticPages, ...productPages];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    allPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      if (page.lastmod) xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
};
