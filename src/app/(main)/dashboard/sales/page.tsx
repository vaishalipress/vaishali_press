import AddSales from "@/components/sales/add-sales";
import SalesList from "@/components/sales/sales-list";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Sales() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                    <AddSales />
                    <SalesList />
                </Suspense>
            </div>
        </div>
    );
}
