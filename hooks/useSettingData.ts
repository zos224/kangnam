import { Setting } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useSettingData() {
  const [setting, setSetting] = useState<Setting>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idLanguage = localStorage.getItem("currentLang")
        const [settingRes] = await Promise.all([
          fetch('/api/setting?idLanguage=' + idLanguage)
        ]);

        const settingData = await settingRes.json()
        setSetting(settingData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {setting, loading };
}