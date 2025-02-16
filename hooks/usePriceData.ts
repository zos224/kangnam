import { Service } from "@/utils/model";
import { useEffect, useState } from "react";

export const usePriceData = () => {
    const [priceData, setPriceData] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/service?forPage=price-sheet');
                const data = await res.json();
                setPriceData(data);
            } catch (error) {
                console.error('Failed to fetch price data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { priceData, loading };
}
