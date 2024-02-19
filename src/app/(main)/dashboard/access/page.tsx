import AddUser from "@/components/access/create-user";
import UserList from "@/components/access/user-list";

export default function Access() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddUser />
                <UserList />
            </div>
        </div>
    );
}
