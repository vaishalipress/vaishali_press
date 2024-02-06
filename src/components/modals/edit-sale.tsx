"use client";
import { useModal } from "@/hooks/use-modal-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { salesSchema } from "@/lib/schema";
import {
    BadgeIndianRupee,
    Box,
    CalendarIcon,
    IndianRupee,
    Loader2,
    Package,
    PackagePlus,
    Pencil,
    Trash,
    User,
} from "lucide-react";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { Label } from "../ui/label";
import { useClient, useProduct } from "@/hooks/use-fetch-data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useFilter } from "@/hooks/useFilter";

export const EditSaleModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "editSale";
    const { sale } = data;

    const form = useForm<z.infer<typeof salesSchema>>({
        resolver: zodResolver(salesSchema),
        defaultValues: {
            client: "",
            product: "",
            qty: 0,
            rate: 0,
            date: new Date(),
        },
    });
    const [total, setTotal] = useState(0);
    const { data: clients, isLoading: isClientLoading } = useClient();
    const { data: products, isLoading: isProductLoading } = useProduct();
    const { date, product, client, market, district } = useFilter();
    useEffect(() => {
        if (sale) {
            form.setValue("product", sale?.product?._id);
            form.setValue("client", sale?.client?._id);
            form.setValue("qty", sale?.qty);
            form.setValue("rate", sale?.rate);
            form.setValue("date", new Date(sale?.date));
            setTotal(sale?.qty * sale?.rate);
        }
    }, [form, sale]);

    const { updateData } = useCustumQuery();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof salesSchema>) => {
            const { data } = await axios.put(
                `/api/sale?id=${sale?._id}`,
                values
            );
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            updateData(
                [
                    "sales-list",
                    date?.from?.getDate(),
                    date?.to?.getDate(),
                    client,
                    product,
                    district,
                    market,
                ],
                data?.sale
            );
            form.reset();
            onClose();
        },
        onError: handleAxiosError,
    });

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] ">
                {/* <DialogContent> */}
                <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center uppercase text-sm md:text-base">
                        <Pencil className="text-indigo-600" /> Edit Sale
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((value) => mutate(value))}
                        className="flex flex-col gap-3"
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
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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
                                        <Box className="text-teal-600 w-5 h-5" />{" "}
                                        <span>PRODUCT</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            defaultValue={field.value}
                                            onValueChange={(e: string) => {
                                                const p = products?.filter(
                                                    (p) => p._id === e
                                                );

                                                form.setValue(
                                                    "rate",
                                                    Number(p?.[0].price)
                                                );
                                                field.onChange(e);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        "SELECT PRODUCT"
                                                    }
                                                />
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
                                                            key={p.name}
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
                        {/* Client */}
                        <FormField
                            control={form.control}
                            name="client"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex gap-2 items-center">
                                        <User className="text-rose-600 w-5 h-5" />{" "}
                                        <span>CLIENT</span>
                                    </FormLabel>

                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        "SELECT CLIENT"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Clients - market - block
                                                    </SelectLabel>
                                                    {isClientLoading && (
                                                        <SelectLabel className="text-center">
                                                            <Loader2 className="animate-spin" />
                                                        </SelectLabel>
                                                    )}

                                                    {clients?.map((c) => (
                                                        <SelectItem
                                                            key={c.name}
                                                            value={c._id}
                                                        >
                                                            {c.name.toUpperCase()}
                                                            {c?.market &&
                                                                ` - ${c?.market?.toUpperCase()}`}
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

                        {/* qty */}
                        <FormField
                            control={form.control}
                            name="qty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex gap-2 items-center">
                                        <Package className="text-lime-600 w-5 h-5" />{" "}
                                        <span>QTY</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={(e) => {
                                                setTotal(
                                                    Number(e.target.value) *
                                                        form.getValues("rate")
                                                );
                                                field.onChange(
                                                    Number(e.target.value)
                                                );
                                            }}
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
                                        <BadgeIndianRupee className="w-5 h-5 text-indigo-600" />{" "}
                                        <span>RATE</span>
                                    </Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={(e) => {
                                                setTotal(
                                                    Number(e.target.value) *
                                                        form.getValues("qty")
                                                );
                                                field.onChange(
                                                    Number(e.target.value)
                                                );
                                            }}
                                            min={0}
                                            placeholder="Quantity"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Total */}
                        <div className="flex flex-col gap-3">
                            <Label className="flex gap-1 items-center">
                                <IndianRupee className="text-zinc-700 w-5 h-5" />{" "}
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
                                        UPDATE
                                    </span>
                                </div>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant={"destructive"}
                            className="px-2 py-0 flex items-center gap-2"
                            onClick={() => {
                                onOpen("deleteSale", { sale });
                            }}
                        >
                            <Trash className="w-3 h-3 md:w-4 md:h-4" />
                            <span>DELETE</span>
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
