import { Department, HomeContent } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useDoctorData() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes] = await Promise.all([
          fetch('/api/department?forPage=doctor&idLanguage=3')
        ]);

        const departmentData = await departmentRes.json()
        setDepartments(departmentData || []);
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