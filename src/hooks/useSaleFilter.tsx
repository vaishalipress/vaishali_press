import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type filterType = "all" | "today" | "yesterday" | "none";
interface StoreType {
    page: number;
    view: number;
    setPage: (page: number) => void;
    setView: (page: number) => void;
    type: filterType;
    toggleType: (type: filterType) => void;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    client: string | undefined;
    setClient: (user: string) => void;
    product: string | undefined;
    setProduct: (product: string) => void;
    market: string | undefined;
    district: string | undefined;
    setMarket: (market: string) => void;
    setDistrict: (district: string) => void;
}
export const useSaleFilter = create<StoreType>((set) => ({
    page: 1,
    view: 200,
    setPage: (page: number) => set({ page }),
    setView: (view: number) => set({ view }),
    type: "all",
    date: undefined,
    client: "all",
    product: "all",
    market: undefined,
    district: undefined,
    setDate: (date) => set({ date }),
    setProduct: (product: string) => set({ product }),
    setClient: (client: string) => set({ client }),
    toggleType: (type: filterType) => {
        set({
            type,
        });
        const now = new Date();
        switch (type) {
            case "all":
                set({
                    date: undefined,
                });
                break;

            case "today":
                // Create today's date at local midnight
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                set({
                    date: {
                        from: today,
                        to: today,
                    },
                });
                break;
            case "yesterday":
                // Create yesterday's date at local midnight
                const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                set({
                    date: {
                        from: yesterday,
                        to: yesterday,
                    },
                });
                break;
        }
    },
    setDistrict: (district) => set({ district }),
    setMarket: (market) => set({ market }),
}));
