import {
    ClientTypeExtented,
    MarketType,
    ProductData,
    ProductStats,
    ProductTypeExtended,
    SalesTypeExtended,
    clientStats,
    districtType,
} from "@/lib/types";
import { getDayMax, getDayMin } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
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

export const useSale = (
    date: DateRange | undefined,
    client: string | undefined,
    product: string | undefined,
    district: string | undefined,
    market: string | undefined,
    page: number,
    view: number
) => {
    return useQuery<{ total: number; sales: SalesTypeExtended[] }>({
        queryKey: [
            "sales-list",
            date?.from?.getDate(),
            date?.to?.getDate(),
            client,
            product,
            district,
            market,
            page,
            view,
        ],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/sale?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${
                    date?.to && `to=${getDayMax(date.to).toUTCString()}`
                }&client=${client}&product=${product}&page=${page}&view=${view}`
            );
            return data;
        },
    });
};

export const useClientDashboardInfo = (date: DateRange | undefined) => {
    return useQuery<districtType[]>({
        queryKey: [
            "clientsAndSalesInfo",
            date?.from?.getDate(),
            date?.to?.getDate(),
        ],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/dashboard?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
            return data;
        },
    });
};

export const useProductInfo = (date: DateRange | undefined) => {
    return useQuery<ProductData[]>({
        queryKey: [
            "productAndSoldInfo",
            date?.from?.getDate(),
            date?.to?.getDate(),
        ],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/dashboard/productstats?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
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

export const useProductStats = (date: DateRange | undefined) => {
    return useQuery<ProductStats[]>({
        queryKey: ["productStats", date?.from?.getDate(), date?.to?.getDate()],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/product/stats?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
            return data;
        },
    });
};
export const useClientStats = (date: DateRange | undefined) => {
    return useQuery<clientStats[]>({
        queryKey: ["clientStats", date?.from?.getDate(), date?.to?.getDate()],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/client/stats?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
            return data;
        },
    });
};

export const useAssests = () => {
    return useQuery<{ public_id: string; secure_url: string }[]>({
        queryKey: ["assets"],
        queryFn: async () => {
            const { data } = await axios("/api/media");
            return data;
        },
    });
};
