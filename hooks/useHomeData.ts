import { useState, useEffect } from 'react';
import { useLanguageData } from './useLanguageData';

export function useHomeData() {
  const [homeContent, setHomeContent] = useState<any>(null);
  const [shows, setShows] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [branchs, setBranchs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get language data and loading state
  const { loading: languageLoading } = useLanguageData();

  useEffect(() => {
    // Only fetch home data after language data is loaded
    if (!languageLoading) {
      const fetchData = async () => {
        try {
          const idLanguage = localStorage.getItem("currentLang");
          if (!idLanguage) {
            throw new Error("Language ID not found");
          }

          const [homeContentRes, showsRes, doctorsRes, departmentRes, branchRes, newestBlogs] = await Promise.all([
            fetch('/api/home-content?idLanguage=' + idLanguage),
            fetch('/api/show?idLanguage=' + idLanguage),
            fetch('/api/doctor?forPage=home'),
            fetch('/api/department?idLanguage=' + idLanguage),
            fetch('/api/branch'),
            fetch('/api/blog?newest3=true')
          ]);

          const [homeContentData, showsData, doctorsData, departmentData, branchData, blogData] = await Promise.all([
            homeContentRes.json(),
            showsRes.json(),
            doctorsRes.json(),
            departmentRes.json(),
            branchRes.json(),
            newestBlogs.json()
          ]);

          setHomeContent(homeContentData);
          setShows(showsData.data || []);
          setDoctors(doctorsData || []);
          setDepartments(departmentData || []);
          setBranchs(branchData.data || []);
          setBlogs(blogData);
        } catch (error) {
          console.error('Failed to fetch home data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [languageLoading]); // Depend on languageLoading

  return { homeContent, shows, doctors, departments, branchs, blogs, loading: loading || languageLoading };
}