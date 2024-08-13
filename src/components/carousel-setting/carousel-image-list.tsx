"use client";

import { useAssests } from "@/hooks/use-fetch-data";
import { Loader2 } from "lucide-react";
import { ImageCard } from "./ImageCard";

export const CarouselImageList = () => {
    const { data, isLoading } = useAssests();
    return (
        <div>
            <h1 className="text-2xl uppercase font-semibold mt-5 mb-5">
                Carousel Images
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}

                {data?.map((asset) => (
                    <ImageCard
                        key={asset.publicId}
                        link={asset.imageUrl}
                        publicId={asset.publicId}
                    />
                ))}
            </div>
        </div>
    );
};
