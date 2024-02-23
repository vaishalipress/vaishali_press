"use client";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn, downloadToPDF } from "@/lib/utils";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { filterType } from "@/hooks/useSaleFilter";
import { HtmlHTMLAttributes } from "react";

interface props extends HtmlHTMLAttributes<HTMLDivElement> {
    download?: boolean;
    html?: string;
    downloadName?: string;
    isLoading: boolean;
    date: DateRange | undefined;
    type: filterType;
    toggleType: (value: filterType) => void;
    setDate: (value: DateRange | undefined) => void;
}
export const Filter = ({
    toggleType,
    type,
    date,
    setDate,
    isLoading,
    html,
    downloadName,
    download = true,
    className,
    children,
}: props) => {
    return (
        <div
            className={cn(
                "flex gap-2 justify-start overflow-x-auto no-scrollbar",
                className
            )}
        >
            <Badge
                onClick={() => toggleType("all")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-slate-400 ${
                    type === "all" && "bg-slate-400 text-white"
                }`}
            >
                All
            </Badge>
            <Badge
                onClick={() => toggleType("today")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-slate-400 ${
                    type === "today" && "bg-slate-400 text-white"
                }`}
            >
                Today
            </Badge>
            <Badge
                onClick={() => toggleType("yesterday")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-slate-400 ${
                    type === "yesterday" && "bg-slate-400 text-white"
                }`}
            >
                Yesterday
            </Badge>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(val) => {
                            setDate(val);
                            toggleType("none");
                        }}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
            {children}
            {download && html && (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() =>
                        downloadToPDF(
                            isLoading,
                            html,
                            `${downloadName}-${date?.from?.toDateString()}-${date?.to?.toDateString()}.pdf`
                        )
                    }
                >
                    <Download className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
};
