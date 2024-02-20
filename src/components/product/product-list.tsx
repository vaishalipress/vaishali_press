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
import { Boxes, Download, IndianRupee, Pen, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "../loading";
import { format } from "date-fns";
import { useProduct } from "@/hooks/use-fetch-data";
import { downloadToPDF } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { ProductTypeExtended } from "@/lib/types";

export default function ProductList() {
    const { onOpen } = useModal();
    const { data: productData, isLoading } = useProduct();
    const [data, setData] = useState<ProductTypeExtended[] | undefined>([]);
    const [sort, setSort] = useState<"atoz" | "latest">("atoz");

    const sortByAtoZ = useMemo(() => {
        if (!productData) return;

        const sorted = [...productData]?.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        return sorted;
    }, [productData]);

    const sortByDate = useMemo(() => {
        if (!productData) return;
        const sorted = [...productData]?.sort(function (a, b) {
            if (a.createdAt < b.createdAt) {
                return 1;
            }
            if (a.createdAt > b.createdAt) {
                return -1;
            }
            return 0;
        });

        return sorted;
    }, [productData]);

    useEffect(() => {
        setData(sortByAtoZ);
    }, [productData, sortByAtoZ]);
    return (
        <div className="border max-w-3xl w-full rounded-md py-3 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-3 px-3">
                <div className="flex items-center gap-3">
                    <Boxes className="text-indigo-500 w-6 h-6" />
                    <h1 className="uppercase text-indigo-600 font-bold text-lg">
                        Products
                    </h1>

                    <span className="uppercase text-indigo-600 font-bold text-lg">
                        {data?.length}
                    </span>
                </div>

                <div className="flex gap-3">
                    <Select
                        value={sort}
                        onValueChange={(e: "atoz" | "latest") => {
                            setSort(e);

                            if (e === "latest") {
                                setData(sortByDate);
                            } else if (e === "atoz") {
                                setData(sortByAtoZ);
                            }
                        }}
                        defaultValue={sort}
                    >
                        <SelectTrigger className="w-24">
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

                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() =>
                            downloadToPDF(
                                isLoading,
                                "#products",
                                `products.pdf`
                            )
                        }
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
            </div>
            <div>
                <Table id="products">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">S.NO</TableHead>
                            <TableHead className="max-w-[250px] uppercase">
                                name
                            </TableHead>
                            <TableHead className="uppercase">Price</TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Date
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <LoadingCells rows={10} cols={4} />}
                        {data?.map((product, idx) => (
                            <TableRow
                                key={product?._id}
                                className="cursor-pointer"
                                onClick={() => {
                                    onOpen("editProduct", { product });
                                }}
                            >
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell className="font-medium capitalize">
                                    {product.name.toLocaleUpperCase()}
                                </TableCell>
                                <TableCell>
                                    <div className="capitalize flex items-center">
                                        <IndianRupee className="w-3 h-3" />
                                        {product.price}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    {format(
                                        new Date(product?.createdAt),
                                        "dd-MM-yyyy"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
