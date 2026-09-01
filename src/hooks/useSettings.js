import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/utils/storageService';

export const useSettings = () => {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(() => {
    try {
      const data = storageService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings) => {
    const updated = storageService.saveSettings(newSettings);
    setSettings(updated);
    return updated;
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
};
