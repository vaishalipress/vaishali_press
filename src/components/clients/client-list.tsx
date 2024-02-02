"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Pen, Trash, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "../loading";
import { format } from "date-fns";
import { useClient } from "@/hooks/use-fetch-data";

export default function ClientList() {
    const { onOpen } = useModal();
    const { data, isLoading } = useClient();

    return (
        <div className="border max-w-6xl w-full rounded-md py-3 shadow-md">
            <div className="flex items-center gap-3 mb-3 px-3">
                <Users className="text-indigo-500 w-6 h-6" />
                <h1 className="uppercase text-indigo-600 font-bold text-lg">
                    Clients
                </h1>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] uppercase">
                                name
                            </TableHead>
                            <TableHead className="uppercase">Market</TableHead>
                            <TableHead className="uppercase">Block</TableHead>
                            <TableHead className="uppercase">
                                District
                            </TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Month
                            </TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Date
                            </TableHead>
                            <TableHead className="text-right uppercase min-w-[130px] md:min-w-[150px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <LoadingCells cols={6} />}
                        {data?.map((client) => (
                            <TableRow key={client?._id}>
                                <TableCell className="font-medium capitalize">
                                    {client?.name}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {client?.market ? client?.market : "NA"}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {client?.block}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {client?.district}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(client?.createdAt),
                                        "MMMM"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(client?.createdAt),
                                        "dd-MM-yyyy"
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* EDIT BTN */}
                                    <Button
                                        variant={"outline"}
                                        className="px-2 py-0"
                                        onClick={() => {
                                            onOpen("editClient", { client });
                                        }}
                                    >
                                        <Pen className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                    {/* DELETE BTN */}
                                    <Button
                                        variant={"outline"}
                                        className="ml-2 px-2 py-0"
                                        onClick={() => {
                                            onOpen("deleteClient", { client });
                                        }}
                                    >
                                        <Trash className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
