import { HomeComponent } from "@/components/home/home";

export default async function Home() {
    return (
        <div
            className={`max-w-[1300px] m-auto h-full pb-14`}
        >
            <HomeComponent />
        </div>
    );
}
