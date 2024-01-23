import AddClient from "@/components/clients/add-client";
import ClientList from "@/components/clients/client-list";

export default function Clients() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 m-auto">
                <AddClient />
                <ClientList />
            </div>
        </div>
    );
}
