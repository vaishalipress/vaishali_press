"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation } from "@tanstack/react-query";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { marketSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { DISTRICTS, districtsAndBlocks } from "@/lib/contants";
import { Button } from "../ui/button";
import {
    AlignStartVertical,
    AlignVerticalSpaceAround,
    Home,
    Loader2,
    Pen,
    ToyBrick,
    Trash,
    TriangleRight,
} from "lucide-react";
import { toast } from "sonner";
import { useMarket } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const MarketModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { market } = data;
    const isModalOpen = isOpen && type === "market";
    const form = useForm<z.infer<typeof marketSchema>>({
        resolver: zodResolver(marketSchema),
        defaultValues: {
            name: "",
            district: "",
        },
    });

    const { addData, removeData } = useCustumQuery();
    const [district, setDistrict] = useState("");
    const { data: markets } = useMarket(district);

    // CREATE MARKET
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof marketSchema>) => {
            const { data } = await axios.post(`/api/market`, values);
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            if (data.success) {
                addData(["markets", form.getValues("district")], data.market);
                form.setValue("name", "");
            }
        },

        onError: handleAxiosError,
    });
    // DELETE MARKET
    const { mutate: deleteMarket, isPending: isDeleteMarketPending } =
        useMutation({
            mutationFn: async (id: string) => {
                const { data } = await axios.delete(`/api/market?id=${id}`);
                return data;
            },

            onSuccess(data) {
                toast("✅ " + (data?.message as string).toUpperCase());
                if (data.success) {
                    removeData(
                        ["markets", form.getValues("district")],
                        data.market._id
                    );
                }
            },

            onError: handleAxiosError,
        });

    useEffect(() => {
        if (market) {
            form.setValue("district", market?.district || "");
            setDistrict(market?.district || "");
        }
    }, [form, market]);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center text-xl text-center font-semibold uppercase">
                        <AlignStartVertical className="text-indigo-600" />{" "}
                        <span>Markets</span>
                    </DialogTitle>
                    {/* <DialogDescription>Add or Delete market</DialogDescription> */}
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Form {...form}>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={form.handleSubmit((value) =>
                                mutate(value)
                            )}
                        >
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <AlignVerticalSpaceAround className="text-orange-900 w-4 h-4" />{" "}
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
                                                    field.onChange(e);
                                                    setDistrict(e);
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

                            <Button
                                type="submit"
                                variant={"secondary"}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <AlignStartVertical className="text-green-600 w-5 h-5" />
                                        <span className="text-green-600 font-semibold">
                                            ADD
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {markets?.[0] && (
                        <div>
                            <div className="flex gap-2 items-center">
                                <AlignStartVertical className="text-indigo-600 w-5 h-6" />
                                <h3 className="uppercase font-semibold">
                                    Market List
                                </h3>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {markets?.map((market) => (
                                        <TableRow key={market?._id}>
                                            <TableCell className="uppercase">
                                                {market?.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* DELETE BTN */}
                                                <Button
                                                    variant={"outline"}
                                                    className="ml-2 px-2 py-0"
                                                    onClick={() =>
                                                        deleteMarket(market._id)
                                                    }
                                                >
                                                    {isDeleteMarketPending ? (
                                                        <Loader2 className="animate-spin" />
                                                    ) : (
                                                        <Trash className="w-3 h-3 md:w-4 md:h-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
