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
    market: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    sales: number;
    totalAmount: number;
    date: string;
}

export interface MarketTypeInDashboard {
    market: string;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    clients: clientType[];
}

export interface districtType {
    _id: string;
    district: string;
    totalMarket: number;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    markets: MarketTypeInDashboard[];
}

export interface MarketStats {
    market: string;
    sales: number;
}
export interface DistrictStats {
    district: string;
    sales: number;
    market: MarketStats[];
}
export interface ProductData {
    product: string;
    totalSales: number;
    stats: DistrictStats[];
}

export interface MarketType {
    _id: string;
    name: string;
    district: string;
}

export interface ProductStats {
    _id: string;
    name: string;
    price: number;
    sales: number;
    amount: number;
}
export interface clientStats {
    _id: string;
    name: string;
    district: string;
    market: string;
    sales: number;
    amount: number;
}
