import {
    ClientTypeExtented,
    MarketType,
    ProductData,
    ProductTypeExtended,
    SalesTypeExtended,
    districtType,
} from "@/lib/types";
import { getDayMax, getDayMin } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DateRange } from "react-day-picker";

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

export const useSale = (date: DateRange | undefined) => {
    return useQuery<SalesTypeExtended[]>({
        queryKey: ["sales-list", date?.from?.getDate(), date?.to?.getDate()],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/sale?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
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

export const useMarket = (district: string) => {
    return useQuery<MarketType[] | null>({
        queryKey: ["markets", district],
        queryFn: async () => {
            if (!district) return [];
            const { data } = await axios.get(
                `/api/market?district=${district}`
            );
            return data?.markets;
        },
    });
};
