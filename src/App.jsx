import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BackToTop from '@/components/ui/BackToTop';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Preloader from '@/components/ui/Preloader';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';

// Public Showcase Pages
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin Protected Modules & Pages
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminInquiriesPage from '@/pages/admin/AdminInquiriesPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + Shift + A or Cmd + Shift + A
      const isA = e.key === 'A' || e.key === 'a' || e.code === 'KeyA' || e.keyCode === 65;
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && isA) {
        e.preventDefault();
        e.stopPropagation();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [navigate]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Login Route (Public) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Preloader />
        <BackToTop />
        <WhatsAppButton />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
