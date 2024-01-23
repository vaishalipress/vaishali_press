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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientSchema } from "@/lib/schema";
import { districtsAndBlocks } from "@/lib/contants";

export const EditClientModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "editClient";
    const { client } = data;

    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            district: "",
            block: "",
            mobile: "",
        },
    });
    const [district, setDistrict] = useState("");

    function onSubmit(values: z.infer<typeof clientSchema>) {
        console.log(values);
    }

    useEffect(() => {
        if (client) {
            form.setValue("name", client.name);
            form.setValue("district", client.district);
            setDistrict(client.district);
            form.setValue("block", client.block);
            form.setValue("mobile", client.mobile || "");
        }
    }, [form, client]);

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof clientSchema>) => {
            const { data } = await axios.put("/api/users", values);
            return data;
        },

        onSuccess(data, variables) {
            if (data) {
                toast(data?.message);
            }
            // if (data.success) {
            //     queryClient.setQueryData(
            //         ["users", searchParams?.page, searchParams?.userId],
            //         (old: {
            //             total: number;
            //             users: z.infer<typeof franchiseEditSchema>[];
            //         }) => {
            //             const users = old.users.map((user) =>
            //                 user.id === variables.id
            //                     ? {
            //                           img: variables.img,
            //                           id: variables.id,
            //                           isActive: variables.isActive,
            //                           password: variables.password,
            //                           role: variables.role,
            //                           userId: variables.userId,
            //                           name: variables.name,
            //                           branch: variables.branch,
            //                           email: variables.email,
            //                           phone: variables.phone,
            //                           address: {
            //                               state: variables.state,
            //                               district: variables.district,
            //                               pincode: variables.pincode,
            //                               street: variables.address,
            //                           },
            //                       }
            //                     : user
            //             );

            //             return {
            //                 total: old.total,
            //                 users,
            //             };
            //         }
            //     );
            //     form.reset();
            //     onClose();
            // }
        },
    });

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] ">
                {/* <DialogContent> */}
                <DialogHeader>
                    <DialogTitle className="uppercase text-sm md:text-base">
                        Edit Client
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
                                                    placeholder={"Select block"}
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
                                                                    (block) => (
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

                        <Button type="submit" variant={"secondary"}>
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
