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

// Helper to extract a normalized unique key for product deduplication
function normalizeProductKey(item) {
  if (!item) return '';
  const slug = (item.slug || '').trim().toLowerCase();
  if (slug) return `slug:${slug}`;
  
  const name = (item.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (name) return `name:${name}`;

  const id = String(item.id || '').trim();
  if (id) return `id:${id}`;

  return '';
}

// Helper to deduplicate product list by slug, normalized name, and ID
function deduplicateProducts(list) {
  if (!Array.isArray(list)) return [];
  const map = new Map();
  
  for (const item of list) {
    if (!item) continue;
    const key = normalizeProductKey(item);
    if (!key) continue;

    if (map.has(key)) {
      const existing = map.get(key);
      const isItemNewer = (item.updated_at || item.created_at || '') > (existing.updated_at || existing.created_at || '');
      const primary = isItemNewer ? item : existing;
      const secondary = isItemNewer ? existing : item;

      // Smart merge preserving photos, features, specs and applications
      const gallery = (primary.gallery && primary.gallery.length > 0) 
        ? primary.gallery 
        : (secondary.gallery && secondary.gallery.length > 0 ? secondary.gallery : [primary.image || secondary.image].filter(Boolean));
      
      const features = (primary.features && primary.features.length > 0)
        ? primary.features
        : (secondary.features || []);

      map.set(key, {
        ...secondary,
        ...primary,
        id: primary.id || secondary.id,
        slug: primary.slug || secondary.slug,
        name: primary.name || secondary.name,
        gallery,
        features,
        specifications: primary.specifications || secondary.specifications || [],
        applications: primary.applications || secondary.applications || [],
        available_sizes: primary.available_sizes || secondary.available_sizes || []
      });
    } else {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

// Helper to deduplicate categories
function normalizeCategoryKey(item) {
  if (!item) return '';
  const slug = (item.slug || '').trim().toLowerCase();
  if (slug) return `slug:${slug}`;
  const name = (item.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (name) return `name:${name}`;
  return `id:${item.id}`;
}

function deduplicateCategories(list) {
  if (!Array.isArray(list)) return [];
  const map = new Map();
  for (const item of list) {
    if (!item) continue;
    const key = normalizeCategoryKey(item);
    if (!key) continue;
    if (map.has(key)) {
      map.set(key, { ...map.get(key), ...item });
    } else {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

// Initialize real-time cloud listeners if Firebase is configured
let isCloudListening = false;

function initFirebaseListeners() {
  if (isCloudListening || !firebaseService.isConfigured()) return;
  isCloudListening = true;

  try {
    // Products Listener
    firebaseService.subscribeProducts((cloudProducts) => {
      if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
        const local = storageService.getProducts();
        
        // Merge cloud with local, cloud taking priority on same slug/name/ID
        const map = new Map();
        local.forEach(p => {
          const k = normalizeProductKey(p);
          if (k) map.set(k, p);
        });
        
        cloudProducts.forEach(cp => {
          const k = normalizeProductKey(cp);
          if (k) {
            const existing = map.get(k);
            map.set(k, { ...(existing || {}), ...cp, id: cp.id || existing?.id });
          }
        });

        const merged = deduplicateProducts(Array.from(map.values()));
        merged.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
        storageService.notifyChange('products', merged);
      }
    });

    // Categories Listener
    firebaseService.subscribeCategories((cloudCategories) => {
      if (Array.isArray(cloudCategories) && cloudCategories.length > 0) {
        const local = storageService.getCategories();
        const map = new Map();
        local.forEach(c => {
          const k = normalizeCategoryKey(c);
          if (k) map.set(k, c);
        });
        cloudCategories.forEach(cc => {
          const k = normalizeCategoryKey(cc);
          if (k) {
            const existing = map.get(k);
            map.set(k, { ...(existing || {}), ...cc, id: cc.id || existing?.id });
          }
        });
        const merged = deduplicateCategories(Array.from(map.values()));

        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(merged));
        storageService.notifyChange('categories', merged);
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
          const cleaned = deduplicateProducts(parsed);
          // If duplicates were pruned, update localStorage immediately (self-healing)
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(cleaned));
          }
          return cleaned;
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
    
    const products = storageService.getProducts();
    
    // Stable slug and ID generation
    const slug = productData.slug || (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const targetKey = normalizeProductKey({ ...productData, slug });
    const existingIndex = products.findIndex(p => 
      (productData.id && String(p.id) === String(productData.id)) ||
      p.slug === slug ||
      normalizeProductKey(p) === targetKey
    );

    const existingProduct = existingIndex >= 0 ? products[existingIndex] : null;
    const targetId = existingProduct?.id || productData.id || `prod_${Date.now()}`;
    const defaultImg = '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg';
    const mainImg = productData.image || (productData.photos && productData.photos[0]) || existingProduct?.image || defaultImg;
    const gallery = (productData.photos && productData.photos.length > 0) 
      ? productData.photos 
      : (productData.gallery && productData.gallery.length > 0 ? productData.gallery : (existingProduct?.gallery || [mainImg]));

    const fullProduct = {
      ...(existingProduct || {}),
      ...productData,
      id: targetId,
      slug,
      category_id: Number(productData.category_id || existingProduct?.category_id || 1),
      category_name: category.name || productData.category_name || existingProduct?.category_name || 'Industrial Components',
      category_slug: category.slug || productData.category_slug || existingProduct?.category_slug || 'couplings',
      image: mainImg,
      gallery,
      features: Array.isArray(productData.features) ? productData.features.filter(Boolean) : (existingProduct?.features || []),
      short_description: productData.short_description || existingProduct?.short_description || '',
      description: productData.description || productData.short_description || existingProduct?.description || '',
      is_featured: productData.is_featured !== undefined ? productData.is_featured : (existingProduct?.is_featured ?? true),
      is_published: true,
      created_at: existingProduct?.created_at || productData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 1. Update in-memory & LocalStorage immediately
    let updatedProducts;
    if (existingIndex >= 0) {
      updatedProducts = [...products];
      updatedProducts[existingIndex] = fullProduct;
    } else {
      updatedProducts = [fullProduct, ...products];
    }

    updatedProducts = deduplicateProducts(updatedProducts);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    storageService.notifyChange('products', updatedProducts);

    // 2. Sync to Firebase Firestore asynchronously
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.saveProduct(fullProduct);
      } catch (err) {
        console.warn('Firebase saveProduct sync failed:', err);
      }
    }

    return updatedProducts;
  },

  deleteProduct: async (id) => {
    const products = storageService.getProducts();
    const filtered = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    storageService.notifyChange('products', filtered);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.deleteProduct(id);
      } catch (err) {
        console.warn('Firebase deleteProduct sync failed:', err);
      }
    }
    return filtered;
  },

  // CATEGORIES
  getCategories: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = deduplicateCategories(parsed);
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cleaned));
          }
          return cleaned;
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
    const categories = storageService.getCategories();
    const targetId = categoryData.id ? String(categoryData.id) : `cat_${Date.now()}`;
    const slug = categoryData.slug || (categoryData.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const fullCat = {
      ...categoryData,
      id: targetId,
      slug,
      shortName: categoryData.shortName || categoryData.name,
      updated_at: new Date().toISOString()
    };

    let updated;
    const existingIndex = categories.findIndex(c => String(c.id) === String(targetId) || c.slug === slug);
    if (existingIndex >= 0) {
      updated = [...categories];
      updated[existingIndex] = { ...categories[existingIndex], ...fullCat };
    } else {
      updated = [...categories, fullCat];
    }

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    storageService.notifyChange('categories', updated);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.saveCategory(fullCat);
      } catch (err) {
        console.warn('Firebase saveCategory sync failed:', err);
      }
    }
    return updated;
  },

  deleteCategory: async (id) => {
    const categories = storageService.getCategories();
    const filtered = categories.filter(c => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    storageService.notifyChange('categories', filtered);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.deleteCategory(id);
      } catch (err) {
        console.warn('Firebase deleteCategory sync failed:', err);
      }
    }
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
    const inquiries = storageService.getInquiries();
    const newId = `inq_${Date.now()}`;
    const newInquiry = {
      ...inquiryData,
      id: newId,
      company_name: inquiryData.company_name || inquiryData.company || '',
      product_interest: inquiryData.product_interest || inquiryData.product_name || '',
      status: 'new',
      created_at: new Date().toISOString()
    };
    const updated = [newInquiry, ...inquiries];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    storageService.notifyChange('inquiries', updated);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.addInquiry(newInquiry);
      } catch (err) {
        console.warn('Firebase addInquiry sync failed:', err);
      }
    }
    return newInquiry;
  },

  updateInquiryStatus: async (id, status) => {
    const inquiries = storageService.getInquiries();
    const updated = inquiries.map(i => String(i.id) === String(id) ? { ...i, status } : i);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    storageService.notifyChange('inquiries', updated);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.updateInquiryStatus(id, status);
      } catch (err) {
        console.warn('Firebase updateInquiryStatus sync failed:', err);
      }
    }
    return updated;
  },

  deleteInquiry: async (id) => {
    const inquiries = storageService.getInquiries();
    const filtered = inquiries.filter(i => String(i.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
    storageService.notifyChange('inquiries', filtered);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.deleteInquiry(id);
      } catch (err) {
        console.warn('Firebase deleteInquiry sync failed:', err);
      }
    }
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
    const current = storageService.getSettings();
    const updated = { ...current, ...settingsData };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    storageService.notifyChange('settings', updated);

    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.saveSettings(settingsData);
      } catch (err) {
        console.warn('Firebase saveSettings sync failed:', err);
      }
    }
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

  // Clean any duplicate products and categories immediately
  cleanDuplicates: () => {
    try {
      const storedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        const cleaned = deduplicateProducts(parsed);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(cleaned));
        storageService.notifyChange('products', cleaned);
      }
      const storedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        const cleaned = deduplicateCategories(parsed);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cleaned));
        storageService.notifyChange('categories', cleaned);
      }
      return true;
    } catch (e) {
      console.error('cleanDuplicates error:', e);
      return false;
    }
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
