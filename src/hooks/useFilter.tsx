import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type filterType = "all" | "today" | "yesterday" | "none";
interface StoreType {
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
export const useFilter = create<StoreType>((set) => ({
    type: "all",
    date: { to: new Date(), from: undefined },
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
        switch (type) {
            case "all":
                set({
                    date: { from: undefined, to: new Date() },
                });
                break;

            case "today":
                set({
                    date: {
                        from: new Date(),
                        to: new Date(),
                    },
                });
                break;
            case "yesterday":
                let currentDate = new Date();
                let yesterday = new Date(currentDate);
                yesterday.setDate(yesterday.getDate() - 1);
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
