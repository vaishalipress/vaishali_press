import { HomeCarousel } from "@/components/home/home-carousel";
import { MostPopularProducts } from "@/components/home/most-popular";

export default async function Home() {
    return (
        <div
            className={`max-w-[1300px] m-auto h-full flex flex-col gap-10 pb-14`}
        >
            <HomeCarousel />
            <MostPopularProducts />
        </div>
    );
}
