"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoomBox, IndianRupee } from "lucide-react";
import { LoadingCells } from "@/components/loading";
import { useProductStats } from "@/hooks/use-fetch-data";
import { Filter } from "@/components/filter";
import { useFilterDate } from "@/hooks/useFilterDate";
import { Donut } from "../charts/donutChart";
import { useModal } from "@/hooks/use-modal-store";
import { useCallback, useMemo } from "react";
import { ClientTypeExtented } from "@/lib/types";

export default function ProductStats() {
  const { date, setDate, toggleType, type } = useFilterDate();
  const { data, isLoading } = useProductStats(date);
  const { onOpen } = useModal();
  const bhlAndBbs = useMemo(
    () =>
      data?.filter(
        (p) => p.name.toLowerCase() === "bhl" || p.name.toLowerCase() === "bbs"
      ),
    [data]
  );

  const bhlAndBbsMerged = useMemo(() => {
    if (!bhlAndBbs || bhlAndBbs?.length !== 2) return;
    const data = bhlAndBbs;
    const product: {
      _id: string;
      name: string;
      amount: number;
      sale: number;
      price: number;
      sales: {
        totalAmount: number;
        totalQty: number;
        amountByProduct: { bhl: number; bbs: number };
        qtyByProduct: { bhl: number; bbs: number };
        client: ClientTypeExtented;
      }[];
    } = {
      _id: "",
      name: "BHL + BBS",
      price: 0,
      amount: data?.[0].amount! + data?.[1]?.amount!,
      sale: data?.[0].sale! + data?.[1]?.sale!,
      sales: [],
    };
    const mergedSalesMap = new Map();

    data?.forEach((product) => {
      const productName = product.name;

      product.sales.forEach((sale) => {
        const clientId = String(sale.client._id); // Ensure string key

        if (!mergedSalesMap.has(clientId)) {
          mergedSalesMap.set(clientId, {
            totalAmount: sale.amount,
            totalQty: sale.qty,
            amountByProduct: { [productName]: sale.amount },
            qtyByProduct: { [productName]: sale.qty },
            client: { ...sale.client }, // shallow copy
          });
        } else {
          const existing = mergedSalesMap.get(clientId);

          // Create a new object instead of mutating in place
          const updated = {
            ...existing,
            totalAmount: existing.totalAmount + sale.amount,
            totalQty: existing.totalQty + sale.qty,
            amountByProduct: {
              ...existing.amountByProduct,
              [productName]:
                (existing.amountByProduct[productName] || 0) + sale.amount,
            },
            qtyByProduct: {
              ...existing.qtyByProduct,
              [productName]:
                (existing.qtyByProduct[productName] || 0) + sale.qty,
            },
          };

          mergedSalesMap.set(clientId, updated);
        }
      });
    });

    product.sales = Array.from(mergedSalesMap.values()).sort(
      (a, b) => b.totalQty - a.totalQty
    );
    return product;
  }, [bhlAndBbs]);

  return (
    <div className=" w-full flex flex-col gap-3">
      {!isLoading && data?.[0]?.sale !== 0 && (
        <Donut
          data={
            bhlAndBbs?.length === 2
              ? [
                  {
                    name: "BHL & BBS",
                    value: bhlAndBbs?.[0].sale! + bhlAndBbs?.[1].sale!,
                  },
                  { name: data?.[0]?.name!, value: data?.[0]?.sale! },
                  { name: data?.[1]?.name!, value: data?.[1]?.sale! },
                ]
              : [
                  { name: data?.[0]?.name!, value: data?.[0]?.sale! },
                  { name: data?.[1]?.name!, value: data?.[1]?.sale! },
                  { name: data?.[2]?.name!, value: data?.[2]?.sale! },
                ]
          }
          title="Top Product"
        />
      )}
      <div className="border w-full rounded-md shadow-md">
        <div className="flex flex-col justify-between gap-3 py-3 px-3 bg-[#FFCCCC] dark:bg-slate-300 rounded-tl-md rounded-tr-md">
          <div className="flex items-center gap-3">
            <BoomBox className="text-[#174634] w-6 h-6" />
            <h1 className="uppercase text-[#174634] font-bold text-sm lg:text-lg">
              Product Performance
            </h1>
          </div>

          <Filter
            html="#products"
            downloadName="productStats"
            date={date}
            setDate={setDate}
            toggleType={toggleType}
            type={type}
            isLoading={isLoading}
          />
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <Table id="products">
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead className="uppercase min-w-[75px] lg:min-w-[120px]">
                  Product
                </TableHead>
                <TableHead className="uppercase">Price</TableHead>
                <TableHead className="uppercase">Sold</TableHead>
                <TableHead className="uppercase">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <LoadingCells cols={5} rows={5} />}
              {!isLoading && bhlAndBbs?.length === 2 && bhlAndBbsMerged && (
                <TableRow
                  key={bhlAndBbsMerged?.name}
                  className="cursor-pointer"
                  onClick={() =>
                    onOpen("productSalesWithClient", {
                      productSalesWithClients: bhlAndBbsMerged,
                    })
                  }
                >
                  <TableCell>1</TableCell>
                  <TableCell className="text-xs lg:text-sm uppercase">
                    {bhlAndBbsMerged?.name?.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm">
                    <div className="flex items-center text-xs lg:text-sm">
                      <IndianRupee className="w-3 h-3" />-
                    </div>
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm">
                    {bhlAndBbsMerged?.sale}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs lg:text-sm">
                      <IndianRupee className="w-3 h-3" />
                      {bhlAndBbsMerged?.amount}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {data?.map((product, idx) => (
                <TableRow
                  key={product?._id}
                  className="cursor-pointer"
                  onClick={() =>
                    onOpen("productSalesWithClient", {
                      productSalesWithClients: product,
                    })
                  }
                >
                  <TableCell>
                    {(bhlAndBbs?.length === 2 ? 2 : 1) + idx}
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm uppercase">
                    {product?.name?.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm">
                    <div className="flex items-center text-xs lg:text-sm">
                      <IndianRupee className="w-3 h-3" />
                      {product?.price}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm">
                    {product?.sale}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs lg:text-sm">
                      <IndianRupee className="w-3 h-3" />
                      {product?.amount}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
