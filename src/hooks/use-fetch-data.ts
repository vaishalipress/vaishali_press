import {
    ClientTypeExtented,
    MarketType,
    ProductData,
    ProductTypeExtended,
    SalesTypeExtended,
    districtType,
} from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useClient = () => {
    return useQuery<ClientTypeExtented[]>({
        queryKey: ["clients-list"],
        queryFn: async () => {
            const { data } = await axios.get("/api/client");
            return data?.clients;
        },
    });
};

export const useProduct = () => {
    return useQuery<ProductTypeExtended[]>({
        queryKey: ["products-list"],
        queryFn: async () => {
            const { data } = await axios.get("/api/product");
            return data?.products;
        },
    });
};

export const useSale = () => {
    return useQuery<SalesTypeExtended[]>({
        queryKey: ["sales-list"],
        queryFn: async () => {
            const { data } = await axios.get("/api/sale");
            return data?.sales;
        },
    });
};

export const useClientDashboardInfo = () => {
    return useQuery<districtType[]>({
        queryKey: ["clientsAndSalesInfo"],
        queryFn: async () => {
            const { data } = await axios.get("/api/dashboard");
            return data;
        },
    });
};

export const useProductInfo = () => {
    return useQuery<ProductData[]>({
        queryKey: ["productAndSoldInfo"],
        queryFn: async () => {
            const { data } = await axios.get("/api/dashboard/productstats");
            return data;
        },
    });
};

export const useMarket = (district: string, block: string) => {
    return useQuery<MarketType[] | null>({
        queryKey: ["markets", district, block],
        queryFn: async () => {
            console.log("from market", district, block);

            const { data } = await axios.get(
                `/api/market?district=${district}&block=${block}`
            );
            console.log(data);
            return data?.markets;
        },
    });
};
