import { Info } from "@/components/infoWithTooltip";
import {
    BadgeIndianRupee,
    BadgeMinus,
    BadgePlus,
    BaggageClaim,
    User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Clients } from "@/components/dashboard/client-table";
import { blockType } from "@/lib/types";

export const BlockSection = ({
    block,
    totalAmount,
    totalClient,
    totalDues,
    totalPayment,
    totalSale,
    clients,
}: blockType) => {
    return (
        <div className="w-full border rounded-md px-3 py-2">
            <div className="flex w-full gap-3 justify-between py-3">
                <Badge
                    variant={"outline"}
                    className="h-8 text-sm font-medium uppercase"
                >
                    {block}
                </Badge>
                <BlockHeaderInfo
                    totalAmount={totalAmount}
                    totalClient={totalClient}
                    totalDues={totalDues}
                    totalPayment={totalPayment}
                    totalSale={totalSale}
                />
            </div>
            {/* Client */}
            <div className="flex-1 w-full">
                <Clients clients={clients} />
            </div>
        </div>
    );
};

const BlockHeaderInfo = ({
    totalAmount,
    totalClient,
    totalDues,
    totalPayment,
    totalSale,
}: {
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    totalDues: number;
    totalPayment: number;
}) => {
    return (
        <div className="grid grid-cols-2 gap-1 lg:flex lg:gap-2 flex-wrap">
            {/* Client */}
            <Info
                toolTip="Clients"
                Icon={User}
                count={totalClient}
                className="text-orange-600"
            />

            {/* Sales */}
            <Info
                toolTip="sales"
                Icon={BaggageClaim}
                count={totalSale}
                className="text-amber-600 "
            />

            {/* Amount */}
            <Info
                toolTip="Amount"
                Icon={BadgeIndianRupee}
                count={totalAmount}
                className="text-green-600  "
            />

            {/* Payment */}
            <Info
                toolTip="Payment"
                Icon={BadgePlus}
                count={totalPayment}
                className="text-lime-600"
            />

            {/* Dues */}
            <Info
                toolTip="Dues"
                Icon={BadgeMinus}
                count={totalDues}
                className="text-rose-700"
            />
        </div>
    );
};
