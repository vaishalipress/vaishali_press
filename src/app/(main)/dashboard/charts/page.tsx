"use client";
import { Filter } from "@/components/filter";
import Chart from "@/components/performance/Chart";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useClient,
    useClientPerformance,
    useDistrictPerformance,
    useMarket,
    useMarketPerformance,
} from "@/hooks/use-fetch-data";
import { useFilterDate } from "@/hooks/useFilterDate";
import { DISTRICTS, MONTHS } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const PRODUCT_IDS = ["65b91e25c8aeefd5b6171ca1", "65b91da3f46eaa0c8bd42667"];
const TOP_N_LIMIT = 20;

// Common Loading Component
const LoadingState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300">{message}</p>
    </div>
);

// Common Empty State Component
const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-md">
        <p className="text-slate-600 dark:text-slate-300">{message}</p>
    </div>
);

// Common Header Component
const PerformanceHeader = ({
    title,
    date,
    setDate,
    type,
    toggleType,
    isLoading,
    showAll,
    setShowAll,
    children,
}: {
    title: string;
    date: any;
    setDate: any;
    type: any;
    toggleType: any;
    isLoading: boolean;
    showAll: boolean;
    setShowAll: (value: boolean | ((prev: boolean) => boolean)) => void;
    children: React.ReactNode;
}) => (
    <div className="flex justify-between mb-3 items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-3 rounded-md">
        <h1 className="text-sm lg:text-base uppercase font-semibold">
            {title}
        </h1>
        <Filter
            date={date}
            setDate={setDate}
            type={type}
            toggleType={toggleType}
            isLoading={isLoading}
            download={false}
        >
            {children}
            <Button
                onClick={() => setShowAll((prev) => !prev)}
                variant="secondary"
                className="ml-2"
                disabled={isLoading}
            >
                {showAll ? "Show Top 10" : "Show All"}
            </Button>
        </Filter>
    </div>
);

// Transform data utility
const transformChartData = (data: any[], showAll: boolean) => {
    const transformed = data?.map((item) => ({
        name: `${MONTHS[item.month - 1]} ${item.year}`,
        value: item.totalQty,
    }));

    return showAll ? transformed : transformed?.slice(0, TOP_N_LIMIT);
};

function ClientPerformance() {
    const [client, setClient] = useState("");
    const [showAll, setShowAll] = useState(false);
    const { date, setDate, toggleType, type } = useFilterDate();

    const { data, isLoading } = useClientPerformance(client, date, PRODUCT_IDS);
    const { data: clientsData, isLoading: isClientLoading } = useClient();

    const chartData = useMemo(
        () => transformChartData(data || [], showAll),
        [data, showAll]
    );

    return (
        <div className="space-y-4 py-2">
            <PerformanceHeader
                title="Client Performance"
                date={date}
                setDate={setDate}
                type={type}
                toggleType={toggleType}
                isLoading={isLoading}
                showAll={showAll}
                setShowAll={setShowAll}
            >
                <Select
                    value={client}
                    defaultValue={clientsData?.[0]?._id}
                    onValueChange={setClient}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="SELECT CLIENT" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="uppercase">
                                Clients - Market - District
                            </SelectLabel>
                            {isClientLoading && (
                                <SelectLabel className="text-center">
                                    <Loader2 className="animate-spin" />
                                </SelectLabel>
                            )}
                            {clientsData?.map((c) => (
                                <SelectItem key={c._id} value={c._id}>
                                    {c.name.toUpperCase()}
                                    {c?.market &&
                                        ` - ${c.market.toUpperCase()}`}
                                    {c?.district &&
                                        ` - ${c.district.toUpperCase()}`}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </PerformanceHeader>

            {isLoading ? (
                <LoadingState message="Loading client data..." />
            ) : chartData?.length ? (
                <Chart type="bar" data={chartData} />
            ) : (
                <EmptyState message="No client data available" />
            )}
        </div>
    );
}

function DistrictPerformance() {
    const [district, setDistrict] = useState("");
    const [showAll, setShowAll] = useState(false);
    const { date, setDate, toggleType, type } = useFilterDate();

    const { data, isLoading } = useDistrictPerformance(
        district,
        date,
        PRODUCT_IDS
    );
    const chartData = useMemo(
        () => transformChartData(data || [], showAll),
        [data, showAll]
    );

    return (
        <div className="space-y-4 py-2">
            <PerformanceHeader
                title="District Performance"
                date={date}
                setDate={setDate}
                type={type}
                toggleType={toggleType}
                isLoading={isLoading}
                showAll={showAll}
                setShowAll={setShowAll}
            >
                <Select
                    value={district}
                    defaultValue="muzaffarpur"
                    onValueChange={setDistrict}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="SELECT DISTRICT" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="uppercase">
                                Districts
                            </SelectLabel>
                            {DISTRICTS?.map((d) => (
                                <SelectItem key={d} value={d.toLowerCase()}>
                                    {d.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </PerformanceHeader>

            {isLoading ? (
                <LoadingState message="Loading district data..." />
            ) : chartData?.length ? (
                <Chart type="bar" data={chartData} />
            ) : (
                <EmptyState message="No district data available" />
            )}
        </div>
    );
}

function MarketPerformance() {
    const [district, setDistrict] = useState("");
    const [market, setMarket] = useState("");
    const [showAll, setShowAll] = useState(false);
    const { date, setDate, toggleType, type } = useFilterDate();

    const { data, isLoading } = useMarketPerformance(
        district,
        market,
        date,
        PRODUCT_IDS
    );
    const { data: marketData } = useMarket(district);

    const chartData = useMemo(
        () => transformChartData(data || [], showAll),
        [data, showAll]
    );

    return (
        <div className="space-y-4 py-2">
            <PerformanceHeader
                title="Market Performance"
                date={date}
                setDate={setDate}
                type={type}
                toggleType={toggleType}
                isLoading={isLoading}
                showAll={showAll}
                setShowAll={setShowAll}
            >
                <Select
                    value={district}
                    defaultValue="muzaffarpur"
                    onValueChange={setDistrict}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="SELECT DISTRICT" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="uppercase">
                                Districts
                            </SelectLabel>
                            {DISTRICTS?.map((d) => (
                                <SelectItem key={d} value={d.toLowerCase()}>
                                    {d.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select
                    value={market}
                    onValueChange={setMarket}
                    disabled={!district}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="SELECT MARKET" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="uppercase">
                                Markets
                            </SelectLabel>
                            {marketData?.map((m) => (
                                <SelectItem
                                    key={m.name}
                                    value={m.name.toLowerCase()}
                                >
                                    {m.name.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </PerformanceHeader>

            {isLoading ? (
                <LoadingState message="Loading market data..." />
            ) : chartData?.length ? (
                <Chart type="bar" data={chartData} />
            ) : (
                <EmptyState message="No market data available" />
            )}
        </div>
    );
}

export default function ChartsPage() {
    return (
        <div className="space-y-6">
            <ClientPerformance />
            <DistrictPerformance />
            <MarketPerformance />
        </div>
    );
}
