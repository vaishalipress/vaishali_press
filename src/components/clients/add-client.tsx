"use client";

import { clientSchema } from "@/lib/schema";
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
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/lib/queries";
import { Loader2, X } from "lucide-react";

export default function AddClientForm() {
    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            district: "",
            block: "",
            mobile: "",
        },
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [district, setDistrict] = useState("");
    const { addData } = useCustumQuery();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof clientSchema>) => {
            const { data } = await axios.post(`/api/client`, values);
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            if (data.success) {
                addData(["clients-list"], data.client);
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
                    defaultValue={"ADD CLIENT"}
                    onClick={() => setIsFormOpen(true)}
                />
            ) : (
                <>
                    <div className="flex justify-between">
                        <h1 className="uppercase font-semibold mb-3">
                            add Clients
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

                            {/* District */}
                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>District</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                defaultValue={field.value}
                                                onValueChange={(e: string) => {
                                                    form.setValue("block", "");
                                                    setDistrict(e);
                                                    field.onChange(e);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            "Select district"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Districts
                                                        </SelectLabel>

                                                        {districtsAndBlocks.map(
                                                            (d) => (
                                                                <SelectItem
                                                                    key={d.name}
                                                                    value={d.name.toLowerCase()}
                                                                >
                                                                    {d.name.toUpperCase()}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Block */}
                            <FormField
                                control={form.control}
                                name="block"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Block</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(e: string) => {
                                                    field.onChange(e);
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            "Select block"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Blocks
                                                        </SelectLabel>
                                                        {districtsAndBlocks.map(
                                                            (d) => {
                                                                if (
                                                                    d.name.toLowerCase() ===
                                                                    district
                                                                ) {
                                                                    return d.block.map(
                                                                        (
                                                                            block
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    block
                                                                                }
                                                                                value={block.toLowerCase()}
                                                                            >
                                                                                {block.toUpperCase()}
                                                                            </SelectItem>
                                                                        )
                                                                    );
                                                                }
                                                            }
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Mobile no."
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
