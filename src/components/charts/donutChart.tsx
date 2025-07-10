"use client";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { IndianRupee } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

const COLOR_PALETTE = ["#98D89E", "#F6DC7D", "#EE8484", "#F84848"];

interface DonutChartProps {
    dataSet: number[];
    labels?: string[];
}

const DonutChart = ({ dataSet, labels }: DonutChartProps) => {
    const data = {
        labels: labels || Array.from({ length: dataSet.length }, (_, i) => `Category ${i + 1}`),
        datasets: [
            {
                label: "Value",
                data: dataSet,
                backgroundColor: COLOR_PALETTE.slice(0, dataSet.length),
                borderColor: COLOR_PALETTE.slice(0, dataSet.length),
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    return <Doughnut data={data} />;
};

interface DataType {
    name: string;
    value: number;
}

interface DonutProps {
    data?: DataType[];
    title: string;
    rupeeSymbol?: boolean;
}

export const Donut = ({ data, title, rupeeSymbol = false }: DonutProps) => {
    // Filter out any undefined/null data and ensure we have valid numbers
    const validData = data?.filter(item => item?.value !== undefined && !isNaN(item.value)) || [];

    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-5 shadow-lg border px-8 py-3 rounded-lg">
            <div className="flex flex-col items-center gap-4">
                <h1 className="font-semibold uppercase">{title}</h1>
                <div className="w-24 h-24 md:w-40 md:h-40">
                    {validData.length > 0 ? (
                        <DonutChart
                            dataSet={validData.map(d => d.value)}
                            labels={validData.map(d => d.name)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No data available
                        </div>
                    )}
                </div>
            </div>

            {validData.length > 0 && (
                <div className="flex flex-col items-start gap-1 md:gap-3 w-full sm:w-auto sm:max-w-[40%] overflow-hidden">
                    {validData.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="w-full">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 min-w-2 min-h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: COLOR_PALETTE[index] }}
                                />
                                <span className="font-semibold text-xs md:text-sm uppercase truncate">
                                    {item.name}
                                </span>
                            </div>
                            <div className="text-sm text-zinc-400 ml-4 flex items-center">
                                {rupeeSymbol && <IndianRupee className="w-3 h-3 mr-0.5" />}
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};