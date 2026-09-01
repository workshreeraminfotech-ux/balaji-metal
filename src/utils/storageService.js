import { PRODUCTS, CATEGORIES } from '@/data/productsData';
import { COMPANY_INFO } from '@/data/companyData';

const STORAGE_KEYS = {
  PRODUCTS: 'balaji_metal_products',
  CATEGORIES: 'balaji_metal_categories',
  INQUIRIES: 'balaji_metal_inquiries',
  SETTINGS: 'balaji_metal_settings',
  AUTH_USER: 'balaji_metal_auth_user',
  TOKEN: 'token'
};

const SAMPLE_INQUIRIES = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    company_name: 'Gujarat Heavy Industries Ltd',
    email: 'rajesh.sharma@ghiltd.com',
    phone: '+91 98250 12345',
    city: 'Ahmedabad',
    product_interest: 'Pin Bush Flexible Coupling (Size F-12)',
    quantity: '10 Units',
    message: 'Need urgent quote for 10 units of Pin Bush Flexible Couplings with dynamic balancing certificate.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    name: 'Vikram Patel',
    company_name: 'Apex Petrochem Machines',
    email: 'vpatel@apexmachines.in',
    phone: '+91 94260 67890',
    city: 'Surat',
    product_interest: 'Industrial V-Belt Pulley 4 Groove',
    quantity: '25 Pcs',
    message: 'Please share technical catalog and price estimation for SPB section 4-groove pulleys.',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const storageService = {
  // PRODUCTS
  getProducts: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    } catch (e) {
      console.error('Storage getProducts error:', e);
      return PRODUCTS;
    }
  },

  getProductBySlug: (slug) => {
    const products = storageService.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  getProductById: (id) => {
    const products = storageService.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  saveProduct: (productData) => {
    const products = storageService.getProducts();
    const categories = storageService.getCategories();
    
    // Find category details
    const category = categories.find(c => String(c.id) === String(productData.category_id)) || {};
    
    let updatedProducts;
    if (productData.id) {
      // Edit
      updatedProducts = products.map(p => {
        if (String(p.id) === String(productData.id)) {
          return {
            ...p,
            ...productData,
            category_name: category.name || p.category_name,
            category_slug: category.slug || p.category_slug,
            updated_at: new Date().toISOString()
          };
        }
        return p;
      });
    } else {
      // New Product
      const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
      const slug = productData.slug || (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProduct = {
        ...productData,
        id: newId,
        slug,
        category_name: category.name || 'General',
        category_slug: category.slug || 'general',
        image: productData.image || '/images/products/pin-bush-coupling.jpg',
        gallery: productData.gallery || [productData.image || '/images/products/pin-bush-coupling.jpg'],
        features: productData.features || [],
        specifications: productData.specifications || [],
        applications: productData.applications || [],
        available_sizes: productData.available_sizes || [],
        is_featured: productData.is_featured ?? true,
        is_published: productData.is_published ?? true,
        created_at: new Date().toISOString()
      };
      updatedProducts = [newProduct, ...products];
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    return updatedProducts;
  },

  deleteProduct: (id) => {
    const products = storageService.getProducts();
    const filtered = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return filtered;
  },

  // CATEGORIES
  getCategories: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
      return CATEGORIES;
    } catch (e) {
      console.error('Storage getCategories error:', e);
      return CATEGORIES;
    }
  },

  saveCategory: (categoryData) => {
    const categories = storageService.getCategories();
    let updated;
    if (categoryData.id) {
      updated = categories.map(c => String(c.id) === String(categoryData.id) ? { ...c, ...categoryData } : c);
    } else {
      const newId = categories.length > 0 ? Math.max(...categories.map(c => Number(c.id) || 0)) + 1 : 1;
      const slug = categoryData.slug || (categoryData.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCat = {
        ...categoryData,
        id: newId,
        slug,
        shortName: categoryData.shortName || categoryData.name,
        productCount: 0
      };
      updated = [...categories, newCat];
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    return updated;
  },

  deleteCategory: (id) => {
    const categories = storageService.getCategories();
    const filtered = categories.filter(c => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    return filtered;
  },

  // INQUIRIES
  getInquiries: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SAMPLE_INQUIRIES));
      return SAMPLE_INQUIRIES;
    } catch (e) {
      console.error('Storage getInquiries error:', e);
      return SAMPLE_INQUIRIES;
    }
  },

  addInquiry: (inquiryData) => {
    const inquiries = storageService.getInquiries();
    const newId = inquiries.length > 0 ? Math.max(...inquiries.map(i => Number(i.id) || 0)) + 1 : 1;
    const newInquiry = {
      ...inquiryData,
      id: newId,
      status: 'new',
      created_at: new Date().toISOString()
    };
    const updated = [newInquiry, ...inquiries];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    return newInquiry;
  },

  updateInquiryStatus: (id, status) => {
    const inquiries = storageService.getInquiries();
    const updated = inquiries.map(i => String(i.id) === String(id) ? { ...i, status } : i);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    return updated;
  },

  deleteInquiry: (id) => {
    const inquiries = storageService.getInquiries();
    const filtered = inquiries.filter(i => String(i.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
    return filtered;
  },

  // SETTINGS
  getSettings: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
      const initialSettings = {
        company_name: COMPANY_INFO.name,
        company_tagline: COMPANY_INFO.tagline,
        company_subtagline: COMPANY_INFO.subTagline,
        company_phone: COMPANY_INFO.phones[0].display,
        company_phone_2: COMPANY_INFO.phones[1].display,
        company_email: COMPANY_INFO.email,
        company_address: COMPANY_INFO.address.full,
        company_whatsapp: COMPANY_INFO.whatsapp,
        business_hours: COMPANY_INFO.businessHours,
        google_maps_embed: COMPANY_INFO.googleMapsUrl,
        established_year: COMPANY_INFO.establishedYear,
        experience_years: COMPANY_INFO.experienceYears
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      return initialSettings;
    } catch (e) {
      console.error('Storage getSettings error:', e);
      return {};
    }
  },

  saveSettings: (settingsData) => {
    const current = storageService.getSettings();
    const updated = { ...current, ...settingsData };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // DASHBOARD STATS
  getStats: () => {
    const products = storageService.getProducts();
    const categories = storageService.getCategories();
    const inquiries = storageService.getInquiries();

    const newInquiries = inquiries.filter(i => i.status === 'new').length;
    const featuredProducts = products.filter(p => p.is_featured).length;

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalInquiries: inquiries.length,
      newInquiries,
      featuredProducts,
      recentInquiries: inquiries.slice(0, 5),
      recentProducts: products.slice(0, 5)
    };
  },

  // AUTH (Demo Admin)
  getAuthUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  login: (email, password) => {
    const adminUser = {
      id: 1,
      name: 'Balaji Administrator',
      email: email || 'admin@balajimetal.com',
      role: 'admin'
    };
    const mockToken = 'mock_jwt_token_' + Date.now();
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
    return { success: true, user: adminUser, token: mockToken };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};
