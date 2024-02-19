"use client";
import { useUsers } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { LoadingCells } from "../loading";
import { Button } from "../ui/button";
import { Lock, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useModal } from "@/hooks/use-modal-store";

export default function UserList() {
    const { data, isLoading } = useUsers();
    const { data: LoggedInUser } = useSession();
    const { onOpen } = useModal();
    return (
        <div className="border max-w-xl w-full rounded-md py-3 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-3 px-3">
                <div className="flex items-center gap-3">
                    <Lock className="text-indigo-500 w-6 h-6" />
                    <h1 className="uppercase text-indigo-600 font-bold text-lg">
                        Access
                    </h1>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && <LoadingCells cols={2} />}
                    {data?.map((user) => (
                        <TableRow key={user?._id}>
                            <TableCell>
                                {user?.email}
                                {LoggedInUser?.user?.email === user?.email && (
                                    <span className="ml-2">(You)</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant={"destructive"}
                                    size={"icon"}
                                    disabled={
                                        LoggedInUser?.user?.email ===
                                        user?.email
                                    }
                                    onClick={() =>
                                        onOpen("deleteUser", { user })
                                    }
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
