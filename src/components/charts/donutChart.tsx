"use client";
import { ProductStats } from "@/lib/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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

    return (
        <Doughnut
            data={data}
            options={{
                scales: {
                    // outerWidth: 0,
                },
            }}
        />
    );
};

export const Donut = ({ data }: { data: ProductStats[] | undefined }) => {
    return (
        <div className="flex justify-between items-center shadow-lg border px-8 py-3 rounded-lg w-fit  gap-20">
            <div className="flex flex-col items-center gap-4">
                <h1 className="font-semibold capitalize">Top Products</h1>
                <div className="w-24 h-24 md:w-40 md:h-40">
                    <DonutChart
                        dataSet={[
                            data?.[0]?.sales,
                            data?.[1]?.sales,
                            data?.[1]?.sales,
                        ]}
                    />
                </div>
            </div>

            <div className="flex flex-col items-start">
                {data?.[0] && (
                    <div className="flex items-center flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#98D89E] rounded-full" />
                            <span className="font-semibold text-sm capitalize">
                                {data?.[0].name}
                            </span>
                        </div>
                        <span className="text-sm text-zinc-400 self-start ml-5">
                            {data?.[0].sales}
                        </span>
                    </div>
                )}

                {data?.[1] && (
                    <div className="flex items-center flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#F6DC7D] rounded-full" />
                            <span className="font-semibold text-sm capitalize">
                                {data?.[1].name}
                            </span>
                        </div>
                        <span className="text-sm text-zinc-400 self-start ml-5">
                            {data?.[1].sales}
                        </span>
                    </div>
                )}

                {data?.[2] && (
                    <div className="flex items-center flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#EE8484] rounded-full" />
                            <span className="font-semibold text-sm capitalize">
                                {data?.[2].name}
                            </span>
                        </div>
                        <span className="text-sm text-zinc-400 self-start ml-5">
                            {data?.[2].sales}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
