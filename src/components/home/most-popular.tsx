import { IndianRupee } from "lucide-react";
import Image from "next/image";

const Products = [
    {
        type: "Standard",
        price: "230.00",
        src: "/product.webp",
    },
    {
        type: "Golden",
        price: "230.00",
        src: "/product1.webp",
    },
    {
        type: "Standard",
        price: "230.00",
        src: "/product2.webp",
    },
    {
        type: "Magnetic Card",
        price: "230.00",
        src: "/product3.png",
    },
    {
        type: "Spot UV",
        price: "230.00",
        src: "/product4.png",
    },
    {
        type: "Velvet Touch",
        price: "230.00",
        src: "/product5.png",
    },
    {
        type: "Matte",
        price: "230.00",
        src: "/product6.png",
    },
    {
        type: "Square",
        price: "230.00",
        src: "/product7.png",
    },
    {
        type: "Rounded Corner",
        price: "230.00",
        src: "/product8.png",
    },
    {
        type: "Classic",
        price: "230.00",
        src: "/product9.png",
    },
];

interface ProductType {

}
export const MostPopularProducts = () => {
    return (
        <div className="flex flex-col gap-5">
            <h1 className="ml-3 sm:ml-0 text-2xl font-semibold uppercase">
                Most Popular
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-9 place-items-center">
                {Products?.map((product, idx) => (
                    <ProductCard key={idx} {...product} />
                ))}
            </div>
        </div>
    );
};

const ProductCard = ({
    price,
    type,
    src,
}: {
    type: string;
    price: string;
    src: string;
}) => {
    return (
        <div className="w-fit cursor-pointer group">
            <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[230px] lg:h-[230px] overflow-hidden">
                <Image src={src} fill alt="product" className="group-hover:scale-[1.2] transition-all" />
            </div>
            <div className="flex flex-col gap-1 mt-3">
                <span className="text-base lg:text-lg font-semibold">{type}</span>
                <p className="flex items-center text-sm lg:text-lg">
                    <span>100 Starting at</span>
                    <IndianRupee className="w-4 h-4 ml-2" />
                    <span>{price}</span>
                </p>
            </div>
        </div>
    );
};
