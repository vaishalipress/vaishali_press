import { CarouselMediaUploader } from "@/components/carousel-setting/carousel-uploader";
import { CarouselImageList } from "@/components/carousel-setting/carousel-image-list";

export default function CarouselSettings() {
    return (
        <div className="max-w-[1500px] m-auto">
            <CarouselMediaUploader />
            <CarouselImageList />
        </div>
    );
}
