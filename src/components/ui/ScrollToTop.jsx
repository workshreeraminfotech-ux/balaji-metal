import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there's an anchor hash (e.g. #section), scroll to it, otherwise scroll to top (0,0)
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // Instantly scroll window to top on every page/route transition
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      window.scroll(0, 0);
    }
  }, [pathname, search, hash]);

  return null;
}
