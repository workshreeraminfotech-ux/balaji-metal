import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
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
      const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // Auto-seed initial products to Firestore
        await firebaseService.seedInitialData();
        const seededSnapshot = await getDocs(q);
        return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Firebase getProducts error:', err);
      return null;
    }
  },

  subscribeProducts: (callback) => {
    if (!firebaseService.isConfigured()) return () => {};
    const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (error) => {
      console.error('Firebase subscribeProducts error:', error);
    });
  },

  saveProduct: async (productData) => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const isEdit = Boolean(productData.id);
      const docId = isEdit ? String(productData.id) : doc(collection(db, 'products')).id;
      
      const slug = productData.slug || (productData.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const payload = {
        ...productData,
        id: docId,
        slug,
        category_name: productData.category_name || 'Industrial Components',
        category_slug: productData.category_slug || 'couplings',
        image: productData.image || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg',
        gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [productData.image || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg'],
        features: productData.features || [],
        specifications: productData.specifications || [],
        applications: productData.applications || [],
        available_sizes: productData.available_sizes || [],
        is_featured: productData.is_featured ?? true,
        is_published: productData.is_published ?? true,
        updated_at: new Date().toISOString()
      };

      if (!isEdit) {
        payload.created_at = new Date().toISOString();
      }

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
      if (snapshot.empty) {
        await firebaseService.seedCategories();
        const seeded = await getDocs(collection(db, 'categories'));
        return seeded.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
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
      const q = query(collection(db, 'inquiries'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Firebase getInquiries error:', err);
      return null;
    }
  },

  subscribeInquiries: (callback) => {
    if (!firebaseService.isConfigured()) return () => {};
    const q = query(collection(db, 'inquiries'), orderBy('created_at', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (error) => {
      console.error('Firebase subscribeInquiries error:', error);
    });
  },

  addInquiry: async (inquiryData) => {
    if (!firebaseService.isConfigured()) return null;
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...inquiryData,
        company_name: inquiryData.company_name || inquiryData.company || '',
        product_interest: inquiryData.product_interest || inquiryData.product_name || '',
        status: 'new',
        created_at: new Date().toISOString()
      });
      return { id: docRef.id, ...inquiryData };
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
      // Seed default company info
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
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
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
          created_at: new Date().toISOString()
        });
      }
      await firebaseService.seedCategories();
      await setDoc(doc(db, 'settings', 'general'), COMPANY_INFO);
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
        });
      }
    } catch (err) {
      console.error('Seeding categories error:', err);
    }
  }
};
