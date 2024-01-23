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
import { Pen, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

const clients = [
    {
        name: "Aditya Kumar",
        district: "muzaffarpur",
        block: "marwan",
        mobile: "7479796212",
    },
    {
        name: "rohit Kumar",
        district: "muzaffarpur",
        block: "marwan",
        mobile: "7479796212",
    },
    {
        name: "abhishek Kumar",
        district: "muzaffarpur",
        block: "marwan",
        mobile: "7479796212",
    },
];
export default function ClientList() {
    const { onOpen } = useModal();
    return (
        <div className="border max-w-3xl rounded-md py-3">
            <h1 className="uppercase font-semibold mb-3 px-3 text-sm md:text-base">
                Clients
            </h1>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] uppercase">
                                name
                            </TableHead>
                            <TableHead className="uppercase">
                                District
                            </TableHead>
                            <TableHead className="uppercase">Block</TableHead>
                            <TableHead className="uppercase">Mobile</TableHead>
                            <TableHead className="text-right uppercase min-w-[130px] md:min-w-[150px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.name}>
                                <TableCell className="font-medium capitalize">
                                    {client.name}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {client.district}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {client.block}
                                </TableCell>
                                <TableCell>{client.mobile}</TableCell>
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
