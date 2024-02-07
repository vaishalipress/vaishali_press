import ClientStats from "@/components/clients/clientStats";
import ProductStats from "@/components/product/productStats";

export default function ProductsStatsPage() {
    return (
        <div>
            <ProductStats />
            <ClientStats />
        </div>
    );
}
