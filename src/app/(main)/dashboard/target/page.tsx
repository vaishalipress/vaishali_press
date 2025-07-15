import AddTarget from "@/components/target/add-target";
import TargetOverview from "@/components/target/target-overview";

export default function TargetPage() {
    return (
        <div className="py-2 w-full">
            <div className="flex w-full flex-col gap-4 items-center">
                <AddTarget />
                <TargetOverview />
            </div>
        </div>
    );
}
