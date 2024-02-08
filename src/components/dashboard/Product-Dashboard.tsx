"use client";
import { useProductInfo } from "@/hooks/use-fetch-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductMarketWiseData, ProductData } from "@/lib/types";
import { LoadingCells } from "@/components/loading";

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
            </div>
            <div className="flex gap-3 flex-wrap">
                {dist.markets.map((market) => (
                    <Market market={market} key={market.name} />
                ))}
            </div>
        </div>
    );
};

const Market = ({ market }: { market: ProductMarketWiseData }) => {
    return (
        <div className="px-2 py-3 border rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="font-medium capitalize text-sm px-3">
                    {market?.name}
                </span>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
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
                    {market.products.map((product) => (
                        <TableRow key={product?.name}>
                            <TableCell className="uppercase text-xs">
                                {product?.name}
                            </TableCell>
                            <TableCell className="text-xs">
                                {product?.avgPrice}
                            </TableCell>
                            <TableCell className="text-xs">
                                {product?.totalQtySold}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
