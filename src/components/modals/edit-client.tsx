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
import { clientSchema } from "@/lib/schema";
import { districtsAndBlocks } from "@/lib/contants";
import { Loader2, Pencil } from "lucide-react";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { useMarket } from "@/hooks/use-fetch-data";

export const EditClientModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "editClient";
    const { client } = data;

    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            district: "",
            block: "",
            mobile: "",
            market: "",
        },
    });
    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");
    useEffect(() => {
        if (client) {
            form.setValue("name", client?.name);
            form.setValue("district", client?.district);
            setDistrict(client?.district);
            form.setValue("block", client?.block);
            setBlock(client?.block);
            form.setValue("market", client?.market || "");
            form.setValue("mobile", client?.mobile || "");
        }
    }, [form, client]);

    const { data: markets, isLoading: isMarketLoading } = useMarket(
        district,
        block
    );
    const { updateData } = useCustumQuery();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof clientSchema>) => {
            const { data } = await axios.put(
                `/api/client?id=${client?._id}`,
                values
            );
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            updateData(["clients-list"], data.client);
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
                                                setBlock(e);
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

                        {/* Market */}
                        <FormField
                            control={form.control}
                            name="market"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Market</FormLabel>
                                    <div className="flex gap-3 items-center">
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
                                                            "Select Market"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Markets
                                                        </SelectLabel>
                                                        {isMarketLoading && (
                                                            <SelectLabel>
                                                                Loading...
                                                            </SelectLabel>
                                                        )}
                                                        {markets?.map(
                                                            (market) => (
                                                                <SelectItem
                                                                    key={
                                                                        market._id
                                                                    }
                                                                    value={market.name.toLowerCase()}
                                                                >
                                                                    {market.name.toUpperCase()}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant={"secondary"}
                                            size={"sm"}
                                            onClick={() =>
                                                onOpen("market", {
                                                    market: {
                                                        district,
                                                        block,
                                                    },
                                                })
                                            }
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </div>
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
            </DialogContent>
        </Dialog>
    );
};
