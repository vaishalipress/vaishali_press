import { type ClassValue, clsx } from "clsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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
