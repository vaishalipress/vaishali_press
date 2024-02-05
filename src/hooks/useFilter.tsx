import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type filterType = "all" | "today" | "yesterday" | "none";
interface StoreType {
    type: filterType;
    toggleType: (type: filterType) => void;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
}
export const useFilter = create<StoreType>((set) => ({
    type: "all",
    date: { to: new Date(), from: undefined },
    setDate: (date) => set({ date }),
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
}));
