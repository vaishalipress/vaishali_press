"use client";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { IndianRupee } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

const DonutChart = ({ dataSet }: { dataSet: (number | undefined)[] }) => {
    const data = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
            {
                label: "# of Votes",
                data: dataSet,
                backgroundColor: ["#98D89E", "#F6DC7D", "#EE8484"],
                borderColor: ["#98D89E", "#F6DC7D", "#EE8484"],
                borderWidth: [1, 1, 1],
                borderRadius: [5, 5, 5],
            },
        ],
    };

    return <Doughnut data={data} />;
};
interface dataType {
    name: string;
    value: number;
}

export const Donut = ({
    data,
    title,
    rupeeSymbol = false,
}: {
    rupeeSymbol?: boolean;
    title: string;
    data: dataType[] | undefined;
}) => {
    return (
        <div className="w-full flex justify-between items-center gap-5 shadow-lg border px-8 py-3 rounded-lg">
            <div className="flex flex-col items-center gap-4">
                <h1 className="font-semibold uppercase">{title}</h1>
                <div className="w-24 h-24 md:w-40 md:h-40">
                    <DonutChart
                        dataSet={[
                            data?.[0]?.value,
                            data?.[1]?.value,
                            data?.[2]?.value,
                        ]}
                    />
                </div>
            </div>

            <div className="flex flex-col items-start gap-1 md:gap-3 max-w-[40%] sm:max-w-fit overflow-hidden">
                {data?.[0] && (
                    <div className="flex items-center flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 min-w-2 min-h-2 bg-[#98D89E] rounded-full" />
                            <span className="font-semibold text-xs md:text-sm uppercase">
                                {data?.[0]?.name}
                            </span>
                        </div>

                        <span className="text-sm text-zinc-400 self-start ml-5 flex items-center">
                            {rupeeSymbol && <IndianRupee className="w-3 h-3" />}
                            {data?.[0]?.value}
                        </span>
                    </div>
                )}

                {data?.[1] && (
                    <div className="flex items-center flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 min-w-2 min-h-2 bg-[#F6DC7D] rounded-full" />
                            <span className="font-semibold text-xs md:text-sm uppercase">
                                {data?.[1]?.name}
                            </span>
                        </div>
                        <span className="text-sm text-zinc-400 self-start ml-5 flex items-center">
                            {rupeeSymbol && <IndianRupee className="w-3 h-3" />}
                            {data?.[1]?.value}
                        </span>
                    </div>
                )}

                {data?.[2] && (
                    <div className="flex items-center flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 min-w-2 min-h-2 bg-[#EE8484] rounded-full" />
                            <span className="font-semibold text-xs md:text-sm uppercase">
                                {data?.[2]?.name}
                            </span>
                        </div>
                        <span className="text-sm text-zinc-400 self-start ml-5 flex items-center">
                            {rupeeSymbol && <IndianRupee className="w-3 h-3" />}
                            {data?.[2]?.value}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
