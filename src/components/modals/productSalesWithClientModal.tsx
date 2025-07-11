"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, IndianRupee } from "lucide-react";
import { Button } from "../ui/button";
import { capitalizeWords, downloadToPDF } from "@/lib/utils";

export const ProductSalesWithClients = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "productSalesWithClient";
  const { productSalesWithClients } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[700px] px-1 md:px-4 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center uppercase font-bold">
            Product Stats
          </DialogTitle>

          <div>
            <h1 className="uppercase font-semibold text-start"> Product</h1>
            <Table className="w-fit md:w-full">
              <TableBody>
                <TableRow>
                  <TableCell>NAME</TableCell>
                  <TableCell className="uppercase">
                    {productSalesWithClients?.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SOLD</TableCell>
                  <TableCell>{productSalesWithClients?.sale}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs lg:text-sm">
                      <IndianRupee className="w-3 h-3" />
                      {productSalesWithClients?.amount}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="max-h-96 h-96 max-w-[95vw] w-fit md:w-full">
            <div className="flex items-center gap-10 my-3">
              <h1 className="uppercase font-semibold text-start">Clients</h1>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() =>
                  downloadToPDF(
                    false,
                    "#pptable",
                    `${productSalesWithClients?.name}.pdf`
                  )
                }
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
            <div className="max-h-96 h-96 overflow-auto">
              <Table id="pptable">
                <TableHeader>
                  <TableRow>
                    <TableHead>S.NO</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>MARKET</TableHead>
                    <TableHead>DISTRICT</TableHead>
                    {productSalesWithClients?.sales?.[0]?.qty && (
                      <TableHead>QTY</TableHead>
                    )}
                    {productSalesWithClients?.sales?.[0]?.qtyByProduct &&
                      productSalesWithClients?.sales?.[0]?.amountByProduct && (
                        <>
                          <TableHead>BHL</TableHead>
                          <TableHead>BBS</TableHead>
                          <TableHead>TOTAL</TableHead>
                        </>
                      )}
                    {productSalesWithClients?.sales?.[0]?.amount && (
                      <TableHead>AMOUNT</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productSalesWithClients?.sales?.map((sale, idx) => (
                    <TableRow key={sale?.client?._id}>
                      <TableCell className="capitalize text-start">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="capitalize text-start">
                        {capitalizeWords(sale?.client?.name)}
                      </TableCell>
                      <TableCell className="capitalize text-start">
                        {capitalizeWords(sale?.client?.market)}
                      </TableCell>
                      <TableCell className="capitalize text-start">
                        {capitalizeWords(sale?.client?.district)}
                      </TableCell>
                      {sale?.qty && (
                        <TableCell className="text-start">
                          {sale?.qty}
                        </TableCell>
                      )}

                      {sale?.qtyByProduct && (
                        <>
                          <TableCell className="text-start">
                            {sale?.qtyByProduct?.bhl}
                          </TableCell>
                          <TableCell className="text-start">
                            {sale?.qtyByProduct?.bbs}
                          </TableCell>
                          <TableCell className="text-start">
                            {sale?.totalQty}
                          </TableCell>
                        </>
                      )}
                      {sale?.amount && (
                        <TableCell className="capitalize text-start">
                          <div className="flex items-center text-xs lg:text-sm">
                            <IndianRupee className="w-3 h-3" />
                            {sale?.amount}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
