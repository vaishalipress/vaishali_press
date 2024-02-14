"use client";
import { useAssests } from "@/hooks/use-fetch-data";
import { HomeCarousel } from "./home-carousel";
import { MostPopularProducts } from "./most-popular";
import { Loader2 } from "lucide-react";

export const HomeComponent = () => {
    const { data, isLoading } = useAssests();
    return (
        <div>
            {isLoading ? (
                <div className="h-[80vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <>
                    <HomeCarousel data={data} />
                    <MostPopularProducts />
                </>
            )}
        </div>
    );
};
