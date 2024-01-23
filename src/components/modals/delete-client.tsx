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

export const DeleteClientModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteClient";
    const { client } = data;
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(
                `/api/users?clientId=${client?._id}`
            );
            return data;
        },
        // onSuccess(data) {
        //     if (data) {
        //         toast({ description: data?.message });
        //         onClose();
        //     }
        //     if (!!data?.success) {
        //         queryClient.setQueryData(
        //             ["users", searchParams?.page, searchParams?.userId],
        //             (old: { total: number; users: User[] }) => {
        //                 const users = old.users.filter(
        //                     (Singaluser) => Singaluser.id !== user?.id
        //                 );

        //                 return {
        //                     total: old.total,
        //                     users,
        //                 };
        //             }
        //         );
        //     }
        // },
    });

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Client
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="font-semibold text-indigo-500">
                            {client?.name}
                        </span>{" "}
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
