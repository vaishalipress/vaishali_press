import AddProduct from "@/components/product/add-product";
import ProductList from "@/components/product/product-list";

export default function Product() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddProduct />
                <ProductList />
            </div>
        </div>
    );
}
