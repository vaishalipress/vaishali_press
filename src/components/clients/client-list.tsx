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
import { ClientTypeExtented } from "@/lib/types";
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";

export default function ClientList() {
    const { onOpen } = useModal();
    const { data: clientsData, isLoading } = useClient();
    const [sort, setSort] = useState<"atoz" | "latest">("atoz");
    const [data, setData] = useState<ClientTypeExtented[] | undefined>([]);
    const [search, setSearch] = useState("");
    let timerRef = useRef<NodeJS.Timeout | null>(null);

    const sortedClientByAtoZ = useMemo(() => {
        if (!clientsData) return;

        const sorted = [...clientsData]?.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        return sorted;
    }, [clientsData]);

    const sortedClientByDate = useMemo(() => {
        if (!clientsData) return;
        const sorted = [...clientsData]?.sort(function (a, b) {
            if (a.createdAt < b.createdAt) {
                return 1;
            }
            if (a.createdAt > b.createdAt) {
                return -1;
            }
            return 0;
        });

        return sorted;
    }, [clientsData]);

    useEffect(() => {
        setData(sortedClientByAtoZ);
    }, [clientsData, sortedClientByAtoZ]);

    const searchClientByName = useCallback(
        (name: string) => {
            if (!clientsData) return;
            const searchedClient = [...clientsData].filter((client) =>
                client.name.startsWith(name)
            );
            setData(searchedClient);
        },
        [clientsData]
    );

    const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSort("latest");
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            searchClientByName(e.target.value);
        }, 300);
    };

    return (
        <div className="border max-w-7xl w-full rounded-md py-3 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-3 px-3">
                <div className="flex items-center gap-3">
                    <Users className="text-indigo-500 w-6 h-6" />
                    <h1 className="uppercase text-indigo-600 font-bold text-lg">
                        Clients - <span>{data?.length}</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => searchHandler(e)}
                    />

                    <Select
                        value={sort}
                        onValueChange={(e: "atoz" | "latest") => {
                            setSort(e);

                            if (e === "latest") {
                                setData(sortedClientByDate);
                            } else if (e === "atoz") {
                                setData(sortedClientByAtoZ);
                            }
                        }}
                        defaultValue={sort}
                    >
                        <SelectTrigger className="max-w-24">
                            <SelectValue placeholder={"Filter"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Filter</SelectLabel>

                                <SelectItem value={"latest"}>Latest</SelectItem>
                                <SelectItem value={"atoz"}>A-Z</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] uppercase">
                                name
                            </TableHead>
                            <TableHead className="uppercase">Market</TableHead>
                            <TableHead className="uppercase">
                                District
                            </TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Month
                            </TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Date
                            </TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Mobile
                            </TableHead>
                            <TableHead className="text-right uppercase min-w-[130px] md:min-w-[150px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <LoadingCells cols={7} />}
                        {data?.map((client) => (
                            <TableRow key={client?._id}>
                                <TableCell className="font-medium capitalize">
                                    {client?.name}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {client?.market ? client?.market : "NA"}
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

                                <TableCell>{client?.mobile}</TableCell>
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
