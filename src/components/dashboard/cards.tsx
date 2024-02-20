"use client";
import { useClientStats, useProduct } from "@/hooks/use-fetch-data";
import {
    BadgeDollarSign,
    BaggageClaim,
    Box,
    IndianRupee,
    LucideIcon,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardCards() {
    const { data: product } = useProduct();
    const { data } = useClientStats({
        to: new Date(),
        from: undefined,
    });
    const [sale, setSale] = useState(0);
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        let Salesum = 0;
        let AmountSum = 0;
        data?.forEach((s) => {
            Salesum += s?.sales;
            AmountSum += s?.amount;
        });
        setSale(Salesum);
        setAmount(AmountSum);
    }, [data]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-3 mb-5 px-3">
            <Card
                Icon={Users}
                title="Total Client"
                number={data?.length as number}
                color="indigo"
            />
            <Card
                Icon={Box}
                title="Total Product"
                number={product?.length as number}
                color="orange"
            />
            <Card
                Icon={BaggageClaim}
                title="Total Sale"
                number={sale}
                color="green"
            />
            <Card
                Icon={BadgeDollarSign}
                title="Total Amount"
                number={amount}
                color="zinc"
                rupee={true}
            />
        </div>
    );
}

const Card = ({
    color,
    title,
    number,
    Icon,
    rupee = false,
}: {
    color: string;
    title: string;
    number: string | number;
    Icon: LucideIcon;
    rupee?: Boolean;
}) => {
    return (
        <div
            className={`drop-shadow-md flex justify-between items-center rounded-lg max-w-sm px-6 py-4 bg-zinc-50 dark:bg-white/10 gap-8`}
        >
            <div
                className={`w-20 py-4 rounded-lg bg-teal-100 dark:bg-white/5 px-5`}
            >
                <Icon className={`w-10 h-10 text-${color}-600`} />
            </div>
            <div className="flex flex-col gap- items-center">
                <span
                    className={`text-base text-end font-bold text-${color}-600 uppercase`}
                >
                    {title}
                </span>
                <span
                    className={`flex items-center self-end text-xl font-bold text-${color}-600`}
                >
                    {rupee && <IndianRupee className="w-5 h-5" />}
                    {number}
                </span>
            </div>
        </div>
    );
};
