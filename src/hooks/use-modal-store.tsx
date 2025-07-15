import { create } from "zustand";
import {
    ClientTypeExtented,
    ProductTypeExtended,
    SalesTypeExtended,
    EachClientTypeInMarket,
    ProductStats,
    targetType,
} from "@/lib/types";
import { TargetI } from "@/models/target";

export type ModalType =
    | "editClient"
    | "deleteClient"
    | "editProduct"
    | "deleteProduct"
    | "editSale"
    | "deleteSale"
    | "userSaleDetails"
    | "market"
    | "deleteUser"
    | "productSalesWithClient"
    | "deleteSales"
    | "editTarget";

interface ModalData {
    client?: ClientTypeExtented;
    product?: ProductTypeExtended;
    sale?: SalesTypeExtended;
    clientSalesDetail?: EachClientTypeInMarket;
    market?: {
        district?: string;
    };
    user?: {
        email?: string;
        _id?: string;
    };
    productSalesWithClients?: ProductStats;
    sales?: Map<string, string>;
    target?: targetType;
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
