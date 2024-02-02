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
import { Boxes, Pen, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "../loading";
import { format } from "date-fns";
import { useProduct } from "@/hooks/use-fetch-data";

export default function ProductList() {
    const { onOpen } = useModal();
    const { data, isLoading } = useProduct();

    return (
        <div className="border max-w-3xl w-full rounded-md py-3 shadow-md">
            <div className="flex items-center gap-3 mb-3 px-3">
                <Boxes className="text-indigo-500 w-6 h-6" />
                <h1 className="uppercase text-indigo-600 font-bold text-lg">
                    Products
                </h1>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] uppercase">
                                name
                            </TableHead>
                            <TableHead className="uppercase">Price</TableHead>
                            <TableHead className="uppercase min-w-[120px]">
                                Date
                            </TableHead>
                            <TableHead className="text-right uppercase min-w-[130px] md:min-w-[150px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <LoadingCells rows={10} cols={4} />}
                        {data?.map((product) => (
                            <TableRow key={product?._id}>
                                <TableCell className="font-medium capitalize">
                                    {product.name}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {product.price}
                                </TableCell>

                                <TableCell>
                                    {format(
                                        new Date(product.createdAt),
                                        "dd-MM-yyyy"
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* EDIT BTN */}
                                    <Button
                                        variant={"outline"}
                                        className="px-2 py-0"
                                        onClick={() => {
                                            onOpen("editProduct", { product });
                                        }}
                                    >
                                        <Pen className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                    {/* DELETE BTN */}
                                    <Button
                                        variant={"outline"}
                                        className="ml-2 px-2 py-0"
                                        onClick={() => {
                                            onOpen("deleteProduct", {
                                                product,
                                            });
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
