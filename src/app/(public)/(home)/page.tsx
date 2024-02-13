import { HomeCarousel } from "@/components/home/home-carousel";
import { MostPopularProducts } from "@/components/home/most-popular";
import axios from "axios";

export default async function Home() {
    try {
        const { data } = await axios<
            { public_id: string; secure_url: string }[]
        >(`${process.env.NEXTAUTH_URL}/api/media`);
        return (
            <div
                className={`max-w-[1300px] m-auto h-full flex flex-col gap-10 pb-14`}
            >
                {data?.[0] && <HomeCarousel Images={data} />}
                <MostPopularProducts />
            </div>
        );
    } catch (err) {
        return <div>Error</div>;
    }
}
