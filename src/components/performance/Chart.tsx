"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";

type ChartType = "bar" | "pie";

type ChartData = {
    name: string;
    [key: string]: string | number;
};

interface ChartProps {
    type: ChartType;
    data: ChartData[];
    /**
     * The key in the data object that represents the value to display
     * @default "value"
     */
    valueKey?: string;
    /**
     * Custom colors for the chart elements
     */
    colors?: string[];
    /**
     * Height of the chart container
     * @default 300
     */
    height?: number;
    /**
     * Whether to show the legend
     * @default true
     */
    showLegend?: boolean;
    /**
     * Whether to show tooltips
     * @default true
     */
    showTooltip?: boolean;
    /**
     * Custom formatter for tooltip values
     */
    valueFormatter?: (value: number) => string;
}

export default function Chart({
    type,
    data,
    valueKey = "value",
    height = 300,
    showLegend = true,
    showTooltip = true,
    valueFormatter = (value) => value.toString(),
}: ChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    No data to display
                </div>
            </div>
        );
    }

    const tooltipFormatter = (value: number, name: string) => {
        return [valueFormatter(value), name];
    };
    const maxValue = Math.max(...data?.map((item) => item.value as number));

    return (
        <div className="overflow-x-auto">
            <div
                style={{
                    width:
                        type === "bar" && data.length > 20
                            ? `${data.length * 50}px`
                            : "100%",
                    height: `${height}px`,
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                                value.length > 10
                                    ? `${value.substring(0, 8)}...`
                                    : value
                            }
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={valueFormatter}
                            domain={[0, maxValue]}
                        />
                        {showTooltip && (
                            <Tooltip
                                formatter={tooltipFormatter}
                                labelFormatter={(label) => `Name: ${label}`}
                                contentStyle={{ textTransform: "capitalize" }}
                            />
                        )}
                        {showLegend && <Legend />}
                        <Bar
                            dataKey={valueKey}
                            fill="#10b981"
                            name="Quantity"
                            radius={[2, 2, 2, 2]}
                            activeBar={{}}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
