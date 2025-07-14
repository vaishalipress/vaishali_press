import { HomeComponent } from "@/components/home/home";
import CONNECT_TO_DB from "@/lib/connectToDb";
import { Carousel, CarouselI } from "@/models/carousel";

CONNECT_TO_DB();
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
