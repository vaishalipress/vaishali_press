"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { useSaleFilter } from "@/hooks/useSaleFilter";

export const DeleteSalesModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteSales";
    const { sales } = data;

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post(`/api/sales/deleteMany`, {
                sales: Array.from(sales?.keys()!),
            });
            return data;
        },
        onSuccess(data) {
            toast("😝 " + data?.message.toUpperCase());
            queryClient.invalidateQueries({ queryKey: ["sales-list"] });
        },
        onError: handleAxiosError,
        onSettled: onClose,
    });

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center uppercase font-bold">
                        Delete Sales
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete ?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="bg-gray-100 dark:bg-zinc-950 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isPending}
                            variant={"ghost"}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={"destructive"}
                            disabled={isPending}
                            onClick={() => mutate()}
                        >
                            {isPending ? (
                                <Loader className="animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
