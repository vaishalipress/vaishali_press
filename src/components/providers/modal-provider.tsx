import { DeleteClientModal } from "../modals/delete-client";
import { EditClientModal } from "../modals/edit-client";

const ModalProvider = () => {
    return (
        <>
            <EditClientModal />
            <DeleteClientModal />
        </>
    );
};

export default ModalProvider;
