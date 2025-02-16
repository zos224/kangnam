import { Introduce } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useIntroduceData() {
  const [introduce, setIntroduce] = useState<Introduce>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idLanguage = localStorage.getItem("currentLang")
        const [introduceRes] = await Promise.all([
          fetch('/api/introduce?idLanguage=' + idLanguage)
        ]);

        const introduceData = await introduceRes.json()
        setIntroduce(introduceData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {introduce, loading };
}