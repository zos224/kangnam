import { useEffect, useState } from 'react';
import { Service, BlogType } from '@/utils/model';
import { useLanguageData } from './useLanguageData';

export function useHeaderData() {
  const [services, setServices] = useState<Service[]>([]);
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get language data and loading state
  const { loading: languageLoading } = useLanguageData();

  useEffect(() => {
    // Only fetch header data after language data is loaded
    if (!languageLoading) {
      const fetchData = async () => {
        try {
          const idLanguage = localStorage.getItem("currentLang");
          const [servicesRes, blogTypesRes] = await Promise.all([
            fetch('/api/service?idLanguage=' + idLanguage),
            fetch('/api/blog-type')
          ]);

          const [servicesData, blogTypesData] = await Promise.all([
            servicesRes.json(),
            blogTypesRes.json()
          ]);

          setServices(servicesData.data);
          setBlogTypes(blogTypesData);
        } catch (error) {
          console.error('Failed to fetch header data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [languageLoading]); // Depend on languageLoading

  return { services, blogTypes, loading: loading || languageLoading };
}