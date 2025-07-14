import AddTarget from "@/components/target/add-target";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TargetPage() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddTarget />
            </div>
        </div>
    );
}
