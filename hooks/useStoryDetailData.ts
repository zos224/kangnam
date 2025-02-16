import { Story } from '@/utils/model';
import { useState, useEffect } from 'react';

export function useStoryDetailData({slug} : {slug: string}) {
  const [story, setStory] = useState<Story>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storyRes] = await Promise.all([
          fetch('/api/story/' + slug)
        ]);

        const storyData = await storyRes.json()
        setStory(storyData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {story, loading };
}