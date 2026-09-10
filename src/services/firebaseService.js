import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '@/config/firebase';
import { PRODUCTS, CATEGORIES } from '@/data/productsData';
import { COMPANY_INFO } from '@/data/companyData';

export const firebaseService = {
  isConfigured: () => isFirebaseConfigured() && db !== null,

  // ==========================================
  // PRODUCTS
  // ==========================================
  getProducts: async () => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      return list;
    } catch (err) {
      console.error('Firebase getProducts error:', err);
      return null;
    }
  },

  subscribeProducts: (callback) => {
    if (!firebaseService.isConfigured()) return () => {};
    return onSnapshot(collection(db, 'products'), (snapshot) => {
      const map = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
        const slug = (item.slug || '').trim().toLowerCase();
        const name = (item.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const key = slug ? `slug:${slug}` : (name ? `name:${name}` : `id:${doc.id}`);
        if (!map.has(key) || (item.updated_at || '') > (map.get(key).updated_at || '')) {
          map.set(key, item);
        }
      });
      const items = Array.from(map.values());
      items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      callback(items);
    }, (error) => {
      console.error('Firebase subscribeProducts error:', error);
    });
  },

  saveProduct: async (productData) => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const slug = productData.slug || (productData.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Stable Firestore Document ID
      const docId = String(productData.id || productData.slug || slug || `prod_${Date.now()}`);

      const payload = {
        ...productData,
        id: docId,
        slug,
        category_id: Number(productData.category_id || 1),
        category_name: productData.category_name || 'Industrial Components',
        category_slug: productData.category_slug || 'couplings',
        image: productData.image || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg',
        gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [productData.image || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg'],
        features: Array.isArray(productData.features) ? productData.features : [],
        short_description: productData.short_description || '',
        description: productData.description || productData.short_description || '',
        is_featured: productData.is_featured !== false,
        is_published: true,
        created_at: productData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'products', docId), payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Firebase saveProduct error:', err);
      throw err;
    }
  },

  deleteProduct: async (id) => {
    if (!firebaseService.isConfigured()) return false;
    try {
      await deleteDoc(doc(db, 'products', String(id)));
      return true;
    } catch (err) {
      console.error('Firebase deleteProduct error:', err);
      throw err;
    }
  },

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories: async () => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Firebase getCategories error:', err);
      return null;
    }
  },

  subscribeCategories: (callback) => {
    if (!firebaseService.isConfigured()) return () => {};
    return onSnapshot(collection(db, 'categories'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (error) => {
      console.error('Firebase subscribeCategories error:', error);
    });
  },

  saveCategory: async (categoryData) => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const isEdit = Boolean(categoryData.id);
      const docId = isEdit ? String(categoryData.id) : doc(collection(db, 'categories')).id;
      const slug = categoryData.slug || (categoryData.name || 'category')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const payload = {
        ...categoryData,
        id: docId,
        slug,
        shortName: categoryData.shortName || categoryData.name,
        updated_at: new Date().toISOString()
      };

      if (!isEdit) {
        payload.created_at = new Date().toISOString();
      }

      await setDoc(doc(db, 'categories', docId), payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Firebase saveCategory error:', err);
      throw err;
    }
  },

  deleteCategory: async (id) => {
    if (!firebaseService.isConfigured()) return false;
    try {
      await deleteDoc(doc(db, 'categories', String(id)));
      return true;
    } catch (err) {
      console.error('Firebase deleteCategory error:', err);
      throw err;
    }
  },

  // ==========================================
  // INQUIRIES
  // ==========================================
  getInquiries: async () => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const snapshot = await getDocs(collection(db, 'inquiries'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      return list;
    } catch (err) {
      console.error('Firebase getInquiries error:', err);
      return null;
    }
  },

  subscribeInquiries: (callback) => {
    if (!firebaseService.isConfigured()) return () => {};
    return onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      callback(items);
    }, (error) => {
      console.error('Firebase subscribeInquiries error:', error);
    });
  },

  addInquiry: async (inquiryData) => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const docId = String(inquiryData.id || `inq_${Date.now()}`);
      const payload = {
        ...inquiryData,
        id: docId,
        company_name: inquiryData.company_name || inquiryData.company || '',
        product_interest: inquiryData.product_interest || inquiryData.product_name || '',
        status: inquiryData.status || 'new',
        created_at: inquiryData.created_at || new Date().toISOString()
      };
      await setDoc(doc(db, 'inquiries', docId), payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Firebase addInquiry error:', err);
      throw err;
    }
  },

  updateInquiryStatus: async (id, status) => {
    if (!firebaseService.isConfigured()) return false;
    try {
      await updateDoc(doc(db, 'inquiries', String(id)), { status, updated_at: new Date().toISOString() });
      return true;
    } catch (err) {
      console.error('Firebase updateInquiryStatus error:', err);
      throw err;
    }
  },

  deleteInquiry: async (id) => {
    if (!firebaseService.isConfigured()) return false;
    try {
      await deleteDoc(doc(db, 'inquiries', String(id)));
      console.log('✅ Firebase Firestore inquiry deleted:', id);
      return true;
    } catch (err) {
      console.error('Firebase deleteInquiry error:', err);
      throw err;
    }
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  getSettings: async () => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'general'));
      if (docSnap.exists()) {
        return docSnap.data();
      }
      await setDoc(doc(db, 'settings', 'general'), COMPANY_INFO);
      return COMPANY_INFO;
    } catch (err) {
      console.error('Firebase getSettings error:', err);
      return null;
    }
  },

  subscribeSettings: (callback) => {
    if (!firebaseService.isConfigured()) return () => {};
    return onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (error) => {
      console.error('Firebase subscribeSettings error:', error);
    });
  },

  saveSettings: async (settingsData) => {
    if (!firebaseService.isConfigured()) return null;
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settingsData,
        updated_at: new Date().toISOString()
      }, { merge: true });
      return settingsData;
    } catch (err) {
      console.error('Firebase saveSettings error:', err);
      throw err;
    }
  },

  // ==========================================
  // FILE / IMAGE UPLOAD
  // ==========================================
  uploadImage: async (file, folder = 'products') => {
    if (!firebaseService.isConfigured() || !storage) {
      throw new Error('Firebase Storage not configured');
    }
    const cleanFileName = `${Date.now()}_${(file.name || 'photo.jpg').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${cleanFileName}`);
    const uploadResult = await uploadBytes(storageRef, file);
    return await getDownloadURL(uploadResult.ref);
  },

  // ==========================================
  // SEED INITIAL DATA
  // ==========================================
  seedInitialData: async () => {
    if (!firebaseService.isConfigured()) return;
    try {
      for (const p of PRODUCTS) {
        const pId = String(p.id);
        await setDoc(doc(db, 'products', pId), {
          ...p,
          id: pId,
          created_at: p.created_at || new Date().toISOString()
        }, { merge: true });
      }
      await firebaseService.seedCategories();
      await setDoc(doc(db, 'settings', 'general'), COMPANY_INFO, { merge: true });
    } catch (err) {
      console.error('Seeding error:', err);
    }
  },

  seedCategories: async () => {
    if (!firebaseService.isConfigured()) return;
    try {
      for (const c of CATEGORIES) {
        const cId = String(c.id);
        await setDoc(doc(db, 'categories', cId), {
          ...c,
          id: cId,
          created_at: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.error('Seeding categories error:', err);
    }
  }
};
