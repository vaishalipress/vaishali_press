"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useAssests } from "@/hooks/use-fetch-data";
import Autoplay from "embla-carousel-autoplay";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export const HomeCarousel = () => {
    const { data, isLoading } = useAssests();
    return (
        <Carousel
            className="w-full h-[170px] sm:h-[450px] relative"
            plugins={[
                Autoplay({
                    delay: 3000,
                    stopOnInteraction: false,
                }),
            ]}
        >
            <CarouselContent>
                {isLoading && (
                    <CarouselItem>
                        <div className="relative w-full h-[170px] sm:h-[450px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    </CarouselItem>
                )}
                {data?.map((image, idx) => (
                    <CarouselItem key={idx}>
                        <div className="relative w-full h-[170px] sm:h-[450px]">
                            <Image
                                src={image?.secure_url}
                                fill
                                alt={"carousel"}
                                className="object-fill w-full h-full"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};
