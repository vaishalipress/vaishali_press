"use client";
import { HomeCarousel } from "./home-carousel";
import { CarouselI } from "@/models/carousel";

export const HomeComponent = ({ data }: { data: CarouselI[] }) => {
    return (
        <div className="px-3">
            <HomeCarousel data={data} />
        </div>
    );
};
