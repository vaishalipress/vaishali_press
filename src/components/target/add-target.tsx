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
import {
    Box,
    CalendarIcon,
    Loader2,
    PackagePlus,
    PlusCircle,
    TargetIcon,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { targetSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "@/lib/error";
import { useMarket } from "@/hooks/use-fetch-data";
import { DISTRICTS, MONTHS } from "@/lib/constants";

export default function AddTarget() {
    const date = new Date();
    const form = useForm<z.infer<typeof targetSchema>>({
        resolver: zodResolver(targetSchema),
        defaultValues: {
            market: "",
            month: date.getMonth(),
            year: date.getFullYear(),
            targetQty: 0,
            targetSale: 0,
        },
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const { data: markets, isLoading: isMarketLoading } =
        useMarket(selectedDistrict);
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof targetSchema>) => {
            const { data } = await axios.post(`/api/target`, values);
            console.log(data);
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            queryClient.invalidateQueries({ queryKey: ["target-overview"] });
        },
        onSettled: () => {
            form.resetField("market");
            form.resetField("month");
            form.resetField("targetQty");
            form.resetField("targetSale");
            form.resetField("year");
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
                        Add Target
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center mb-5">
                            <PlusCircle className="w-6 h-6 text-orange-600" />
                            <span className="uppercase text-orange-700 font-semibold">
                                Add Target
                            </span>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => setIsFormOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((value) =>
                                mutate(value)
                            )}
                            className="flex flex-col gap-5"
                        >
                            {/* DISTRICT */}
                            <Select
                                value={selectedDistrict}
                                defaultValue={""}
                                onValueChange={(e) => {
                                    setSelectedDistrict(e);
                                    form.setValue("market", "");
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={"SELECT DISTRICT"}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>DISTRICT</SelectLabel>

                                        {DISTRICTS?.map((district) => (
                                            <SelectItem
                                                key={district}
                                                value={district}
                                            >
                                                {district.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* MARKET */}
                            <FormField
                                control={form.control}
                                name="market"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Box className="text-teal-600 w-5 h-5" />{" "}
                                            <span>MARKET</span>
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
                                                            "SELECT MARKET"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Markets
                                                        </SelectLabel>
                                                        {isMarketLoading && (
                                                            <SelectLabel className="text-center">
                                                                <Loader2 className="animate-spin" />
                                                            </SelectLabel>
                                                        )}

                                                        {markets?.map(
                                                            (market) => (
                                                                <SelectItem
                                                                    key={
                                                                        market._id
                                                                    }
                                                                    value={
                                                                        market._id
                                                                    }
                                                                >
                                                                    {market.name.toUpperCase()}
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

                            {/* YEAR */}
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Box className="text-teal-600 w-5 h-5" />{" "}
                                            <span>YEAR</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                type="number"
                                                min={2000}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* MONTH */}
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <CalendarIcon className="text-indigo-600 w-5 h-5" />
                                            <span>MONTH</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value.toString()}
                                                onValueChange={(e: string) =>
                                                    field.onChange(Number(e))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="SELECT MONTH" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Months
                                                        </SelectLabel>
                                                        {MONTHS.map(
                                                            (month, idx) => (
                                                                <SelectItem
                                                                    key={idx}
                                                                    value={idx.toString()}
                                                                >
                                                                    {month.toUpperCase()}
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

                            {/* TARGET */}
                            <FormField
                                control={form.control}
                                name="targetQty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <TargetIcon className="text-lime-600 w-5 h-5" />{" "}
                                            <span>TARGET SOLD</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => {
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    );
                                                }}
                                                min={0}
                                                placeholder="Target"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="targetSale"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <TargetIcon className="text-lime-600 w-5 h-5" />{" "}
                                            <span>TARGET SALE</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => {
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    );
                                                }}
                                                min={0}
                                                placeholder="Target SALE"
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
