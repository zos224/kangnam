import { Service } from "@/utils/model";
import { useEffect, useState } from "react";

export const useServiceDetailData  = ({slug} : {slug: string}) => {
    const [serviceDetailData, setServiceDetailData] = useState<Service>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/service/' + slug);
                const data = await res.json();
                setServiceDetailData(data);
            } catch (error) {
                console.error('Failed to fetch price data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { serviceDetailData, loading };
}
