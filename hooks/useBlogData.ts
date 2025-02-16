import { Blog, BlogType } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useBlogData({slug, page, limit} : {slug: string, page: number, limit: number}) {
  const [blogs, setBlogs] = useState<BlogType>();
  const [top10, setTop10] = useState<Blog[]>([]);
  const [bannerBlog, setBannerBlog] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogData] = await Promise.all([
          fetch('/api/blog-type/' + slug + "?page=" + page + "&limit=" + limit)
        ]);

        const blogs = await blogData.json()
        setBlogs(blogs.data || []);
        setTotalPages(blogs.pagination.totalPages)
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
  }, [slug, page, limit]);

  return {blogs, top10, bannerBlog, loading, totalPages };
}