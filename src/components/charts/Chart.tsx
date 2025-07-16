"use client";

import {
    Bar,
    BarChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
    Legend,
} from "recharts";

type ChartType = "bar" | "pie";
type ChartData = {
    name: string;
    [key: string]: string | number; // Allows dynamic data keys
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
     * The key in the data object that represents the target value (for bar charts)
     * @default "target"
     */
    targetKey?: string;
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

const DEFAULT_COLORS = ["#4ade80", "#f87171", "#60a5fa", "#facc15", "#a78bfa"];

export default function Chart({
    type,
    data,
    valueKey = "value",
    targetKey = "target",
    colors = DEFAULT_COLORS,
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

    // Prepare tooltip formatter
    const tooltipFormatter = (value: number, name: string) => {
        return [valueFormatter(value), name];
    };

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
                {type === "bar" ? (
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
                        />
                        {showTooltip && (
                            <Tooltip
                                formatter={tooltipFormatter}
                                labelFormatter={(label) => `Name: ${label}`}
                            />
                        )}
                        {showLegend && <Legend />}
                        {targetKey && (
                            <Bar
                                dataKey={targetKey}
                                fill="#3b82f6"
                                name="Target"
                                radius={[4, 4, 0, 0]}
                            />
                        )}
                        <Bar
                            dataKey={valueKey}
                            fill="#10b981"
                            name="Actual"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                ) : (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={type === "pie" ? 0 : 40}
                            dataKey={valueKey}
                            nameKey="name"
                            label={({ name, percent }) =>
                                `${name} ${((percent || 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        {showTooltip && (
                            <Tooltip formatter={tooltipFormatter} />
                        )}
                        {showLegend && <Legend />}
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
