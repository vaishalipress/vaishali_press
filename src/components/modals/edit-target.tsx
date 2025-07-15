"use client";

import { useModal } from "@/hooks/use-modal-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Box,
    CalendarIcon,
    Loader2,
    PackagePlus,
    Pencil,
    TargetIcon,
    Trash,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { targetSchema } from "@/lib/schema";
import { handleAxiosError } from "@/lib/error";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const targetUpdateSchema = z.object({
    targetValue: z.number().min(0),
});

const EditTargetModal = () => {
    const { isOpen, type, onClose, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "editTarget";
    const { target } = data;

    const form = useForm<z.infer<typeof targetUpdateSchema>>({
        resolver: zodResolver(targetUpdateSchema),
        defaultValues: {
            targetValue: 0,
        },
    });

    const queryClient = useQueryClient(); // ✅

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof targetUpdateSchema>) => {
            const { data } = await axios.put(
                `/api/target?id=${target?._id}`,
                values
            );
            return data;
        },
        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            queryClient.invalidateQueries({ queryKey: ["target-overview"] });
            onClose();
        },
        onError: handleAxiosError,
    });

    // Prefill form
    useEffect(() => {
        if (target) {
            form.setValue("targetValue", target.targetValue, {
                shouldDirty: false,
            });
        }
    }, [form, target]);

    const deleteHandler = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this target?"
        );
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(`/api/target?id=${target?._id}`);
            toast("🗑️ " + res.data.message);
            queryClient.invalidateQueries({ queryKey: ["target-overview"] });
            onClose(); // close modal if needed
        } catch (error) {
            handleAxiosError(error as AxiosError);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-indigo-600">
                        <Pencil className="w-4 h-4" /> Edit Target
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((val) => mutate(val))}
                        className="space-y-4"
                    >
                        {/* Target Value */}
                        <FormField
                            control={form.control}
                            name="targetValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1">
                                        <TargetIcon className="w-4 h-4 text-lime-600" />{" "}
                                        Target
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
                        <div className="space-x-2">
                            <Button
                                type="submit"
                                disabled={isPending || !form.formState.isDirty}
                                variant={"secondary"}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                    <span className="flex gap-2 items-center text-green-700 font-semibold">
                                        <PackagePlus className="w-4 h-4" />
                                        Update Target
                                    </span>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant={"destructive"}
                                onClick={deleteHandler}
                            >
                                <Trash className="w-4 h-4 mr-1" />
                                Delete
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTargetModal;
