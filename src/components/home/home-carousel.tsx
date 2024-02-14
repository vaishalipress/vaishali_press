"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export const HomeCarousel = ({
    data,
}: {
    data: { public_id: string; secure_url: string }[] | undefined;
}) => {
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
