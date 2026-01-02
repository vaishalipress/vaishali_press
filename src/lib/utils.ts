import { type ClassValue, clsx } from "clsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getDayMin = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    return newDate;
};
export const getDayMax = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(23);
    newDate.setMinutes(59);
    newDate.setSeconds(59);
    return newDate;
};

export const downloadToPDF = (
    isLoading: boolean,
    html: string,
    downloadName: string
) => {
    if (isLoading) {
        toast("Please wait.");
        return;
    }
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
        html: html,
    });
    doc.save(downloadName);
    doc.autoPrint();
};

export const IMAGE_SIZE = 1024000 * 5; // 1mb = 1024000

export function capitalizeWords(input: string): string {
    return input
        .trim()
        .split(/\s+/) // split by one or more spaces
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
}
// Utility function to format dates consistently in UTC
export const formatDateToUTC = (date: Date): string => {
    return date.toISOString();
};

// Utility function to create stable query keys from dates
export const createDateQueryKey = (date: Date | undefined): string | null => {
    return date ? date.toISOString() : null;
};

// Format dates for display - shows the date in user's local timezone
// For dates stored as UTC, this converts them to local time for display
export const formatDateUTC = (
    date: string | Date | null | undefined,
    pattern: string = "dd-MM-yyyy"
): string => {
    if (!date) return "";

    const dateObj = new Date(date);
    if (!isValid(dateObj)) return "";

    // Format the date in user's local timezone
    // The date from DB (UTC) is automatically converted to local time
    return format(dateObj, pattern);
};

// Create UTC date from date components (preserving the visual date)
// export const createUTCDate = (
//     year: number,
//     month: number,
//     day: number
// ): Date => {
//     return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
// };

// Create UTC date from any date input (preserving the visual date selected in calendar)
// export const toUTCDate = (date: Date): Date => {
//     return new Date(
//         Date.UTC(
//             date.getFullYear(),
//             date.getMonth(),
//             date.getDate(),
//             0,
//             0,
//             0,
//             0
//         )
//     );
// };

// Get today's date in UTC (start of day)
// export const getTodayUTC = (): Date => {
//     const now = new Date();
//     return new Date(
//         Date.UTC(
//             now.getUTCFullYear(),
//             now.getUTCMonth(),
//             now.getUTCDate(),
//             0,
//             0,
//             0,
//             0
//         )
//     );
// };

// Get yesterday's date in UTC (start of day)
// export const getYesterdayUTC = (): Date => {
//     const now = new Date();
//     return new Date(
//         Date.UTC(
//             now.getUTCFullYear(),
//             now.getUTCMonth(),
//             now.getUTCDate() - 1,
//             0,
//             0,
//             0,
//             0
//         )
//     );
// };
