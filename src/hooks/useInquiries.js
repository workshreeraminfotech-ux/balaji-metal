import { useState } from 'react';
import { storageService } from '@/utils/storageService';

export const useInquiries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitInquiry = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      storageService.addInquiry(data);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitInquiry, loading, error, success };
};
