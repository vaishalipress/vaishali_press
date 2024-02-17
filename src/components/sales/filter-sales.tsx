"use client";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { filterType } from "@/hooks/useSaleFilter";
import { useClient, useProduct } from "@/hooks/use-fetch-data";
import { ClientTypeExtented, ProductTypeExtended } from "@/lib/types";
import { useEffect, useState } from "react";

export const FilterSale = ({
    toggleType,
    type,
    date,
    setDate,
    client,
    product,
    setClient,
    setProduct,
    setPage,
    setView,
    view,
    page,
}: {
    page: number;
    view: number;
    client: string | undefined;
    product: string | undefined;
    setClient: (value: string) => void;
    setProduct: (value: string) => void;
    date: DateRange | undefined;
    type: filterType;
    toggleType: (value: filterType) => void;
    setDate: (value: DateRange | undefined) => void;
    setPage: (page: number) => void;
    setView: (view: number) => void;
}) => {
    const { data: productsData, isLoading: isProductLoading } = useProduct();
    const [products, setProducts] = useState<ProductTypeExtended[] | undefined>([])

    const { data: clientsData, isLoading: isClientLoading } = useClient();
    const [clients, setClients] = useState<ClientTypeExtented[] | undefined>([])

    useEffect(() => {
        const sorted = clientsData?.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        setClients(sorted)
    }, [clientsData])

    useEffect(() => {
        const sorted = productsData?.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setProducts(sorted)
    }, [productsData])


    const onChangeView = (value: string) => {
        setView(Number(value));
        setPage(1);
    };

    return (
        <div className="flex gap-2 overflow-x-auto px-1">
            <Badge
                onClick={() => toggleType("all")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-indigo-300 ${type === "all" && "bg-indigo-300"
                    }`}
            >
                All
            </Badge>
            <Badge
                onClick={() => toggleType("today")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-indigo-300 ${type === "today" && "bg-indigo-300"
                    }`}
            >
                Today
            </Badge>
            <Badge
                onClick={() => toggleType("yesterday")}
                variant={"secondary"}
                className={`text-sm cursor-pointer hover:bg-indigo-300 ${type === "yesterday" && "bg-indigo-300"
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

            {/* VIEW  */}
            <Select
                value={`${view}`}
                defaultValue={`${view}`}
                onValueChange={onChangeView}
            >
                <SelectTrigger className="w-32">
                    <SelectValue placeholder={"View"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Limit</SelectLabel>
                        {process.env.NODE_ENV === "development" && (
                            <SelectItem value="1">1</SelectItem>
                        )}
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="150">150</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="300">300</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
