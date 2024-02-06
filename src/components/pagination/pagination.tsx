"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC } from "react";

interface prop {
    total: number;
    isLoading: boolean;
}

const Pagination: FC<prop> = ({ total, isLoading }) => {
    const { replace } = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const view = params.get("view") || "200";
    const page = Number(searchParams.get("page")) || 1;

    const hasPrev = Number(view) * (page - 1) > 0;
    const hasNext = Number(view) * (page - 1) + Number(view) < total;

    const pageHandler = (type: "prev" | "next") => {
        type === "prev"
            ? params.set("page", `${page - 1}`)
            : params.set("page", `${page + 1}`);
        replace(`${path}?${params}`);
    };

    return (
        <div className="flex justify-around">
            <Button
                variant={"outline"}
                disabled={!hasPrev || isLoading}
                onClick={() => pageHandler("prev")}
            >
                <ArrowLeft />
            </Button>
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
