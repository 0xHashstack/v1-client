import { create } from 'zustand';

type CacheData = {
    data: any;
    timestamp: number;
};

type CacheStore = {
    oraclePricesCache: CacheData | null;
    isLoadingOraclePrices: boolean;
    setOraclePricesCache: (data: any) => void;
    clearOraclePricesCache: () => void;
    setIsLoadingOraclePrices: (loading: boolean) => void;
};

export const useCacheStore = create<CacheStore>((set) => ({
    oraclePricesCache: null,
    isLoadingOraclePrices: false,
    setOraclePricesCache: (data: any) => set({
        oraclePricesCache: {
            data,
            timestamp: Date.now()
        },
        isLoadingOraclePrices: false
    }),
    clearOraclePricesCache: () => set({ oraclePricesCache: null }),
    setIsLoadingOraclePrices: (loading: boolean) => set({ isLoadingOraclePrices: loading })
}));
