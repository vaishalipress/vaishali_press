import { HomeCarousel } from "@/components/home/home-carousel";
import { MostPopularProducts } from "@/components/home/most-popular";
import { MAX_WIDTH } from "@/lib/constants";

const carousel_Image = [
    { url: "/banner.webp", alt: "banner" },
    { url: "/banner.webp", alt: "banner" },
    { url: "/banner.webp", alt: "banner" },
];
export default function Home() {
    return (
        <div className={`max-w-[${MAX_WIDTH}] m-auto h-full flex flex-col gap-10 pb-14`}>
            <HomeCarousel Images={carousel_Image} />
            <MostPopularProducts />
        </div>
    );
}
