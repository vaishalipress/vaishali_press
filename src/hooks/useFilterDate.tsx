import { useState } from "react";
import { DateRange } from "react-day-picker";

export type filterType = "all" | "today" | "yesterday" | "none";

export const useFilterDate = () => {
    const [type, setType] = useState<filterType>("all");
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: new Date(),
    });
    const toggleType = (type: filterType) => {
        setType(type);
        switch (type) {
            case "all":
                setDate({
                    from: undefined,
                    to: new Date(),
                });
                break;

            case "today":
                setDate({
                    from: new Date(),
                    to: new Date(),
                });
                break;
            case "yesterday":
                let currentDate = new Date();
                let yesterday = new Date(currentDate);
                yesterday.setDate(yesterday.getDate() - 1);
                setDate({
                    from: yesterday,
                    to: yesterday,
                });
                break;
        }
    };

    return { type, setType, date, setDate, toggleType };
};
