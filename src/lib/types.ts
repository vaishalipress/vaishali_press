import { ClientI } from "@/models/client";
import { ProductI } from "@/models/product";
import { SaleI } from "@/models/sale";

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
export type SalesTypeExtended = SaleI & {
    client: ClientTypeExtented;
    product: ProductTypeExtended;
    createdAt: string;
    updatedAt: string;
    _id: string;
};

interface saleType {
    _id: string;
    client: string;
    product: string;
    name: string;
    qty: number;
    rate: number;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
}

export interface clientType {
    _id: string;
    name: string;
    district: string;
    block: string;
    market: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    sales: saleType[];
    totalSale: number;
    totalAmount: number;
    date: string;
}

export interface blockType {
    block: string;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    clients: clientType[];
}

export interface districtType {
    _id: string;
    district: string;
    totalBlock: number;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    blocks: blockType[];
}

export interface ProductInfo {
    name: string;
    totalQtySold: number;
    avgPrice: number;
}
export interface ProductBlockWiseData {
    name: string;
    totalQtySold: number;
    products: ProductInfo[];
}
export interface ProductData {
    _id: string;
    district: string;
    totalQtySold: number;
    blocks: ProductBlockWiseData[];
}

export interface MarketType {
    _id: string;
    name: string;
    district: string;
    block: string;
}
