import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/utils/storageService';

export const useCategories = () => {
  const [categories, setCategories] = useState(() => storageService.getCategories());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(() => {
    try {
      const data = storageService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};
