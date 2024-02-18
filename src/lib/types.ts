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

/* *
 * DISTRICT PERFORMANCE BY PRODUCTS
 */
export interface EachProductStatsInMarket {
    name: string;
    totalQtySold: number;
    avgPrice: number;
}
export interface ProductStatsInEachMarket {
    name: string;
    totalQtySold: number;
    products: EachProductStatsInMarket[];
}
export interface ProductStatsInEachDistrict {
    _id: string;
    district: string;
    totalQtySold: number;
    markets: ProductStatsInEachMarket[];
}

/**
 * DISTRICT PERFORMANCE BY CLIENT
 */

export interface EachClientTypeInMarket {
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

export interface EachMarketTypeInDistrict {
    market: string;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    clients: EachClientTypeInMarket[];
}

export interface DistrictStatsInPerformance {
    _id: string;
    district: string;
    totalMarket: number;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    markets: EachMarketTypeInDistrict[];
}

/**
 * PRODUCT PERFORMANCE
 */

export interface MarketStatsInProductPerformance {
    market: string;
    sales: number;
}
export interface DistrictSalesStats {
    district: string;
    sales: number;
    market: MarketStatsInProductPerformance[];
}
export interface ProductPerformance {
    product: string;
    totalSales: number;
    stats: DistrictSalesStats[];
}
