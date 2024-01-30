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
import { Loader2 } from "lucide-react";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { Label } from "../ui/label";
import { useClient, useProduct } from "@/hooks/use-fetch-data";

export const EditSaleModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "editSale";
    const { sale } = data;

    const form = useForm<z.infer<typeof salesSchema>>({
        resolver: zodResolver(salesSchema),
        defaultValues: {
            client: "",
            payment: 0,
            product: "",
            qty: 0,
            rate: 0,
        },
    });
    const [total, setTotal] = useState(0);
    const { data: clients, isLoading: isClientLoading } = useClient();
    const { data: products, isLoading: isProductLoading } = useProduct();

    useEffect(() => {
        if (sale) {
            form.setValue("product", sale?.product?._id);
            form.setValue("client", sale?.client?._id);
            form.setValue("payment", sale?.payment);
            form.setValue("qty", sale?.qty);
            form.setValue("rate", sale?.rate);

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
            updateData(["sales-list"], data?.sale);
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
                    <DialogTitle className="uppercase text-sm md:text-base">
                        Edit Sale
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((value) => mutate(value))}
                        className="flex flex-col gap-3"
                    >
                        {/* Product */}
                        <FormField
                            control={form.control}
                            name="product"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">
                                        Product
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
                                    <FormLabel className="uppercase">
                                        Client
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            defaultValue={field.value}
                                            onValueChange={(e: string) => {
                                                field.onChange(e);
                                            }}
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
                                                        Clients
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
                                    <FormLabel className="uppercase">
                                        qty
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
                                    <FormLabel className="uppercase">
                                        Rate
                                    </FormLabel>
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

                        {/* Payment */}
                        <FormField
                            control={form.control}
                            name="payment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase">
                                        Payment
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            min={0}
                                            placeholder="Payment"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Total */}
                        <div className="flex flex-col gap-3">
                            <Label className="uppercase">Total</Label>
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
                                "Submit"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
