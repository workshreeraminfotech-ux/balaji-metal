import { PRODUCTS, CATEGORIES } from '@/data/productsData';
import { COMPANY_INFO } from '@/data/companyData';
import { firebaseService } from '@/services/firebaseService';

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
    id: '1',
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
    id: '2',
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

// Initialize real-time cloud listeners if Firebase is configured
let isCloudListening = false;

function initFirebaseListeners() {
  if (isCloudListening || !firebaseService.isConfigured()) return;
  isCloudListening = true;

  try {
    // Products Listener
    firebaseService.subscribeProducts((cloudProducts) => {
      if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(cloudProducts));
        storageService.notifyChange('products', cloudProducts);
      }
    });

    // Categories Listener
    firebaseService.subscribeCategories((cloudCategories) => {
      if (Array.isArray(cloudCategories) && cloudCategories.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cloudCategories));
        storageService.notifyChange('categories', cloudCategories);
      }
    });

    // Inquiries Listener
    firebaseService.subscribeInquiries((cloudInquiries) => {
      if (Array.isArray(cloudInquiries)) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(cloudInquiries));
        storageService.notifyChange('inquiries', cloudInquiries);
      }
    });

    // Settings Listener
    firebaseService.subscribeSettings((cloudSettings) => {
      if (cloudSettings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cloudSettings));
        storageService.notifyChange('settings', cloudSettings);
      }
    });

    console.log('⚡ Firebase Realtime Cloud Sync Active');
  } catch (err) {
    console.error('Firebase real-time listener error:', err);
  }
}

// Start listeners immediately on load
if (typeof window !== 'undefined') {
  initFirebaseListeners();
}

export const storageService = {
  // Broadcast update event
  notifyChange: (type, data = null) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('balaji_data_changed', { detail: { type, data } }));
    }
  },

  subscribe: (callback) => {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => callback(e.detail);
    window.addEventListener('balaji_data_changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('balaji_data_changed', handler);
      window.removeEventListener('storage', handler);
    };
  },

  // PRODUCTS
  getProducts: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
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

  saveProduct: async (productData) => {
    const categories = storageService.getCategories();
    const category = categories.find(c => String(c.id) === String(productData.category_id)) || {};
    
    const enrichedData = {
      ...productData,
      category_name: category.name || productData.category_name || 'Industrial Components',
      category_slug: category.slug || productData.category_slug || 'couplings'
    };

    // 1. Sync with Firebase if configured
    if (firebaseService.isConfigured()) {
      try {
        const saved = await firebaseService.saveProduct(enrichedData);
        return saved;
      } catch (err) {
        console.warn('Firebase save failed, falling back to local storage:', err);
      }
    }

    // 2. Local fallback
    const products = storageService.getProducts();
    let updatedProducts;
    if (productData.id) {
      updatedProducts = products.map(p => {
        if (String(p.id) === String(productData.id)) {
          return {
            ...p,
            ...enrichedData,
            updated_at: new Date().toISOString()
          };
        }
        return p;
      });
    } else {
      const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
      const slug = productData.slug || (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const defaultImg = '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg';
      const mainImg = productData.image || defaultImg;
      const newProduct = {
        ...enrichedData,
        id: String(newId),
        slug,
        image: mainImg,
        gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [mainImg],
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
    storageService.notifyChange('products');
    return updatedProducts;
  },

  deleteProduct: async (id) => {
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.deleteProduct(id);
      } catch (err) {
        console.warn('Firebase delete failed:', err);
      }
    }
    const products = storageService.getProducts();
    const filtered = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    storageService.notifyChange('products');
    return filtered;
  },

  // CATEGORIES
  getCategories: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
      return CATEGORIES;
    } catch (e) {
      console.error('Storage getCategories error:', e);
      return CATEGORIES;
    }
  },

  saveCategory: async (categoryData) => {
    if (firebaseService.isConfigured()) {
      try {
        const saved = await firebaseService.saveCategory(categoryData);
        return saved;
      } catch (err) {
        console.warn('Firebase save category failed:', err);
      }
    }
    const categories = storageService.getCategories();
    let updated;
    if (categoryData.id) {
      updated = categories.map(c => String(c.id) === String(categoryData.id) ? { ...c, ...categoryData } : c);
    } else {
      const newId = categories.length > 0 ? Math.max(...categories.map(c => Number(c.id) || 0)) + 1 : 1;
      const slug = categoryData.slug || (categoryData.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCat = {
        ...categoryData,
        id: String(newId),
        slug,
        shortName: categoryData.shortName || categoryData.name,
        productCount: 0
      };
      updated = [...categories, newCat];
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    storageService.notifyChange('categories');
    return updated;
  },

  deleteCategory: async (id) => {
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.deleteCategory(id);
      } catch (err) {
        console.warn('Firebase delete category failed:', err);
      }
    }
    const categories = storageService.getCategories();
    const filtered = categories.filter(c => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    storageService.notifyChange('categories');
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

  addInquiry: async (inquiryData) => {
    if (firebaseService.isConfigured()) {
      try {
        const saved = await firebaseService.addInquiry(inquiryData);
        return saved;
      } catch (err) {
        console.warn('Firebase add inquiry failed:', err);
      }
    }
    const inquiries = storageService.getInquiries();
    const newId = inquiries.length > 0 ? Math.max(...inquiries.map(i => Number(i.id) || 0)) + 1 : 1;
    const newInquiry = {
      ...inquiryData,
      id: String(newId),
      company_name: inquiryData.company_name || inquiryData.company || '',
      product_interest: inquiryData.product_interest || inquiryData.product_name || '',
      status: 'new',
      created_at: new Date().toISOString()
    };
    const updated = [newInquiry, ...inquiries];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    storageService.notifyChange('inquiries');
    return newInquiry;
  },

  updateInquiryStatus: async (id, status) => {
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.updateInquiryStatus(id, status);
      } catch (err) {
        console.warn('Firebase update inquiry status failed:', err);
      }
    }
    const inquiries = storageService.getInquiries();
    const updated = inquiries.map(i => String(i.id) === String(id) ? { ...i, status } : i);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    storageService.notifyChange('inquiries');
    return updated;
  },

  deleteInquiry: async (id) => {
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.deleteInquiry(id);
      } catch (err) {
        console.warn('Firebase delete inquiry failed:', err);
      }
    }
    const inquiries = storageService.getInquiries();
    const filtered = inquiries.filter(i => String(i.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
    storageService.notifyChange('inquiries');
    return filtered;
  },

  // SETTINGS
  getSettings: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      let data = stored ? JSON.parse(stored) : {};

      const primaryPhone = data.primary_phone || data.company_phone || COMPANY_INFO.phones[0].display;
      const secondaryPhone = data.secondary_phone || data.company_phone_2 || COMPANY_INFO.phones[1].display;
      const email = data.email || data.company_email || COMPANY_INFO.email;
      const address = data.address || data.company_address || COMPANY_INFO.address.full;
      const whatsapp = data.whatsapp_number || data.company_whatsapp || data.whatsapp || COMPANY_INFO.whatsapp;
      const hours = data.working_hours || data.business_hours || COMPANY_INFO.businessHours;
      const companyName = data.company_name || data.name || COMPANY_INFO.name;

      const addressObj = typeof address === 'object' && address !== null ? address : {
        full: String(address || ''),
        line1: String(address || '').split(',')[0] || String(address || ''),
        line2: String(address || '').split(',').slice(1, 3).join(',') || '',
        city: 'Rajkot',
        state: 'Gujarat',
        pincode: '360025',
        country: 'India'
      };

      const merged = {
        ...COMPANY_INFO,
        ...data,
        name: companyName,
        company_name: companyName,
        primary_phone: primaryPhone,
        company_phone: primaryPhone,
        secondary_phone: secondaryPhone,
        company_phone_2: secondaryPhone,
        email: email,
        company_email: email,
        address: addressObj,
        company_address: addressObj.full,
        whatsapp: whatsapp,
        whatsapp_number: whatsapp,
        company_whatsapp: whatsapp,
        working_hours: hours,
        business_hours: hours,
        phones: [
          { display: primaryPhone, raw: primaryPhone.replace(/[^0-9+]/g, ''), isPrimary: true, isWhatsApp: true },
          { display: secondaryPhone, raw: secondaryPhone.replace(/[^0-9+]/g, ''), isPrimary: false, isWhatsApp: false }
        ]
      };
      return merged;
    } catch (e) {
      console.error('Storage getSettings error:', e);
      return COMPANY_INFO;
    }
  },

  saveSettings: async (settingsData) => {
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.saveSettings(settingsData);
      } catch (err) {
        console.warn('Firebase save settings failed:', err);
      }
    }
    const current = storageService.getSettings();
    const primaryPhone = settingsData.primary_phone || settingsData.company_phone || current.primary_phone;
    const secondaryPhone = settingsData.secondary_phone || settingsData.company_phone_2 || current.secondary_phone;
    const email = settingsData.email || settingsData.company_email || current.email;
    const address = settingsData.address || settingsData.company_address || current.company_address;
    const whatsapp = settingsData.whatsapp_number || settingsData.company_whatsapp || settingsData.whatsapp || current.whatsapp;
    const hours = settingsData.working_hours || settingsData.business_hours || current.working_hours;
    const companyName = settingsData.company_name || settingsData.name || current.company_name;

    const updated = {
      ...current,
      ...settingsData,
      name: companyName,
      company_name: companyName,
      primary_phone: primaryPhone,
      company_phone: primaryPhone,
      secondary_phone: secondaryPhone,
      company_phone_2: secondaryPhone,
      email: email,
      company_email: email,
      address: typeof address === 'object' ? (address.full || address.line1) : address,
      company_address: typeof address === 'object' ? (address.full || address.line1) : address,
      whatsapp: whatsapp,
      whatsapp_number: whatsapp,
      company_whatsapp: whatsapp,
      working_hours: hours,
      business_hours: hours
    };

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    storageService.notifyChange('settings');
    return storageService.getSettings();
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

  // AUTH (Admin)
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

  setAuthUser: (userData) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
    storageService.notifyChange('auth');
    return userData;
  },

  login: (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const storedUser = storageService.getAuthUser();
    const isValidId = cleanId === 'balaji metal' || cleanId === 'balajimetal' || cleanId === 'balajimetal5302@gmail.com' || cleanId === 'admin@balajimetal.com';
    const expectedPassword = (storedUser && storedUser.password) ? storedUser.password : 'balajimetal@789';

    if (!isValidId || cleanPass !== expectedPassword) {
      return { success: false, message: 'Invalid Admin ID or Password' };
    }

    const adminUser = {
      id: 1,
      name: 'Balaji Metal Admin',
      username: 'balaji metal',
      email: 'balajimetal5302@gmail.com',
      role: 'admin',
      ...(storedUser || {})
    };
    const mockToken = 'mock_jwt_token_' + Date.now();
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
    storageService.notifyChange('auth');
    return { success: true, user: adminUser, token: mockToken };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    storageService.notifyChange('auth');
  },

  // Reset to initial factory defaults
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SAMPLE_INQUIRIES));
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    storageService.notifyChange('all');
  }
};
