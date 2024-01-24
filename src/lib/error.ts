import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleAxiosError = (error: AxiosError) => {
    const errorMessage = (
        error.response?.data as {
            message: string;
        }
    )?.message;
    if (errorMessage) {
        toast(errorMessage.toUpperCase());
    }
};
