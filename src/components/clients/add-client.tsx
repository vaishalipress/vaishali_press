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
import { DISTRICTS } from "@/lib/constants";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import {
    Loader2,
    Pencil,
    Pentagon,
    PlusCircle,
    Smartphone,
    Smile,
    ToyBrick,
    User,
    X,
} from "lucide-react";
import { useMarket } from "@/hooks/use-fetch-data";
import { useModal } from "@/hooks/use-modal-store";

export default function AddClientForm() {
    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            district: "",
            mobile: "",
            market: "",
        },
    });
    const { onOpen } = useModal();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [district, setDistrict] = useState("");
    const { addData } = useCustumQuery();
    const { data: markets, isLoading: isMarketLoading } = useMarket(district);
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
        <div className="max-w-7xl w-full border px-4 py-3 rounded-md shadow-md">
            {!isFormOpen ? (
                <div
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <PlusCircle className="w-6 h-6 text-orange-600" />
                    <span className="uppercase text-orange-700 font-semibold">
                        Add Client
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center mb-5">
                            <PlusCircle className="w-6 h-6 text-orange-600" />
                            <span className="uppercase text-orange-700 font-semibold">
                                Add Client
                            </span>
                        </div>
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
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Smile className="text-orange-900 w-4 h-4" />{" "}
                                            <span>NAME</span>
                                        </FormLabel>
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
                                        <FormLabel className="flex gap-2 items-center">
                                            <ToyBrick className="text-slate-600 w-4 h-4" />{" "}
                                            <span>DISTRICT</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                defaultValue={field.value}
                                                onValueChange={(e: string) => {
                                                    form.setValue("market", "");
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

                                                        {DISTRICTS.map((d) => (
                                                            <SelectItem
                                                                key={d}
                                                                value={d.toLowerCase()}
                                                            >
                                                                {d.toUpperCase()}
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

                            {/* Market */}
                            <FormField
                                control={form.control}
                                name="market"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Pentagon className="text-indigo-600 w-4 h-4" />{" "}
                                            <span>MARKET</span>
                                        </FormLabel>
                                        <div className="flex gap-3 items-center">
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(
                                                        e: string
                                                    ) => {
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
                                        <FormLabel className="flex gap-2 items-center">
                                            <Smartphone className="text-zinc-600 w-4 h-4" />{" "}
                                            <span>MOBILE</span>
                                        </FormLabel>
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
                                    <div className="flex items-center gap-2">
                                        <User className="text-green-600 w-5 h-5" />
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
