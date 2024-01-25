import {
    BadgeIndianRupee,
    BadgeInfo,
    BadgeMinus,
    BadgePlus,
    BaggageClaim,
    Cuboid,
    User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { ActionTooltip } from "../action-tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export const DistrictPage = () => {
    return (
        <div className="w-full border rounded-md px-3 py-3">
            <div className="flex gap-3 justify-between w-full  py-2">
                <Badge
                    variant={"secondary"}
                    className="h-8 text-base font-medium text-zinc-900 dark:text-zinc-200"
                >
                    Muzaffarpur
                </Badge>

                <div className="grid gap-4">
                    <div className="flex gap-2">
                        <ActionTooltip label="Block">
                            <Badge
                                variant={"secondary"}
                                className="h-8 flex items-center justify-between"
                            >
                                <Cuboid className="w-5 h-5 text-indigo-700" />{" "}
                                <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                    6
                                </span>
                            </Badge>
                        </ActionTooltip>
                        <ActionTooltip label="clients">
                            <Badge
                                variant={"secondary"}
                                className="h-8 flex items-center justify-between"
                            >
                                <User className="w-5 h-5 text-indigo-700" />{" "}
                                <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                    6
                                </span>
                            </Badge>
                        </ActionTooltip>
                        <ActionTooltip label="sales">
                            <Badge
                                variant={"secondary"}
                                className="h-8 flex items-center justify-between"
                            >
                                <BaggageClaim className="w-5 h-5 text-indigo-700" />{" "}
                                <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                    6
                                </span>
                            </Badge>
                        </ActionTooltip>
                        <ActionTooltip label="Amount">
                            <Badge
                                variant={"secondary"}
                                className="h-8 flex items-center justify-between"
                            >
                                <BadgeIndianRupee className="w-5 h-5 text-indigo-700" />{" "}
                                <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                    1000
                                </span>
                            </Badge>
                        </ActionTooltip>
                        <ActionTooltip label="Payment">
                            <Badge
                                variant={"secondary"}
                                className="h-8 flex items-center justify-between"
                            >
                                <BadgePlus className="w-5 h-5 text-indigo-700" />{" "}
                                <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                    500
                                </span>
                            </Badge>
                        </ActionTooltip>
                        <ActionTooltip label="Dues">
                            <Badge
                                variant={"secondary"}
                                className="h-8 flex items-center justify-between"
                            >
                                <BadgeMinus className="w-5 h-5 text-indigo-700" />{" "}
                                <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                    500
                                </span>
                            </Badge>
                        </ActionTooltip>
                    </div>
                </div>
            </div>
            <div className="w-full border rounded-md px-3 py-2">
                <div className="flex gap-3 justify-between py-3">
                    <Badge
                        variant={"secondary"}
                        className="h-8 text-sm font-medium text-zinc-900 dark:text-zinc-200"
                    >
                        Marwan
                    </Badge>

                    <div className="grid gap-4">
                        <div className="flex gap-2">
                            <ActionTooltip label="clients">
                                <Badge
                                    variant={"secondary"}
                                    className="h-8 flex items-center justify-between"
                                >
                                    <User className="w-5 h-5 text-indigo-700" />{" "}
                                    <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                        6
                                    </span>
                                </Badge>
                            </ActionTooltip>
                            <ActionTooltip label="sales">
                                <Badge
                                    variant={"secondary"}
                                    className="h-8 flex items-center justify-between"
                                >
                                    <BaggageClaim className="w-5 h-5 text-indigo-700" />{" "}
                                    <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                        6
                                    </span>
                                </Badge>
                            </ActionTooltip>
                            <ActionTooltip label="Amount">
                                <Badge
                                    variant={"secondary"}
                                    className="h-8 flex items-center justify-between"
                                >
                                    <BadgeIndianRupee className="w-5 h-5 text-indigo-700" />{" "}
                                    <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                        1000
                                    </span>
                                </Badge>
                            </ActionTooltip>
                            <ActionTooltip label="Payment">
                                <Badge
                                    variant={"secondary"}
                                    className="h-8 flex items-center justify-between"
                                >
                                    <BadgePlus className="w-5 h-5 text-indigo-700" />{" "}
                                    <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                        500
                                    </span>
                                </Badge>
                            </ActionTooltip>
                            <ActionTooltip label="Dues">
                                <Badge
                                    variant={"secondary"}
                                    className="h-8 flex items-center justify-between"
                                >
                                    <BadgeMinus className="w-5 h-5 text-indigo-700" />{" "}
                                    <span className="ml-3 text-base text-zinc-800 dark:text-zinc-300">
                                        500
                                    </span>
                                </Badge>
                            </ActionTooltip>
                        </div>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] uppercase">
                                name
                            </TableHead>
                            <TableHead className="uppercase">Sales</TableHead>
                            <TableHead className="uppercase">Amount</TableHead>
                            <TableHead className="uppercase">Payment</TableHead>
                            <TableHead className="uppercase">Dues</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium capitalize">
                                Aditya
                            </TableCell>
                            <TableCell className="capitalize">2</TableCell>
                            <TableCell className="capitalize">5000</TableCell>
                            <TableCell>2000</TableCell>
                            <TableCell>3000</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium capitalize">
                                Aditya
                            </TableCell>
                            <TableCell className="capitalize">2</TableCell>
                            <TableCell className="capitalize">5000</TableCell>
                            <TableCell>2000</TableCell>
                            <TableCell>3000</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium capitalize">
                                Aditya
                            </TableCell>
                            <TableCell className="capitalize">2</TableCell>
                            <TableCell className="capitalize">5000</TableCell>
                            <TableCell>2000</TableCell>
                            <TableCell>3000</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium capitalize">
                                Aditya
                            </TableCell>
                            <TableCell className="capitalize">2</TableCell>
                            <TableCell className="capitalize">5000</TableCell>
                            <TableCell>2000</TableCell>
                            <TableCell>3000</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
