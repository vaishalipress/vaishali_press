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
import { Product } from "@/components/dashboard/product-table";
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
        <div className="w-full min-h-96 border rounded-md px-3 py-2">
            <div className="flex w-full gap-3 justify-between py-3">
                <Badge
                    variant={"default"}
                    className="h-8 text-sm font-medium bg-indigo-400"
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
            <div className="flex w-full justify-between gap-4 flex-wrap">
                {/* Client */}
                <div className="flex-1 w-full max-w-5xl">
                    <h1 className="text-center uppercase font-semibold text-xl py-3 text-indigo-500">
                        Clients
                    </h1>
                    <Clients clients={clients} />
                </div>

                {/* Product */}
                <div className="flex-auto w-full max-w-lg">
                    <h1 className="text-center uppercase font-semibold text-xl py-3 text-zinc-500">
                        Products
                    </h1>
                    <Product />
                </div>
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
                toolTip="Payment"
                Icon={BadgeMinus}
                count={totalDues}
                className="text-rose-700"
            />
        </div>
    );
};
