import { Department } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useDepartmentsData() {
  const [departments, setdepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idLanguage = localStorage.getItem("currentLang")
        const [departmentsRes] = await Promise.all([
          fetch('/api/department?idLanguage=' + idLanguage)
        ]);

        const departmentsData = await departmentsRes.json()
        setdepartments(departmentsData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {departments, loading };
}