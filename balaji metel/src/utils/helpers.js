export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getImageUrl = (filename) => {
  if (!filename) return null; 
  if (filename.startsWith('http')) return filename;
  return `/uploads/products/${filename}`;
};

export const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, ''); 
};

export const generateWhatsAppLink = (phone, message = '') => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
};
