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
import { MarketSection } from "./BlockSection";
import { districtType } from "@/lib/types";

export const DistrictPage = ({
    district,
    totalAmount,
    totalClient,
    totalSale,
    markets,
    totalMarket,
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
                    totalMarket={totalMarket}
                    totalClient={totalClient}
                    totalSale={totalSale}
                />
            </div>
            <>
                {markets?.map((market) => (
                    <MarketSection
                        key={market.market}
                        market={market.market}
                        totalAmount={market.totalAmount}
                        totalClient={market.totalClient}
                        totalSale={market.totalSale}
                        clients={market.clients}
                    />
                ))}
            </>
        </div>
    );
};

const DistrictHeaderInfo = ({
    totalAmount = 0,
    totalMarket = 0,
    totalClient = 0,
    totalSale = 0,
}: {
    totalMarket: number;
    totalClient: number;
    totalSale: number;
    totalAmount: number;
}) => {
    return (
        <div className="grid grid-cols-2 gap-1 lg:flex lg:gap-2 flex-wrap">
            {/* Block */}
            <Info
                toolTip="market"
                Icon={Cuboid}
                count={totalMarket}
                className="text-indigo-600"
            />

            {/* Client */}
            <Info
                toolTip="Clients"
                Icon={User}
                count={totalClient}
                className="text-orange-800"
            />

            {/* Sales */}
            <Info
                toolTip="sales"
                Icon={BaggageClaim}
                count={totalSale}
                className="text-amber-800 "
            />

            {/* Amount */}
            <Info
                toolTip="Amount"
                Icon={BadgeIndianRupee}
                count={totalAmount}
                className="text-green-800  "
            />
        </div>
    );
};
