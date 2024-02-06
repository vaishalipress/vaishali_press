import { QueryKey, useQueryClient } from "@tanstack/react-query";

type queryType = { _id: string; [key: string]: string };
interface saleType {
    total: number;
    sales: queryType[];
}
export const useCustumQuery = () => {
    const queryClient = useQueryClient();

    const updateData = (key: QueryKey, data: queryType) => {
        queryClient.setQueryData(key, (old: queryType[]) => {
            const allData = old?.map((client) =>
                client?._id === data?._id
                    ? {
                          ...data,
                      }
                    : client
            );
            return allData;
        });
    };

    const removeData = (key: QueryKey, id: string) => {
        queryClient.setQueryData(key, (old: queryType[]) => {
            const allData = old?.filter((data) => data?._id !== id);
            return allData;
        });
    };

    const addData = (key: QueryKey, data: queryType) => {
        queryClient.setQueryData(key, (old: queryType[]) => {
            const clients = [data, ...old];
            return clients;
        });
    };

    const updateSale = (key: QueryKey, data: queryType) => {
        queryClient.setQueryData(key, (old: saleType) => {
            const allData = old?.sales?.map((client) =>
                client?._id === data?._id
                    ? {
                          ...data,
                      }
                    : client
            );
            return { total: old.total, sales: allData };
        });
    };

    const removeSale = (key: QueryKey, id: string) => {
        queryClient.setQueryData(key, (old: saleType) => {
            const allData = old?.sales?.filter((data) => data?._id !== id);
            return { total: old.total, sales: allData };
        });
    };

    const addSale = (key: QueryKey, data: queryType) => {
        queryClient.setQueryData(key, (old: saleType) => {
            const allData = [data, ...old.sales];
            return { total: old.total, sales: allData };
        });
    };

    return { updateData, removeData, addData, updateSale, addSale, removeSale };
};
