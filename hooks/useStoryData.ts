import { Story } from "@/utils/model";
import { useEffect, useState } from "react";

export const useStoryData = () => {
    const [storyData, setStoryData] = useState<Story[]>([]);
    const [bannerStory, setBannerStory] = useState<string>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/story?fullData=true');
                const data = await res.json();
                setStoryData(data);
            } catch (error) {
                console.error('Failed to fetch price data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBanner = async () => {
            try {
                const idLanguage = localStorage.getItem("currentLang")
                const res = await fetch('/api/setting?idLanguage=' + idLanguage);
                const data = await res.json();
                setBannerStory(data.bannerStory);
            } catch (error) {
                console.error('Failed to fetch price data:', error);
            }
        }

        fetchData();
        fetchBanner();
    }, []);

    return { storyData, bannerStory, loading };
}
