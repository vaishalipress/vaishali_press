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
    MonthlySalesDataOfClient,
    MonthlySalesDataOfDistrict,
    MonthlySalesDataOfMarket,
} from "@/lib/types";
import { createDateQueryKey } from "@/lib/utils";
import { CarouselI } from "@/models/carousel";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { DateRange } from "react-day-picker";

// Utility function to build URL parameters safely
const buildURLParams = (
    params: Record<string, string | number | undefined>
): string => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            urlParams.append(key, value.toString());
        }
    });

    return urlParams.toString();
};

// UTC date helpers for consistent date handling
const formatDateToUTCString = (date: Date): string => {
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD in UTC
};

const getUTCDateStart = (date: Date): string => {
    const utcDate = new Date(
        date.toISOString().split("T")[0] + "T00:00:00.000Z"
    );
    return utcDate.toISOString();
};

const getUTCDateEnd = (date: Date): string => {
    const utcDate = new Date(
        date.toISOString().split("T")[0] + "T23:59:59.999Z"
    );
    return utcDate.toISOString();
};

interface UseSaleParams {
    date: DateRange | undefined;
    client: string | undefined;
    product: string | undefined;
    district: string | undefined;
    market: string | undefined;
    page: number;
    view: number;
}

interface SaleResponse {
    total: number;
    sales: SalesTypeExtended[];
}

// Client hooks
export const useClient = (): UseQueryResult<ClientTypeExtented[], Error> => {
    return useQuery({
        queryKey: ["clients-list"],
        queryFn: async () => {
            const { data } = await axios.get<{ clients: ClientTypeExtented[] }>(
                "/api/client"
            );

            return (
                data?.clients?.sort((a, b) => a.name.localeCompare(b.name)) ||
                []
            );
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export const useClientStats = (
    date: DateRange | undefined
): UseQueryResult<clientStats[], Error> => {
    return useQuery({
        queryKey: [
            "client-stats",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
        ],
        queryFn: async () => {
            const params = buildURLParams({
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
            });

            const { data } = await axios.get(`/api/client/stats?${params}`);
            return data;
        },
    });
};

export const useClientPerformanceStats = (
    date: DateRange | undefined,
    productIds: string[] = []
): UseQueryResult<ClientPerformance[], Error> => {
    return useQuery({
        queryKey: [
            "client-performance-stats",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
            productIds.sort(), // Sort for consistent cache key
        ],
        queryFn: async () => {
            const params = buildURLParams({
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
                productIds:
                    productIds.length > 0 ? productIds.join(",") : undefined,
            });

            const { data } = await axios.get(
                `/api/dashboard/clientStats?${params}`
            );
            return data;
        },
    });
};

export const useClientPerformance = (
    clientId: string,
    date: DateRange | undefined,
    productIds: string[] = []
): UseQueryResult<MonthlySalesDataOfClient[], Error> => {
    return useQuery({
        queryKey: [
            "client-performance",
            clientId,
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
            productIds.sort(),
        ],
        queryFn: async () => {
            if (!clientId) return [];

            const params = buildURLParams({
                clientId,
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
                productIds:
                    productIds.length > 0 ? productIds.join(",") : undefined,
            });

            const { data } = await axios.get<MonthlySalesDataOfClient[]>(
                `/api/charts/client?${params}`
            );
            return data;
        },
        enabled: Boolean(clientId),
    });
};

export const useDistrictPerformance = (
    district: string,
    date: DateRange | undefined,
    productIds: string[] = []
): UseQueryResult<MonthlySalesDataOfDistrict[], Error> => {
    return useQuery({
        queryKey: [
            "district-performance",
            district,
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
            productIds.sort(),
        ],
        queryFn: async () => {
            if (!district) return [];

            const params = buildURLParams({
                district,
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
                productIds:
                    productIds.length > 0 ? productIds.join(",") : undefined,
            });

            const { data } = await axios.get<MonthlySalesDataOfDistrict[]>(
                `/api/charts/district?${params}`
            );
            return data;
        },
        enabled: Boolean(district),
    });
};

export const useMarketPerformance = (
    district: string,
    market: string,
    date: DateRange | undefined,
    productIds: string[] = []
): UseQueryResult<MonthlySalesDataOfMarket[], Error> => {
    return useQuery({
        queryKey: [
            "market-performance",
            district,
            market,
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
            productIds.sort(),
        ],
        queryFn: async () => {
            if (!district || !market) return [];

            const params = buildURLParams({
                district,
                market,
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
                productIds:
                    productIds.length > 0 ? productIds.join(",") : undefined,
            });

            const { data } = await axios.get<MonthlySalesDataOfMarket[]>(
                `/api/charts/market?${params}`
            );
            return data;
        },
        enabled: Boolean(district && market),
    });
};
// Product hooks
export const useProduct = (): UseQueryResult<ProductTypeExtended[], Error> => {
    return useQuery({
        queryKey: ["products-list"],
        queryFn: async () => {
            const { data } = await axios.get("/api/product");
            return data?.products || [];
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export const useProductStats = (
    date: DateRange | undefined
): UseQueryResult<ProductStats[], Error> => {
    return useQuery({
        queryKey: [
            "product-stats",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
        ],
        queryFn: async () => {
            const params = buildURLParams({
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
            });

            const { data } = await axios.get(`/api/product/stats?${params}`);
            return data;
        },
    });
};

export const useAllProductPerformanceInDetails = (
    date: DateRange | undefined
): UseQueryResult<ProductPerformance[], Error> => {
    return useQuery<ProductPerformance[]>({
        queryKey: [
            "product-performance-details",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
        ],
        queryFn: async () => {
            const params = buildURLParams({
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
            });

            const { data } = await axios.get(
                `/api/dashboard/productstats?${params}`
            );
            return data;
        },
    });
};

// Sales hooks
export const useSale = ({
    date,
    client,
    product,
    district,
    market,
    page,
    view,
}: UseSaleParams): UseQueryResult<SaleResponse, Error> => {
    return useQuery({
        queryKey: [
            "sales-list",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
            client,
            product,
            district,
            market,
            page,
            view,
        ],
        queryFn: async () => {
            const params = buildURLParams({
                page,
                view,
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
                client,
                product,
                district,
                market,
            });

            const { data } = await axios.get<SaleResponse>(
                `/api/sale?${params}`
            );
            return data;
        },
    });
};

// District and Market hooks
export const useDistrictPerformanceByClient = (
    date: DateRange | undefined
): UseQueryResult<DistrictStatsInPerformance[], Error> => {
    return useQuery({
        queryKey: [
            "district-performance-by-client",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
        ],
        queryFn: async () => {
            const params = buildURLParams({
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
            });

            const { data } = await axios.get(
                `/api/dashboard/districtStatByClient?${params}`
            );
            return data;
        },
    });
};

export const useDistrictPerformanceByProducts = (
    date: DateRange | undefined,
    productIds: string[] = []
): UseQueryResult<ProductStatsInEachDistrict[], Error> => {
    return useQuery({
        queryKey: [
            "district-performance-by-products",
            createDateQueryKey(date?.from),
            createDateQueryKey(date?.to),
            productIds.sort(),
        ],
        queryFn: async () => {
            const params = buildURLParams({
                from: date?.from ? getUTCDateStart(date.from) : undefined,
                to: date?.to ? getUTCDateEnd(date.to) : undefined,
                productIds:
                    productIds.length > 0 ? productIds.join(",") : undefined,
            });

            const { data } = await axios.get(
                `/api/dashboard/districtStatByProduct?${params}`
            );
            return data;
        },
    });
};

export const useMarket = (
    district: string
): UseQueryResult<MarketType[], Error> => {
    return useQuery({
        queryKey: ["markets", district],
        queryFn: async () => {
            if (!district) return [];

            const { data } = await axios.get(
                `/api/market?district=${district}`
            );
            return data?.markets || [];
        },
        enabled: Boolean(district),
        staleTime: 10 * 60 * 1000, // Cache for 10 minutes (markets don't change often)
    });
};

// Assets and Users hooks
export const useAssets = (): UseQueryResult<CarouselI[], Error> => {
    return useQuery({
        queryKey: ["assets"],
        queryFn: async () => {
            const { data } = await axios.get("/api/media");
            return data || [];
        },
        staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    });
};

export const useUsers = (): UseQueryResult<
    { email: string; _id: string }[],
    Error
> => {
    return useQuery({
        queryKey: ["users-list"],
        queryFn: async () => {
            const { data } = await axios.get("/api/user");
            return data || [];
        },
        staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    });
};
