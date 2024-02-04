import { useState } from "react";
import { DateRange } from "react-day-picker";

export const useFilter = () => {
    const [type, setType] = useState("all");
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: new Date(),
    });

    const toggleType = (type: "all" | "today" | "yesterday" | "none") => {
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

    return { date, setDate, setType, toggleType, type };
};
