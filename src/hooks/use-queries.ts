import { QueryKey, useQueryClient } from "@tanstack/react-query";

type queryType = { _id: string; [key: string]: string };

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

    return { updateData, removeData, addData };
};
