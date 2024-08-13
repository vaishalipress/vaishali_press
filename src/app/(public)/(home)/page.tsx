import { HomeComponent } from "@/components/home/home";
import { Carousel, CarouselI } from "@/models/carousel";

export default async function Home() {
    const carouselData = (await Carousel.find()
        .lean()
        .select("-_id -__v")) as CarouselI[];
    return (
        <div className={`w-full h-full m-auto`}>
            <HomeComponent data={carouselData} />
        </div>
    );
}
