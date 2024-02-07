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
import { useMutation } from "@tanstack/react-query";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { useSaleFilter } from "@/hooks/useSaleFilter";
import { useSearchParams } from "next/navigation";

export const DeleteSaleModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteSale";
    const { sale } = data;
    const { date, client, product, market, district, page, view } =
        useSaleFilter();
    const { removeSale } = useCustumQuery();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(`/api/sale?id=${sale?._id}`);
            return data;
        },
        onSuccess(data) {
            toast("😝 " + data?.message.toUpperCase());
            removeSale(
                [
                    "sales-list",
                    date?.from?.getDate(),
                    date?.to?.getDate(),
                    client,
                    product,
                    district,
                    market,
                    page,
                    view,
                ],
                data?.sale?._id
            );
        },
        onError: handleAxiosError,
        onSettled: onClose,
    });

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center uppercase font-bold">
                        Delete Sale
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="font-semibold text-indigo-500 uppercase">
                            {sale?.name}
                        </span>{" "}
                        -{" "}
                        <span className="font-semibold text-indigo-500 uppercase">
                            {sale?.client?.name}
                        </span>
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
                                "Confirm"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
