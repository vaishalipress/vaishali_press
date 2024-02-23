import { DeleteClientModal } from "@/components/modals/delete-client";
import { DeletProductModal } from "@/components/modals/delete-product";
import { DeleteSaleModal } from "@/components/modals/delete-sale";
import { EditClientModal } from "@/components/modals/edit-client";
import { EditProductModal } from "@/components/modals/edit-product";
import { EditSaleModal } from "@/components/modals/edit-sale";
import { MarketModal } from "@/components/modals/marketModal";
import { DeleteUserModal } from "@/components/modals/delete-user";
import { ProductSalesWithClients } from "@/components/modals/productSalesWithClientModal";

const ModalProvider = () => {
    return (
        <>
            <EditClientModal />
            <DeleteClientModal />
            <EditProductModal />
            <DeletProductModal />
            <EditSaleModal />
            <DeleteSaleModal />
            <MarketModal />
            <DeleteUserModal />
            <ProductSalesWithClients />
        </>
    );
};

export default ModalProvider;
