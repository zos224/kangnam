import { Blog } from "@/utils/model";
import { useEffect, useState } from "react";

export const useServiceItemDetailData  = ({slug} : {slug: string}) => {
    const [serviceItemDetailData, setServiceItemDetailData] = useState<Blog>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogData] = await Promise.all([
                    fetch('/api/blog/' + slug)
                ]);
      
                const blog = await blogData.json()
                console.log(blog)
                setServiceItemDetailData(blog)
            } catch (error) {
              console.error('Failed to fetch home data:', error);
            } finally {
              setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    return { serviceItemDetailData, loading };
}
