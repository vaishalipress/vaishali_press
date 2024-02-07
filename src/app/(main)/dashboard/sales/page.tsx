import AddSales from "@/components/sales/add-sales";
import SalesList from "@/components/sales/sales-list";

export default function Sales({
    searchParams,
}: {
    searchParams: { view: string; page: string };
}) {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddSales
                    page={Number(searchParams.page) || 1}
                    view={searchParams.view || "200"}
                />
                <SalesList
                    page={Number(searchParams.page) || 1}
                    view={searchParams.view || "200"}
                />
            </div>
        </div>
    );
}
