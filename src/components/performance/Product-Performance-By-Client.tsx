"use client";
import { useProductStats } from "@/hooks/use-fetch-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClientTypeExtented,
  MarketStatsInProductPerformance,
  ProductStats as ProductStatsType,
} from "@/lib/types";
import { LoadingCells } from "@/components/loading";
import { Download, FileWarning, IndianRupee } from "lucide-react";
import { useFilterDate } from "@/hooks/useFilterDate";
import { Filter } from "@/components/filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMemo } from "react";

export const ProductPerformanceByClient = () => {
  const { date, setDate, toggleType, type } = useFilterDate();
  const { data, isLoading } = useProductStats(date);
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

  const exportDataToPDF = async () => {
    if (isLoading) return;
    const doc = new jsPDF();
    const exportData: string[][] = [];
    data?.forEach((d, idx) => {
      exportData.push([
        `${idx + 1}`,
        d?.name?.toUpperCase(),
        d?.price?.toString(),
        d?.sale?.toString(),
        d?.sales?.length?.toString(),
        d?.amount?.toString(),
      ]);
    });

    autoTable(doc, {
      head: [["S.NO", "PRODUCT", "PRICE", "SOLD", "CLIENT", "AMOUNT"]],
      body: exportData,
    });

    doc.save("ALL_PRODUCT_PERFORMANCE_BY_CLIENT.pdf");
  };
  return (
    <div className="mb-4 w-full">
      <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
        <h1 className="text-sm lg:text-base uppercase  font-semibold">
          Product Performance By Client
        </h1>

        <Filter
          date={date}
          setDate={setDate}
          type={type}
          toggleType={toggleType}
          isLoading={isLoading}
        >
          <Button variant={"secondary"} onClick={exportDataToPDF}>
            <Download className="w-5 h-5" />
          </Button>
        </Filter>
      </div>
      <div className="flex flex-wrap gap-3">
        {isLoading && (
          <Table>
            <TableBody>
              <LoadingCells rows={4} />
            </TableBody>
          </Table>
        )}
        {!data?.[0] && !isLoading && (
          <div className="flex items-center justify-center w-full">
            <FileWarning className="text-rose-600" />
            <p className="uppercase font-medium text-rose-600 text-lg">
              No Data
            </p>
          </div>
        )}

        <Accordion type="multiple" className="w-full">
          {bhlAndBbs?.length === 2 && bhlAndBbsMerged && (
            <ProductStats
              product={bhlAndBbsMerged}
              idx={1}
              key={bhlAndBbsMerged?.name}
            />
          )}
          {data?.map((product, idx) => (
            <ProductStats product={product} idx={idx + 1} key={product?.name} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const ProductStats = ({
  product,
  idx,
}: {
  idx: number;
  product: ProductStatsType;
}) => {
  return (
    <AccordionItem
      value={product?.name}
      className="w-full h-fit border rounded-md flex flex-col gap-3 mb-3"
    >
      <AccordionTrigger className="flex gap-3 w-full px-3 py-2 bg-orange-200 dark:bg-orange-800">
        <div className="flex items-center gap-2 w-[93%] justify-between">
          <span className="text-sm font-medium  dark:text-zinc-200 uppercase">
            {idx}. {product?.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs dark:text-zinc-200 uppercase">
              SOLD : {product?.sale}
            </span>
            <span className="text-xs dark:text-zinc-200 uppercase">
              CLIENT : {product?.sales?.length}
            </span>
            <span className="text-xs dark:text-zinc-200 uppercase">
              AMOUNT : {product?.amount}
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.NO</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>MARKET</TableHead>
              <TableHead>DISTRICT</TableHead>
              {product?.sales?.[0]?.qtyByProduct && (
                <>
                  <TableHead>BHL</TableHead>
                  <TableHead>BBS</TableHead>
                </>
              )}
              <TableHead>QTY</TableHead>
              <TableHead>AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product?.sales?.map((client, idx) => (
              <TableRow key={client?.client?._id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="capitalize text-start">
                  {client?.client?.name}
                </TableCell>
                <TableCell className="capitalize text-start">
                  {client?.client?.market}
                </TableCell>
                <TableCell className="capitalize text-start">
                  {client?.client?.district}
                </TableCell>

                {client?.qtyByProduct && (
                  <>
                    <TableCell className="text-start">
                      {client?.qtyByProduct?.bhl}
                    </TableCell>
                    <TableCell className="text-start">
                      {client?.qtyByProduct?.bbs}
                    </TableCell>
                  </>
                )}

                <TableCell className="text-start">
                  {client?.qty || client.totalQty}
                </TableCell>
                <TableCell className="capitalize text-start">
                  <div className="flex items-center text-xs lg:text-sm">
                    <IndianRupee className="w-3 h-3" />
                    {client?.amount || client?.totalAmount}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );
};

const Market = ({ market }: { market: MarketStatsInProductPerformance[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs">
          <TableHead>S.NO</TableHead>
          <TableHead className="uppercase w-32">Market</TableHead>
          <TableHead className="uppercase w-32">Sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {market?.map((m, idx) => (
          <TableRow key={m.market}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="uppercase text-xs">{m?.market}</TableCell>

            <TableCell className="text-xs">{m?.sales}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
