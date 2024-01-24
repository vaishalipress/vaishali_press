import { ClientTypeExtented, ProductTypeExtended } from "@/lib/types";
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
