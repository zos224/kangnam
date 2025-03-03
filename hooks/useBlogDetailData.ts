import { Blog } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useBlogDetailData({slug} : {slug: string}) {
  const [blog, setBlog] = useState<Blog>();
  const [top10, setTop10] = useState<Blog[]>([]);
  const [bannerBlog, setBannerBlog] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogData] = await Promise.all([
          fetch('/api/blog/' + slug)
        ]);

        const blog = await blogData.json()
        setBlog(blog)
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTop10 = async () => {
        try {
            const [top10Data] = await Promise.all([
            fetch('/api/blog?top10=true')
            ]);
    
            const top10 = await top10Data.json()
            setTop10(top10 || []);
        } catch (error) {
            console.error('Failed to fetch home data:', error);
        }
    };

    const fetchBanner = async () => {
        try {
            const idLanguage = localStorage.getItem("currentLang")
            const res = await fetch('/api/setting?idLanguage=' + idLanguage);
            const data = await res.json();
            setBannerBlog(data.bannerBlog);
        } catch (error) {
            console.error('Failed to fetch price data:', error);
        }
    }

    fetchData();
    fetchTop10();
    fetchBanner();
  }, []);

  return {blog, top10, bannerBlog, loading };
}