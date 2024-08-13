"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useCustumQuery } from "@/hooks/use-queries";
import { Loader2 } from "lucide-react";

export const ImageCard = ({
    link,
    publicId,
}: {
    link: string;
    publicId: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { removeImage } = useCustumQuery();
    const deleteHandler = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.delete(
                `/api/media?publicId=${publicId}`
            );

            if (data?.success) {
                removeImage(publicId);
                toast(data?.message);
            }
        } catch (error: any) {
            toast(error?.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col gap-2 w-full max-w-[500px]">
            <div className="relative w-full max-w-[500px] h-[200px]">
                <Image src={link} fill alt="banner" />
            </div>
            <Button
                variant={"destructive"}
                className="w-full"
                onClick={deleteHandler}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    "DELETE"
                )}
            </Button>
        </div>
    );
};
