import { ClientI } from "@/models/client";
import { ProductI } from "@/models/product";

export type ClientTypeExtented = ClientI & {
    createdAt: string;
    updatedAt: string;
    _id: string;
};
export type ProductTypeExtended = ProductI & {
    createdAt: string;
    updatedAt: string;
    _id: string;
};
