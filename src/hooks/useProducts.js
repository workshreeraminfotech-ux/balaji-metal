import { useState, useEffect, useCallback, useMemo } from 'react';
import { storageService } from '@/utils/storageService';

const EMPTY_PARAMS = {};

export const useProducts = (initialParams = EMPTY_PARAMS) => {
  const categoryId = initialParams?.category_id;
  const search = initialParams?.search;

  const getFilteredProducts = useCallback(() => {
    let list = storageService.getProducts();

    if (categoryId && categoryId !== 'all') {
      list = list.filter(p => 
        String(p.category_id) === String(categoryId) || 
        p.category_slug === categoryId
      );
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [categoryId, search]);

  const [products, setProducts] = useState(getFilteredProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(() => {
    try {
      const list = getFilteredProducts();
      setProducts(list);
      setError(null);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Failed to load products');
    }
  }, [getFilteredProducts]);

  useEffect(() => {
    fetchProducts();

    const unsubscribe = storageService.subscribe((detail) => {
      if (!detail?.type || detail.type === 'products' || detail.type === 'all') {
        fetchProducts();
      }
    });

    return unsubscribe;
  }, [fetchProducts]);

  return { products, loading, error, totalPages, currentPage, refetch: fetchProducts };
};


