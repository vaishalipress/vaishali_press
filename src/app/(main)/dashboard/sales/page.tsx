"use client";
import AddSales from "@/components/sales/add-sales";
import SalesList from "@/components/sales/sales-list";
import { useState } from "react";

export default function Sales() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddSales
                    isFormOpen={isFormOpen}
                    setIsFormOpen={(v) => setIsFormOpen(v)}
                />
                <SalesList isFormOpen={isFormOpen} />
            </div>
        </div>
    );
}
