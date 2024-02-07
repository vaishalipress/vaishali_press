import AddSales from "@/components/sales/add-sales";
import SalesList from "@/components/sales/sales-list";

export default function Sales() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddSales />
                <SalesList />
            </div>
        </div>
    );
}
