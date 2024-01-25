"use client";

import { salesSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { districtsAndBlocks } from "@/lib/contants";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { Loader2, X } from "lucide-react";
import { useClient, useProduct } from "@/hooks/use-fetch-data";
import { Label } from "../ui/label";

export default function AddSales() {
    const form = useForm<z.infer<typeof salesSchema>>({
        resolver: zodResolver(salesSchema),
        defaultValues: {
            product: "",
            client: "",
            qty: 0,
            rate: 0,
            payment: 0,
        },
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { addData } = useCustumQuery();
    const [total, setTotal] = useState(0);
    const { data: clients, isLoading: isClientLoading } = useClient();
    const { data: products, isLoading: isProductLoading } = useProduct();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof salesSchema>) => {
            const { data } = await axios.post(`/api/sale`, values);
            console.log(data);
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            if (data.success) {
                addData(["sales-list"], data.sale);
                form.reset();
                setTotal(0);
            }
        },

        onError: handleAxiosError,
    });

    return (
        <div className="max-w-6xl w-full border px-4 py-3 rounded-md">
            {!isFormOpen ? (
                <Input
                    readOnly
                    defaultValue={"ADD SALE"}
                    onClick={() => setIsFormOpen(true)}
                />
            ) : (
                <>
                    <div className="flex justify-between">
                        <h1 className="uppercase font-semibold mb-3">
                            add Sales
                        </h1>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => setIsFormOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((value) =>
                                mutate(value)
                            )}
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
                                                            form.getValues(
                                                                "rate"
                                                            )
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
                                                            form.getValues(
                                                                "qty"
                                                            )
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
                </>
            )}
        </div>
    );
}
