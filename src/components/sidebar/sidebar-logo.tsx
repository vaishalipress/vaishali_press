import Image from "next/image";

export const SideBarLogo = () => {
    return (
        <div className=" group flex items-center bg-primary/10 rounded-[16px] justify-center h-[48px] w-[48px]">
            <Image
                src={"/logo2.png"}
                height={0}
                width={38}
                alt="logo"
                className="pointer-events-none select-none object-fill"
            />
        </div>
    );
};
