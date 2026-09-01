import { storageService } from '@/utils/storageService';

// Standalone Mock API adapter that satisfies any legacy api.* call
const mockApi = {
  get: async (url, config = {}) => {
    const cleanUrl = url.replace(/^\/api/, '');
    
    // Auth check
    if (cleanUrl.startsWith('/auth/me')) {
      const user = storageService.getAuthUser();
      if (user) {
        return { data: { success: true, user } };
      }
      return Promise.reject({ response: { status: 401, data: { message: 'Unauthorized' } } });
    }

    // CSV Export
    if (cleanUrl.startsWith('/inquiries/export/csv')) {
      const inquiries = storageService.getInquiries();
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Product', 'Quantity', 'Status', 'Date', 'Message'];
      const rows = inquiries.map(i => [
        i.id,
        `"${i.name || ''}"`,
        `"${i.email || ''}"`,
        `"${i.phone || ''}"`,
        `"${i.company_name || ''}"`,
        `"${i.product_interest || i.product_name || ''}"`,
        `"${i.quantity || ''}"`,
        `"${i.status || ''}"`,
        `"${i.created_at || ''}"`,
        `"${(i.message || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      return { data: csvContent };
    }

    // PDF Export
    if (cleanUrl.includes('/pdf')) {
      return { data: new Blob(['Quotation PDF Document'], { type: 'application/pdf' }) };
    }

    // Single Product
    if (cleanUrl.startsWith('/products/slug/')) {
      const slug = cleanUrl.replace('/products/slug/', '');
      const product = storageService.getProductBySlug(slug);
      if (product) return { data: { success: true, data: { product } } };
      return Promise.reject({ response: { status: 404, data: { message: 'Product not found' } } });
    }

    if (cleanUrl.match(/^\/products\/(\d+)$/)) {
      const id = cleanUrl.match(/^\/products\/(\d+)$/)[1];
      const product = storageService.getProductById(id);
      if (product) return { data: { success: true, data: product } };
      return Promise.reject({ response: { status: 404, data: { message: 'Product not found' } } });
    }

    // Products List
    if (cleanUrl.startsWith('/products')) {
      let products = storageService.getProducts();
      const params = config.params || {};
      if (params.category_id && params.category_id !== 'all') {
        products = products.filter(p => String(p.category_id) === String(params.category_id) || p.category_slug === params.category_id);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        products = products.filter(p => 
          p.name?.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q)
        );
      }
      return { data: { success: true, data: products, pagination: { total: products.length, page: 1, pages: 1 } } };
    }

    // Categories
    if (cleanUrl.startsWith('/categories')) {
      const categories = storageService.getCategories();
      return { data: { success: true, data: categories } };
    }

    // Settings
    if (cleanUrl.startsWith('/settings')) {
      const settings = storageService.getSettings();
      return { data: { success: true, data: settings } };
    }

    // Inquiries
    if (cleanUrl.startsWith('/inquiries')) {
      let inquiries = storageService.getInquiries();
      const params = config.params || {};
      if (params.search) {
        const q = params.search.toLowerCase();
        inquiries = inquiries.filter(i => 
          i.name?.toLowerCase().includes(q) || 
          i.email?.toLowerCase().includes(q) || 
          i.phone?.toLowerCase().includes(q) || 
          i.company_name?.toLowerCase().includes(q)
        );
      }
      if (params.status) {
        inquiries = inquiries.filter(i => i.status === params.status);
      }
      return { data: { success: true, data: inquiries, pagination: { total: inquiries.length, page: 1, pages: 1 } } };
    }

    // Dashboard stats
    if (cleanUrl.startsWith('/dashboard/stats') || cleanUrl.startsWith('/dashboard')) {
      const stats = storageService.getStats();
      return { data: { success: true, data: stats } };
    }

    // Users
    if (cleanUrl.startsWith('/users')) {
      return { data: { success: true, data: [{ id: 1, name: 'Balaji Administrator', email: 'admin@balajimetal.com', role: 'admin', created_at: new Date().toISOString() }] } };
    }

    return { data: { success: true, data: [] } };
  },

  post: async (url, body = {}) => {
    const cleanUrl = url.replace(/^\/api/, '');

    // Login
    if (cleanUrl.startsWith('/auth/login')) {
      const res = storageService.login(body.email, body.password);
      return { data: res };
    }

    // Forgot / Reset password
    if (cleanUrl.startsWith('/auth/forgot-password') || cleanUrl.startsWith('/auth/reset-password')) {
      return { data: { success: true, message: 'Password updated successfully' } };
    }

    // Add product
    if (cleanUrl.startsWith('/products')) {
      const product = storageService.saveProduct(body);
      const created = storageService.getProductById(product[0]?.id || product.id);
      return { data: { success: true, data: created || product[0] || product } };
    }

    // Add category
    if (cleanUrl.startsWith('/categories')) {
      const category = storageService.saveCategory(body);
      return { data: { success: true, data: category } };
    }

    // Submit inquiry
    if (cleanUrl.startsWith('/inquiries')) {
      const inquiry = storageService.addInquiry(body);
      return { data: { success: true, data: inquiry, message: 'Inquiry submitted successfully' } };
    }

    // Upload image
    if (cleanUrl.startsWith('/images/')) {
      return {
        data: {
          success: true,
          data: [{ id: Date.now(), filename: '/images/products/pin-bush-coupling.jpg', is_featured: false }]
        }
      };
    }

    // Users
    if (cleanUrl.startsWith('/users')) {
      return { data: { success: true, data: { id: Date.now(), ...body } } };
    }

    return { data: { success: true } };
  },

  put: async (url, body = {}) => {
    const cleanUrl = url.replace(/^\/api/, '');

    if (cleanUrl.startsWith('/products/')) {
      const id = cleanUrl.replace('/products/', '');
      const product = storageService.saveProduct({ ...body, id });
      return { data: { success: true, data: product } };
    }

    if (cleanUrl.startsWith('/categories/')) {
      const id = cleanUrl.replace('/categories/', '');
      const category = storageService.saveCategory({ ...body, id });
      return { data: { success: true, data: category } };
    }

    if (cleanUrl.startsWith('/settings')) {
      let payload = body;
      if (Array.isArray(body)) {
        payload = body.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
      }
      const settings = storageService.saveSettings(payload);
      return { data: { success: true, data: settings } };
    }

    if (cleanUrl.startsWith('/inquiries/')) {
      const id = cleanUrl.replace('/inquiries/', '').replace('/status', '');
      const updated = storageService.updateInquiryStatus(id, body.status);
      return { data: { success: true, data: updated } };
    }

    return { data: { success: true } };
  },

  patch: async (url, body = {}) => {
    const cleanUrl = url.replace(/^\/api/, '');

    // Product toggle publish
    if (cleanUrl.includes('/toggle-publish')) {
      const id = cleanUrl.match(/\/products\/(\d+)\/toggle-publish/)?.[1];
      const product = storageService.getProductById(id);
      if (product) {
        product.is_published = !product.is_published;
        storageService.saveProduct(product);
        return { data: { success: true, data: { is_published: product.is_published } } };
      }
    }

    // Product toggle featured
    if (cleanUrl.includes('/toggle-featured')) {
      const id = cleanUrl.match(/\/products\/(\d+)\/toggle-featured/)?.[1];
      const product = storageService.getProductById(id);
      if (product) {
        product.is_featured = !product.is_featured;
        storageService.saveProduct(product);
        return { data: { success: true, data: { is_featured: product.is_featured } } };
      }
    }

    // Inquiry status
    if (cleanUrl.includes('/status')) {
      const id = cleanUrl.match(/\/inquiries\/(\d+)\/status/)?.[1];
      if (id) {
        const updated = storageService.updateInquiryStatus(id, body.status);
        return { data: { success: true, data: updated } };
      }
    }

    // Images
    if (cleanUrl.includes('/featured')) {
      return { data: { success: true } };
    }

    return { data: { success: true } };
  },

  delete: async (url) => {
    const cleanUrl = url.replace(/^\/api/, '');

    if (cleanUrl.startsWith('/products/')) {
      const id = cleanUrl.replace('/products/', '');
      const remaining = storageService.deleteProduct(id);
      return { data: { success: true, data: remaining } };
    }

    if (cleanUrl.startsWith('/categories/')) {
      const id = cleanUrl.replace('/categories/', '');
      const remaining = storageService.deleteCategory(id);
      return { data: { success: true, data: remaining } };
    }

    if (cleanUrl.startsWith('/inquiries/')) {
      const id = cleanUrl.replace('/inquiries/', '');
      const remaining = storageService.deleteInquiry(id);
      return { data: { success: true, data: remaining } };
    }

    if (cleanUrl.startsWith('/images/')) {
      return { data: { success: true } };
    }

    if (cleanUrl.startsWith('/users/')) {
      return { data: { success: true } };
    }

    return { data: { success: true } };
  },

  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  }
};

export default mockApi;
