"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { CarouselI } from "@/models/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export const HomeCarousel = ({ data }: { data: CarouselI[] }) => {
    return (
        <Carousel
            className="w-full h-[88vh] lg:h-[91vh] relative rounded-lg overflow-hidden"
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
                        <div className="relative w-full h-[88vh] lg:h-[91vh]">
                            <Image
                                src={image?.imageUrl}
                                fill
                                alt={"carousel"}
                                priority
                                className="object-cover lg:object-cover w-full h-full"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};
