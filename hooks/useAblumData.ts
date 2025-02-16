import { Service } from "@/utils/model";
import { useEffect, useState } from "react";

export const useAlbumData = () => {
    const [albumData, setAlbumData] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/service?forPage=album');
                const data = await res.json();
                setAlbumData(data);
            } catch (error) {
                console.error('Failed to fetch price data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { albumData, loading };
}
