import { Facilities } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useFacilitiesData() {
  const [facilities, setFacilities] = useState<Facilities>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idLanguage = localStorage.getItem("currentLang")
        const [FacilitiesRes] = await Promise.all([
          fetch('/api/facilities?idLanguage=' + idLanguage)
        ]);

        const FacilitiesData = await FacilitiesRes.json()
        setFacilities(FacilitiesData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {facilities, loading };
}