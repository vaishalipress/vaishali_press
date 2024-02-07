"use client";
import { Button } from "@/components/ui/button";
import { useSaleFilter } from "@/hooks/useSaleFilter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { FC } from "react";

interface prop {
    total: number;
    isLoading: boolean;
}

const Pagination: FC<prop> = ({ total, isLoading }) => {
    const { view, page, setPage } = useSaleFilter();

    const hasPrev = Number(view) * (page - 1) > 0;
    const hasNext = Number(view) * (page - 1) + Number(view) < total;

    const pageHandler = (type: "prev" | "next") => {
        type === "prev" ? setPage(page - 1) : setPage(page + 1);
    };

    return (
        <div className="flex items-center justify-around mt-2">
            <Button
                variant={"outline"}
                disabled={!hasPrev || isLoading}
                onClick={() => pageHandler("prev")}
            >
                <ArrowLeft />
            </Button>
            <span className="text-base">{page}</span>
            <Button
                variant={"outline"}
                disabled={!hasNext || isLoading}
                onClick={() => pageHandler("next")}
            >
                <ArrowRight />
            </Button>
        </div>
    );
};

export default Pagination;
