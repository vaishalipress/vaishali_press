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
import { z } from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import Select from "react-select";

// Custom styles for react-select to match your UI theme
const customSelectStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        minHeight: "40px",
        borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
        borderRadius: "6px",
        boxShadow: state.isFocused
            ? "0 0 0 2px rgba(59, 130, 246, 0.1)"
            : "none",
        "&:hover": {
            borderColor: "#cbd5e1",
        },
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#9ca3af",
        fontSize: "14px",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "#374151",
        fontSize: "14px",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? "#3b82f6"
            : state.isFocused
            ? "#f1f5f9"
            : "white",
        color: state.isSelected ? "white" : "#374151",
        fontSize: "14px",
        "&:hover": {
            backgroundColor: state.isSelected ? "#3b82f6" : "#f1f5f9",
        },
    }),
    menu: (provided: any) => ({
        ...provided,
        borderRadius: "6px",
        boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }),
    loadingMessage: (provided: any) => ({
        ...provided,
        color: "#6b7280",
    }),
    noOptionsMessage: (provided: any) => ({
        ...provided,
        color: "#6b7280",
    }),
};

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

    // Memoize client options for react-select
    const clientOptions = useMemo(() => {
        return clients.map((client) => ({
            value: client._id,
            label: `${client.name.toUpperCase()}${
                client?.market ? ` - ${client.market.toUpperCase()}` : ""
            }${client?.district ? ` - ${client.district.toUpperCase()}` : ""}`,
        }));
    }, [clients]);

    // Memoize product options for react-select
    const productOptions = useMemo(() => {
        if (!products) return [];
        return products.map((product) => ({
            value: product._id,
            label: product.name.toUpperCase(),
        }));
    }, [products]);

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
                    date: form.getValues("date"),
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
            // Convert date to UTC ISO string before sending to server
            const utcValues = {
                ...values,
                date: values.date.toISOString(),
            };
            mutate(utcValues);
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
        (selectedOption: any) => {
            const productId = selectedOption?.value || "";
            const product = products?.find((p) => p._id === productId);
            if (product) {
                form.setValue("rate", Number(product.price));
            }
            form.setValue("product", productId);
        },
        [form, products]
    );

    const handleClientChange = useCallback(
        (selectedOption: any) => {
            const clientId = selectedOption?.value || "";
            form.setValue("client", clientId);
        },
        [form]
    );

    // Memoize toggle handlers
    const handleToggleOpen = useCallback(() => {
        setIsFormOpen(true);
    }, [setIsFormOpen]);

    const handleToggleClose = useCallback(() => {
        setIsFormOpen(false);
    }, [setIsFormOpen]);

    // Get selected values for react-select
    const selectedClient = clientOptions.find(
        (option) => option.value === form.watch("client")
    );
    const selectedProduct = productOptions.find(
        (option) => option.value === form.watch("product")
    );

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
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        captionLayout="dropdown"
                                                        startMonth={new Date(2020, 0)}
                                                        endMonth={new Date(2030, 11)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Client with Search */}
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
                                                options={clientOptions}
                                                value={selectedClient}
                                                onChange={handleClientChange}
                                                placeholder="SELECT CLIENT"
                                                isSearchable
                                                isClearable
                                                isMulti={false}
                                                isLoading={isClientLoading}
                                                loadingMessage={() =>
                                                    "Loading clients..."
                                                }
                                                noOptionsMessage={() =>
                                                    "No clients found"
                                                }
                                                styles={customSelectStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                filterOption={(
                                                    option,
                                                    inputValue
                                                ) =>
                                                    option.label
                                                        .toLowerCase()
                                                        .includes(
                                                            inputValue.toLowerCase()
                                                        )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Product with Search */}
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
                                                options={productOptions}
                                                value={selectedProduct}
                                                onChange={handleProductChange}
                                                placeholder="SELECT PRODUCT"
                                                isSearchable
                                                isClearable
                                                isMulti={false}
                                                isLoading={isProductLoading}
                                                loadingMessage={() =>
                                                    "Loading products..."
                                                }
                                                noOptionsMessage={() =>
                                                    "No products found"
                                                }
                                                styles={customSelectStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                filterOption={(
                                                    option,
                                                    inputValue
                                                ) =>
                                                    option.label
                                                        .toLowerCase()
                                                        .includes(
                                                            inputValue.toLowerCase()
                                                        )
                                                }
                                            />
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
