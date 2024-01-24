"use client";

import { productSchema } from "@/lib/schema";
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
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { Loader2, X } from "lucide-react";

export default function AddProduct() {
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
        },
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { addData } = useCustumQuery();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof productSchema>) => {
            const { data } = await axios.post(`/api/product`, values);
            console.log(data);
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            if (data.success) {
                addData(["products-list"], data.product);
                form.reset();
            }
        },

        onError: handleAxiosError,
    });

    return (
        <div className="max-w-3xl w-full border px-4 py-3 rounded-md">
            {!isFormOpen ? (
                <Input
                    readOnly
                    defaultValue={"ADD PRODUCT"}
                    onClick={() => setIsFormOpen(true)}
                />
            ) : (
                <>
                    <div className="flex justify-between">
                        <h1 className="uppercase font-semibold mb-3">
                            add Product
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
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={0}
                                                placeholder="Price"
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
