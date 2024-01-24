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
import { productSchema } from "@/lib/schema";
import { Loader2 } from "lucide-react";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";

export const EditProductModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "editProduct";
    const { product } = data;

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
        },
    });

    useEffect(() => {
        if (product) {
            form.setValue("name", product.name);
            form.setValue("price", product.price);
        }
    }, [form, product]);

    const { updateData } = useCustumQuery();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof productSchema>) => {
            const { data } = await axios.put(
                `/api/product?id=${product?._id}`,
                values
            );
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            updateData(["products-list"], data.product);
            form.reset();
            onClose();
        },
        onError: handleAxiosError,
    });

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] ">
                <DialogHeader>
                    <DialogTitle className="uppercase text-sm md:text-base">
                        Edit Product
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((value) => mutate(value))}
                        className="flex flex-col gap-3"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* District */}

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Price"
                                            type="number"
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            variant={"secondary"}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
