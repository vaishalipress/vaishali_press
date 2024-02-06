import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { filterType } from "@/hooks/useFilter";
import { useClient, useProduct } from "@/hooks/use-fetch-data";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export const FilterSale = ({
    toggleType,
    type,
    date,
    setDate,
    client,
    product,
    setClient,
    setProduct,
}: {
    client: string | undefined;
    product: string | undefined;
    setClient: (value: string) => void;
    setProduct: (value: string) => void;
    date: DateRange | undefined;
    type: filterType;
    toggleType: (value: filterType) => void;
    setDate: (value: DateRange | undefined) => void;
}) => {
    const { data: clients, isLoading: isClientLoading } = useClient();
    const { data: products, isLoading: isProductLoading } = useProduct();
    return (
        <div className="flex gap-2 overflow-x-auto px-1">
            <Badge
                onClick={() => toggleType("all")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-indigo-300 ${
                    type === "all" && "bg-indigo-300"
                }`}
            >
                All
            </Badge>
            <Badge
                onClick={() => toggleType("today")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-indigo-300 ${
                    type === "today" && "bg-indigo-300"
                }`}
            >
                Today
            </Badge>
            <Badge
                onClick={() => toggleType("yesterday")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-indigo-300 ${
                    type === "yesterday" && "bg-indigo-300"
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

            {/* client */}
            <Select
                value={client}
                defaultValue={client}
                onValueChange={setClient}
            >
                <SelectTrigger>
                    <SelectValue placeholder={"SELECT CLIENT"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel className="uppercase">
                            Clients - market - district
                        </SelectLabel>
                        {isClientLoading && (
                            <SelectLabel className="text-center">
                                <Loader2 className="animate-spin" />
                            </SelectLabel>
                        )}
                        <SelectItem value={"all"}>ALL CLIENT</SelectItem>
                        {clients?.map((c) => (
                            <SelectItem key={c.name} value={c._id}>
                                {c.name.toUpperCase()}
                                {c?.market && ` - ${c?.market?.toUpperCase()}`}
                                {c?.district &&
                                    ` - ${c.district.toUpperCase()}`}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Product */}
            <Select
                value={product}
                defaultValue={product}
                onValueChange={setProduct}
            >
                <SelectTrigger>
                    <SelectValue placeholder={"SELECT PRODUCT"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Products</SelectLabel>
                        {isProductLoading && (
                            <SelectLabel className="text-center">
                                <Loader2 className="animate-spin" />
                            </SelectLabel>
                        )}
                        <SelectItem value={"all"}>ALL PRODUCT</SelectItem>
                        {products?.map((p) => (
                            <SelectItem key={p.name} value={p._id}>
                                {p.name.toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
