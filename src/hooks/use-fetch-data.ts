import {
    ClientTypeExtented,
    MarketType,
    ProductPerformance,
    ProductStats,
    ProductStatsInEachDistrict,
    ProductTypeExtended,
    SalesTypeExtended,
    clientStats,
    DistrictStatsInPerformance,
    ClientPerformance,
} from "@/lib/types";
import { getDayMax, getDayMin } from "@/lib/utils";
import { CarouselI } from "@/models/carousel";
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

export const useDistrictPerformanceByClient = (date: DateRange | undefined) => {
    return useQuery<DistrictStatsInPerformance[]>({
        queryKey: [
            "clientsAndSalesInfo",
            date?.from?.getDate(),
            date?.to?.getDate(),
        ],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/dashboard/districtStatByClient?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
            return data;
        },
    });
};

export const useClientPerformanceStats = (date: DateRange | undefined) => {
    return useQuery<ClientPerformance[]>({
        queryKey: [
            "client Performance stats",
            date?.from?.getDate(),
            date?.to?.getDate(),
        ],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/dashboard/clientStats?${
                    date?.from && `from=${getDayMin(date.from)?.toUTCString()}`
                }&${date?.to && `to=${getDayMax(date.to).toUTCString()}`}`
            );
            return data;
        },
    });
};

export const useAllProductPerformanceInDetails = (
    date: DateRange | undefined
) => {
    return useQuery<ProductPerformance[]>({
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
export const useDistrictPerformanceByProducts = (
    date: DateRange | undefined
) => {
    return useQuery<ProductStatsInEachDistrict[]>({
        queryKey: [
            "DistrictPerformanceByProducts",
            date?.from?.getDate(),
            date?.to?.getDate(),
        ],
        queryFn: async () => {
            const { data } = await axios.get(
                `/api/dashboard/districtStatByProduct?${
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
    return useQuery<CarouselI[]>({
        queryKey: ["assets"],
        queryFn: async () => {
            const { data } = await axios("/api/media");
            return data;
        },
        staleTime: 60 * 1000 * 30,
    });
};
export const useUsers = () => {
    return useQuery<{ email: string; _id: string }[]>({
        queryKey: ["user-list"],
        queryFn: async () => {
            const { data } = await axios("/api/user");
            return data;
        },
        staleTime: 60 * 1000 * 30,
    });
};
