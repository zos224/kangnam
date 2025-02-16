import { useState, useEffect } from 'react';
import { Language } from '@/utils/model';

export function useLanguageData() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/language');
        const data = await response.json();
        setLanguages(data.data || []);
        
        // Set default language if not set
        if (!localStorage.getItem("currentLang")) {
          const defaultLang = data.data.find((lang: Language) => lang.using) || data.data[0];
          localStorage.setItem("currentLang", defaultLang.id.toString());
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading };
}