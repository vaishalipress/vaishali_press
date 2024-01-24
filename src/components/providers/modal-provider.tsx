import { DeleteClientModal } from "../modals/delete-client";
import { DeletProductModal } from "../modals/delete-product";
import { EditClientModal } from "../modals/edit-client";
import { EditProductModal } from "../modals/edit-product";

const ModalProvider = () => {
    return (
        <>
            <EditClientModal />
            <DeleteClientModal />
            <EditProductModal />
            <DeletProductModal />
        </>
    );
};

export default ModalProvider;
