import {
    BadgeIndianRupee,
    BadgeMinus,
    BadgePlus,
    BaggageClaim,
    Cuboid,
    User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Info } from "../infoWithTooltip";
import { BlockSection } from "./BlockSection";
import { districtType } from "@/lib/types";

export const DistrictPage = ({
    district,
    totalAmount,
    totalBlock,
    totalClient,
    totalDues,
    totalPayment,
    totalSale,
    blocks,
}: districtType) => {
    return (
        <div className="w-full max-w-5xl border rounded-md px-3 py-3 flex flex-col gap-3">
            {/* District sction */}
            <div className="flex gap-3 justify-between w-full py-2">
                <Badge
                    variant={"destructive"}
                    className="h-8 text-sm lg:text-base font-medium  dark:text-zinc-200 uppercase"
                >
                    {district}
                </Badge>
                <DistrictHeaderInfo
                    totalAmount={totalAmount}
                    totalBlock={totalBlock}
                    totalClient={totalClient}
                    totalDues={totalDues}
                    totalPayment={totalPayment}
                    totalSale={totalSale}
                />
            </div>
            <>
                {blocks?.map((block) => (
                    <BlockSection
                        key={block.block}
                        block={block.block}
                        totalAmount={block.totalAmount}
                        totalClient={block.totalClient}
                        totalDues={block.totalDues}
                        totalPayment={block.totalPayment}
                        totalSale={block.totalSale}
                        clients={block.clients}
                    />
                ))}
            </>
        </div>
    );
};

const DistrictHeaderInfo = ({
    totalAmount,
    totalBlock,
    totalClient,
    totalDues,
    totalPayment,
    totalSale,
}: {
    totalBlock: number;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
    totalDues: number;
    totalPayment: number;
}) => {
    return (
        <div className="grid grid-cols-2 gap-1 lg:flex lg:gap-2 flex-wrap">
            {/* Block */}
            {totalBlock && (
                <Info
                    toolTip="Block"
                    Icon={Cuboid}
                    count={totalBlock}
                    className="text-indigo-600 "
                />
            )}

            {/* Client */}
            {totalClient && (
                <Info
                    toolTip="Clients"
                    Icon={User}
                    count={totalClient}
                    className="text-orange-800"
                />
            )}

            {/* Sales */}
            {totalSale && (
                <Info
                    toolTip="sales"
                    Icon={BaggageClaim}
                    count={totalSale}
                    className="text-amber-800 "
                />
            )}

            {/* Amount */}
            {totalAmount && (
                <Info
                    toolTip="Amount"
                    Icon={BadgeIndianRupee}
                    count={totalAmount}
                    className="text-green-800  "
                />
            )}

            {/* Payment */}
            {totalPayment && (
                <Info
                    toolTip="Payment"
                    Icon={BadgePlus}
                    count={totalPayment}
                    className="text-lime-800"
                />
            )}

            {/* Dues */}
            {totalDues && (
                <Info
                    toolTip="Dues"
                    Icon={BadgeMinus}
                    count={totalDues}
                    className="text-rose-800"
                />
            )}
        </div>
    );
};
