import { Navbar } from "@/components/navbar/navbar";

export default function PublicRoot({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white">
            <Navbar />
            {children}
        </div>
    );
}
