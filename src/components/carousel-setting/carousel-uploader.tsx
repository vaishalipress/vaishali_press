"use client";
import { IMAGE_SIZE } from "@/lib/utils";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { ActionTooltip } from "../action-tooltip";
import { useCustumQuery } from "@/hooks/use-queries";
export const CarouselMediaUploader = () => {
    const [isUploading, setIsUploading] = useState(false);
    const { addData } = useCustumQuery();
    const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > IMAGE_SIZE) {
                toast("😶 Image Should be lesser than 40kb");
                return;
            }
            try {
                setIsUploading(true);

                const formData = new FormData();
                formData.append("file", file);
                const { data } = await axios.post(`/api/media`, formData);
                console.log(data);
                addData(["assets"], data);
            } catch (error: any) {
                toast(error.message);
            } finally {
                setIsUploading(false);
            }
        }
    };
    return (
        <div className="px-1 py-6">
            <ActionTooltip label="Upload Image">
                <Label
                    htmlFor="imageUploader"
                    className="cursor-pointer flex items-center justify-center w-fit max-w-fit border py-3 px-11 rounded-xl "
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <PlusCircle className="w-8 h-8" />
                    )}
                </Label>
            </ActionTooltip>
            <Input
                id="imageUploader"
                type="file"
                accept="image/*"
                multiple={false}
                className="hidden w-0 max-w-0"
                disabled={isUploading}
                value={""}
                onChange={(e) => handleImage(e)}
            />
        </div>
    );
};
