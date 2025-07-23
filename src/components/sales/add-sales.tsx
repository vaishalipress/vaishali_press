"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    BadgeIndianRupee,
    Box,
    CalendarIcon,
    IndianRupee,
    Loader2,
    Package,
    PackagePlus,
    PlusCircle,
    User,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { salesSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { useClient, useProduct } from "@/hooks/use-fetch-data";
import { cn, createDateQueryKey } from "@/lib/utils";
import { format } from "date-fns";
import { useSaleFilter } from "@/hooks/useSaleFilter";
import { DayPicker } from "react-day-picker";

export default function AddSales({
    isFormOpen,
    setIsFormOpen,
}: {
    isFormOpen: boolean;
    setIsFormOpen: (value: boolean) => void;
}) {
    const form = useForm<z.infer<typeof salesSchema>>({
        resolver: zodResolver(salesSchema),
        defaultValues: {
            product: "",
            client: "",
            qty: 0,
            rate: 0,
            date: new Date(),
        },
        mode: "onBlur", // Reduce validation frequency
    });

    const { addSale } = useCustumQuery();
    const { page, view, date } = useSaleFilter();
    const { data: products, isLoading: isProductLoading } = useProduct();
    const { data: clientsData, isLoading: isClientLoading } = useClient();

    // Memoize sorted clients to avoid re-sorting on every render
    const clients = useMemo(() => {
        if (!clientsData) return [];
        return [...clientsData].sort((a, b) => a.name.localeCompare(b.name));
    }, [clientsData]);

    // Memoize total calculation
    const total = useMemo(() => {
        const qty = form.watch("qty");
        const rate = form.watch("rate");
        return qty * rate;
    }, [form.watch("qty"), form.watch("rate")]);

    // Memoize mutation configuration
    const mutationConfig = useMemo(
        () => ({
            mutationFn: async (values: z.infer<typeof salesSchema>) => {
                const { data } = await axios.post(`/api/sale`, values);
                return data;
            },
            onSuccess(data: any) {
                toast("✅ " + (data?.message as string).toUpperCase());
                if (data.success) {
                    // All
                    addSale(
                        [
                            "sales-list",
                            createDateQueryKey(date?.from),
                            createDateQueryKey(date?.to),
                            "all",
                            "all",
                            null,
                            null,
                            1,
                            view,
                        ],
                        data.sale
                    );
                    // Today
                    addSale(
                        [
                            "sales-list",
                            createDateQueryKey(date?.from),
                            createDateQueryKey(date?.to),
                            "all",
                            "all",
                            undefined,
                            undefined,
                            page,
                            view,
                        ],
                        data.sale
                    );
                }
            },
            onSettled: () => {
                form.reset({
                    product: "",
                    client: "",
                    qty: 0,
                    rate: 0,
                    date: new Date(),
                });
            },
            onError: handleAxiosError,
        }),
        [addSale, form, page, view]
    );

    const { mutate, isPending } = useMutation(mutationConfig);

    // Memoize form submit handler
    const handleSubmit = useCallback(
        (values: z.infer<typeof salesSchema>) => {
            mutate(values);
        },
        [mutate]
    );

    // Memoize input change handlers
    const handleQtyChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value);
            form.setValue("qty", value);
        },
        [form]
    );

    const handleRateChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value);
            form.setValue("rate", value);
        },
        [form]
    );

    const handleProductChange = useCallback(
        (productId: string) => {
            const product = products?.find((p) => p._id === productId);
            if (product) {
                form.setValue("rate", Number(product.price));
            }
            form.setValue("product", productId);
        },
        [form, products]
    );

    // Memoize toggle handlers
    const handleToggleOpen = useCallback(() => {
        setIsFormOpen(true);
    }, [setIsFormOpen]);

    const handleToggleClose = useCallback(() => {
        setIsFormOpen(false);
    }, [setIsFormOpen]);

    return (
        <div className="max-w-7xl w-full border px-4 py-3 rounded-md shadow-md">
            {!isFormOpen ? (
                <div
                    onClick={handleToggleOpen}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <PlusCircle className="w-6 h-6 text-orange-600" />
                    <span className="uppercase text-orange-700 font-semibold">
                        Add Sale
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center mb-5">
                            <PlusCircle className="w-6 h-6 text-orange-600" />
                            <span className="uppercase text-orange-700 font-semibold">
                                Add Sale
                            </span>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={handleToggleClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="flex flex-col gap-5"
                        >
                            {/* Date */}
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1">
                                        <FormLabel className="flex gap-2 items-center">
                                            <CalendarIcon className="text-slate-600 w-5 h-5" />
                                            DATE
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[280px] justify-start text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-5 h-5 w-4" />
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <DayPicker
                                                        animate
                                                        mode="single"
                                                        timeZone="UTC"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Client */}
                            <FormField
                                control={form.control}
                                name="client"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <User className="text-rose-600 w-5 h-5" />
                                            <span>CLIENT</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="SELECT CLIENT" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel className="uppercase">
                                                            Clients - market -
                                                            district
                                                        </SelectLabel>
                                                        {isClientLoading && (
                                                            <SelectLabel className="text-center">
                                                                <Loader2 className="animate-spin" />
                                                            </SelectLabel>
                                                        )}
                                                        {clients.map((c) => (
                                                            <SelectItem
                                                                key={c._id}
                                                                value={c._id}
                                                            >
                                                                {c.name.toUpperCase()}
                                                                {c?.market &&
                                                                    ` - ${c.market.toUpperCase()}`}
                                                                {c?.district &&
                                                                    ` - ${c.district.toUpperCase()}`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Product */}
                            <FormField
                                control={form.control}
                                name="product"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Box className="text-teal-600 w-5 h-5" />
                                            <span>PRODUCT</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={
                                                    handleProductChange
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="SELECT PRODUCT" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Products
                                                        </SelectLabel>
                                                        {isProductLoading && (
                                                            <SelectLabel className="text-center">
                                                                <Loader2 className="animate-spin" />
                                                            </SelectLabel>
                                                        )}
                                                        {products?.map((p) => (
                                                            <SelectItem
                                                                key={p._id}
                                                                value={p._id}
                                                            >
                                                                {p.name.toUpperCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Qty */}
                            <FormField
                                control={form.control}
                                name="qty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Package className="text-lime-600 w-5 h-5" />
                                            <span>QTY</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={handleQtyChange}
                                                min={0}
                                                placeholder="Quantity"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Rate */}
                            <FormField
                                control={form.control}
                                name="rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="flex gap-2 items-center">
                                            <BadgeIndianRupee className="w-5 h-5 text-indigo-600" />
                                            <span>RATE</span>
                                        </Label>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={handleRateChange}
                                                min={0}
                                                placeholder="Rate"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Total */}
                            <div className="flex flex-col gap-3">
                                <Label className="flex gap-1 items-center">
                                    <IndianRupee className="text-zinc-700 w-5 h-5" />
                                    <span>TOTAL</span>
                                </Label>
                                <Input readOnly value={total} />
                            </div>

                            <Button
                                type="submit"
                                variant={"secondary"}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <PackagePlus className="text-green-600 w-5 h-5" />
                                        <span className="text-green-600 font-semibold">
                                            ADD
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </div>
    );
}
