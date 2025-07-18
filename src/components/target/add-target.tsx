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
    CalendarIcon,
    CircleOff,
    Loader2,
    PackagePlus,
    PlusCircle,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { districtTargetSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAxiosError } from "@/lib/error";
import { useMarket } from "@/hooks/use-fetch-data";
import { DISTRICTS } from "@/lib/constants";
import axios from "axios";

export default function AddTarget() {
    const form = useForm<z.infer<typeof districtTargetSchema>>({
        resolver: zodResolver(districtTargetSchema),
        defaultValues: {
            markets: [],
        },
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const { data: markets, isLoading: isMarketLoading } =
        useMarket(selectedDistrict);
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof districtTargetSchema>) => {
            const dirtyIdxs = getDirtyIndex(form.formState.dirtyFields);
            const dirtyFields = getDirtyFields(dirtyIdxs);

            if (dirtyFields?.length === 0) {
                toast.warning("Target Not Entered");
                return;
            }
            const { data } = await axios.post(`/api/target`, {
                markets: dirtyFields,
            });
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            queryClient.invalidateQueries({ queryKey: ["target-overview"] });
            queryClient.invalidateQueries({ queryKey: ["markets"] });
        },
        onSettled: () => {
            setSelectedDistrict("");
            form.resetField("markets");
        },

        onError: handleAxiosError,
    });

    const getDirtyIndex = (arr: typeof form.formState.dirtyFields) => {
        const idxs: number[] = [];
        arr?.markets?.forEach((el, idx) => {
            if (!!el) {
                idxs.push(idx);
            }
        });
        return idxs;
    };

    const getDirtyFields = (idxs: number[]) => {
        return idxs.map((idx) => ({
            _id: form.getValues(`markets.${idx}`)._id,
            target: form.getValues(`markets.${idx}`).target,
        }));
    };

    useEffect(() => {
        if (selectedDistrict !== "") {
            const filterMarkets = markets?.map((market) => ({
                _id: market._id,
                name: market.name,
                target: market?.target,
            }));
            if (filterMarkets)
                form.setValue("markets", filterMarkets, { shouldDirty: false });
            else form.setValue("markets", [], { shouldDirty: false });
        }
    }, [markets]);

    return (
        <div className="max-w-7xl w-full border px-4 py-3 rounded-md shadow-md">
            {!isFormOpen ? (
                <div
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <PlusCircle className="w-6 h-6 text-orange-600" />
                    <span className="uppercase text-orange-700 font-semibold">
                        Modify Target
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center mb-5">
                            <PlusCircle className="w-6 h-6 text-orange-600" />
                            <span className="uppercase text-orange-700 font-semibold">
                                Modify Target
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
                                }}
                                disabled={isMarketLoading}
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

                            {selectedDistrict !== "" && isMarketLoading && (
                                <Loader2 className="animate-spin mx-auto" />
                            )}

                            <div className="flex flex-wrap gap-3">
                                {selectedDistrict !== "" &&
                                    !isMarketLoading &&
                                    form
                                        .watch("markets")
                                        ?.map((market, idx) => (
                                            <FormField
                                                key={idx}
                                                control={form.control}
                                                name={`markets.${idx}.target`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex gap-2 items-center uppercase">
                                                            <CalendarIcon className="text-indigo-600 w-5 h-5" />
                                                            {market.name}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                type="number"
                                                                min={0}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                            </div>

                            {!isMarketLoading &&
                                selectedDistrict !== "" &&
                                form.watch("markets").length > 0 && (
                                    <p className="block">
                                        Total :{" "}
                                        {form
                                            .watch("markets")
                                            ?.reduce(
                                                (sum, curr) =>
                                                    sum + curr?.target,
                                                0
                                            )}
                                    </p>
                                )}

                            {!isMarketLoading &&
                                selectedDistrict !== "" &&
                                form.watch("markets").length === 0 && (
                                    <div className="flex items-center justify-center space-x-3 border border-yellow-600 rounded-lg py-3">
                                        <CircleOff className="inline-block w-5 h-5" />
                                        <p>No Markets</p>
                                    </div>
                                )}

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
                                            Modify
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
