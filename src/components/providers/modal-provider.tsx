import { ClientSalesDetailsModal } from "../modals/clientSaleDetail";
import { DeleteClientModal } from "../modals/delete-client";
import { DeletProductModal } from "../modals/delete-product";
import { DeleteSaleModal } from "../modals/delete-sale";
import { EditClientModal } from "../modals/edit-client";
import { EditProductModal } from "../modals/edit-product";
import { EditSaleModal } from "../modals/edit-sale";

const ModalProvider = () => {
    return (
        <>
            <EditClientModal />
            <DeleteClientModal />
            <EditProductModal />
            <DeletProductModal />
            <EditSaleModal />
            <DeleteSaleModal />
            <ClientSalesDetailsModal />
        </>
    );
};

export default ModalProvider;
