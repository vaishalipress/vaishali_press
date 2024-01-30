"use client";
import { useProductInfo } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Info } from "../infoWithTooltip";
import { Box } from "lucide-react";
import { ProductBlockWiseData, ProductData } from "@/lib/types";
import { LoadingCells } from "../loading";

export const ProductDashboard = () => {
    const { data, isLoading } = useProductInfo();
    return (
        <div className="flex flex-wrap gap-3">
            {isLoading && (
                <Table>
                    <TableBody>
                        <LoadingCells rows={4} />
                    </TableBody>
                </Table>
            )}
            {data?.map((dist) => (
                <District dist={dist} key={dist.district} />
            ))}
        </div>
    );
};

const District = ({ dist }: { dist: ProductData }) => {
    return (
        <div className="border py-4 px-3 rounded-md w-fit h-fit flex flex-col gap-3 justify-between">
            <div className="flex justify-between items-center">
                <Badge
                    variant={"destructive"}
                    className="w-fit text-base font-medium uppercase"
                >
                    {dist.district}
                </Badge>
                <Info
                    Icon={Box}
                    count={dist.totalQtySold}
                    toolTip="Sold"
                    className="text-indigo-600"
                />
            </div>
            <div className="flex gap-3 flex-wrap">
                {dist.blocks.map((block) => (
                    <Block block={block} key={block.name} />
                ))}
            </div>
        </div>
    );
};

const Block = ({ block }: { block: ProductBlockWiseData }) => {
    return (
        <div className="px-2 py-3 border rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <Badge variant={"outline"} className="w-fit text-sm uppercase">
                    {block.name}
                </Badge>
                <Info
                    Icon={Box}
                    count={block.totalQtySold}
                    toolTip="Sold"
                    className="text-zinc-600"
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="uppercase w-32">
                            Product
                        </TableHead>
                        <TableHead className="uppercase w-32">
                            Avg Price
                        </TableHead>
                        <TableHead className="uppercase w-32">Sold</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {block.products.map((product) => (
                        <TableRow key={product.name}>
                            <TableCell className="uppercase">
                                {product.name}
                            </TableCell>
                            <TableCell>{product.avgPrice}</TableCell>
                            <TableCell>{product.totalQtySold}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
