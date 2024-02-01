import { create } from "zustand";
import {
    ClientTypeExtented,
    ProductTypeExtended,
    SalesTypeExtended,
    clientType,
} from "@/lib/types";

export type ModalType =
    | "editClient"
    | "deleteClient"
    | "editProduct"
    | "deleteProduct"
    | "editSale"
    | "deleteSale"
    | "userSaleDetails"
    | "market";

interface ModalData {
    client?: ClientTypeExtented;
    product?: ProductTypeExtended;
    sale?: SalesTypeExtended;
    clientSalesDetail?: clientType;
    market?: {
        district?: string;
        block?: string;
    };
}

interface modalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<modalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
