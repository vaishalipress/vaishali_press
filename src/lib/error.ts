import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleAxiosError = (error: AxiosError) => {
    console.log(error);
    const errorMessage = (
        (error.response?.data as {
            message: string;
        }) || error.response?.data
    )?.message;
    if (errorMessage) {
        toast(errorMessage.toUpperCase());
    }
};
