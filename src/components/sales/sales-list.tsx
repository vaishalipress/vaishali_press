"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    BaggageClaim,
    Download,
    IndianRupee,
    Pen,
    Trash,
    X,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { LoadingCells } from "@/components/loading";
import { useSale } from "@/hooks/use-fetch-data";
import { FilterSale } from "@/components/sales/filter-sales";
import { useSaleFilter } from "@/hooks/useSaleFilter";
import Pagination from "../pagination/pagination";
import { downloadToPDF, formatDateUTC } from "@/lib/utils";
import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import { SalesTypeExtended } from "@/lib/types";

export default function SalesList({ isFormOpen }: { isFormOpen: boolean }) {
    const { onOpen } = useModal();
    const {
        date,
        setDate,
        toggleType,
        type,
        product,
        client,
        market,
        district,
        setClient,
        setProduct,
        page,
        view,
        setPage,
        setView,
    } = useSaleFilter();
    const { data, isLoading } = useSale({
        date,
        client,
        product,
        district,
        market,
        page,
        view,
    }); //fetch data

    const [amount, setAmount] = useState(0);
    const [qty, setQty] = useState(0);

    // Keyboard navigation state
    const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        let AmountSum = 0;
        let qtySum = 0;
        data?.sales?.forEach((s) => {
            AmountSum += s?.qty * s?.rate;
            qtySum += s?.qty;
        });
        setAmount(AmountSum);
        setQty(qtySum);
    }, [data]);

    const [selectedSales, setSelectedSales] = useState(
        new Map<string, string>()
    );

    const handleToggle = (sale: SalesTypeExtended, checked: boolean) => {
        setSelectedSales((prev) => {
            const newMap = new Map(prev);
            if (checked) {
                newMap.set(sale._id, sale._id);
            } else {
                newMap.delete(sale._id);
            }
            return newMap;
        });
    };

    const clearAllSelected = () => {
        setSelectedSales(new Map());
        setFocusedRowIndex(-1); // Reset focus as well
    };

    // Toggle selection for current focused row
    const toggleCurrentRow = useCallback(() => {
        if (
            focusedRowIndex >= 0 &&
            data?.sales &&
            focusedRowIndex < data.sales.length
        ) {
            const currentSale = data.sales[focusedRowIndex];
            const isCurrentlySelected = selectedSales.has(currentSale._id);
            handleToggle(currentSale, !isCurrentlySelected);
        }
    }, [focusedRowIndex, data?.sales, selectedSales]);

    // Move focus to next row and optionally toggle selection
    const navigateAndToggle = useCallback(
        (direction: "down" | "up", shouldToggle: boolean = false) => {
            if (!data?.sales || data.sales.length === 0) return;

            let newIndex = focusedRowIndex;

            if (direction === "down") {
                newIndex = Math.min(focusedRowIndex + 1, data.sales.length - 1);
            } else {
                newIndex = Math.max(focusedRowIndex - 1, 0);
            }

            setFocusedRowIndex(newIndex);

            // If shift is pressed and we're navigating, toggle the new row
            if (shouldToggle && newIndex !== focusedRowIndex) {
                const targetSale = data.sales[newIndex];
                const isSelected = selectedSales.has(targetSale._id);
                handleToggle(targetSale, !isSelected);
            }

            // Scroll the focused row into view
            setTimeout(() => {
                const tableRows =
                    tableRef.current?.querySelectorAll("tbody tr");
                if (tableRows && tableRows[newIndex]) {
                    (tableRows[newIndex] as HTMLElement).scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                    });
                }
            }, 0);
        },
        [focusedRowIndex, data?.sales, selectedSales, handleToggle]
    );

    // Keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Track shift key state
            if (e.key === "Shift") {
                setIsShiftPressed(true);
                return;
            }

            // Handle arrow keys - with or without shift
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    if (isShiftPressed) {
                        // Shift + Arrow = Navigate and toggle
                        navigateAndToggle("down", true);
                    } else {
                        // Just Arrow = Navigate only
                        navigateAndToggle("down", false);
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    if (isShiftPressed) {
                        // Shift + Arrow = Navigate and toggle
                        navigateAndToggle("up", true);
                    } else {
                        // Just Arrow = Navigate only
                        navigateAndToggle("up", false);
                    }
                    break;
                case " ": // Spacebar
                    e.preventDefault();
                    toggleCurrentRow();
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setIsShiftPressed(false);
            }
        };

        if (isFormOpen) {
            // Remove event listeners
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        } else {
            // Add event listeners
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
        }

        // Cleanup
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [isShiftPressed, navigateAndToggle, toggleCurrentRow, isFormOpen]);

    // Handle table focus
    const handleTableFocus = () => {
        if (focusedRowIndex === -1 && data?.sales && data.sales.length > 0) {
            setFocusedRowIndex(0);
        }
    };

    // Reset states when data changes
    useEffect(() => {
        setSelectedSales(new Map());
        setFocusedRowIndex(-1);
    }, [data]);

    return (
        <div className="max-w-7xl w-full flex flex-col gap-3">
            <Suspense>
                <FilterSale
                    date={date}
                    setDate={setDate}
                    toggleType={toggleType}
                    type={type}
                    client={client}
                    product={product}
                    setClient={setClient}
                    setProduct={setProduct}
                    setPage={setPage}
                    setView={setView}
                    page={page}
                    view={view}
                />
            </Suspense>
            <div className="border w-full rounded-md py-3 shadow-md">
                <div className="flex justify-between gap-3 mb-3 px-3">
                    <div className="flex items-center gap-3">
                        <BaggageClaim className="text-indigo-500 w-6 h-6" />
                        <h1 className="uppercase text-indigo-600 font-bold text-lg">
                            Sales
                        </h1>
                        <span className="uppercase text-indigo-600 font-bold text-lg">
                            {data?.total}
                        </span>
                    </div>
                    <div className="space-x-2">
                        {selectedSales?.size > 0 && (
                            <>
                                <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    onClick={clearAllSelected}
                                    title="Clear all selections"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant={"destructive"}
                                    size={"icon"}
                                    onClick={() =>
                                        onOpen("deleteSales", {
                                            sales: selectedSales,
                                        })
                                    }
                                >
                                    <Trash className="w-5 h-5" />
                                </Button>
                            </>
                        )}
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() =>
                                downloadToPDF(
                                    isLoading,
                                    "#sales",
                                    `sales-${client}-${product}.pdf`
                                )
                            }
                        >
                            <Download className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Keyboard navigation hint */}
                <div className="px-3 mb-2">
                    <p className="text-xs text-gray-500">
                        💡{" "}
                        <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                            ↓
                        </kbd>
                        <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded ml-1">
                            ↑
                        </kbd>{" "}
                        to navigate •
                        <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded ml-1">
                            Space
                        </kbd>{" "}
                        to select • Hold
                        <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded ml-1">
                            Shift
                        </kbd>{" "}
                        +
                        <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded ml-1">
                            ↓↑
                        </kbd>{" "}
                        to select while navigating
                        {selectedSales?.size > 0 && (
                            <span className="ml-2 text-indigo-600 font-medium">
                                • {selectedSales.size} selected
                            </span>
                        )}
                    </p>
                </div>

                <div>
                    <Table
                        id="sales"
                        ref={tableRef}
                        tabIndex={0}
                        onFocus={handleTableFocus}
                        className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>S.No</TableHead>
                                <TableHead className="uppercase min-w-[75px] lg:min-w-[120px]">
                                    Date
                                </TableHead>
                                <TableHead className="uppercase">
                                    Client
                                </TableHead>
                                <TableHead className="uppercase">
                                    Market
                                </TableHead>
                                <TableHead className="uppercase">
                                    District
                                </TableHead>
                                <TableHead className="min-w-[150px] uppercase">
                                    Product
                                </TableHead>
                                <TableHead className="uppercase">Qty</TableHead>
                                <TableHead className="uppercase">
                                    Rate
                                </TableHead>
                                <TableHead className="uppercase min-w-[200px] lg:min-w-[140px]">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <LoadingCells cols={8} />}
                            {data?.sales?.map((sale, idx) => (
                                <TableRow
                                    key={sale?._id + idx}
                                    className={`
                                        transition-colors duration-150
                                        ${
                                            focusedRowIndex === idx
                                                ? "bg-indigo-50 ring-2 ring-indigo-200"
                                                : ""
                                        }
                                        ${
                                            selectedSales.has(sale._id)
                                                ? "bg-blue-50"
                                                : ""
                                        }
                                        hover:bg-gray-50
                                    `}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedSales.has(
                                                sale._id
                                            )}
                                            onCheckedChange={(e) =>
                                                handleToggle(sale, e as boolean)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {view * ((page || 1) - 1) + idx + 1}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.date &&
                                            formatDateUTC(sale?.date)}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.client?.name.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.client?.market
                                            ? sale?.client?.market.toUpperCase()
                                            : "NA"}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.client?.district.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="font-medium text-xs lg:text-sm">
                                        {sale?.name.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        {sale?.qty}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-xs lg:text-sm">
                                            <IndianRupee className="w-3 h-3 text-black/60" />
                                            {sale?.rate}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs lg:text-sm">
                                        <div className="capitalize flex items-center">
                                            <p className="flex items-center">
                                                {sale?.qty} x
                                                <IndianRupee className="ml-1 w-3 h-3 text-black/60" />
                                                {sale?.rate}
                                            </p>
                                            <span className="mx-1">=</span>
                                            <IndianRupee className="w-3 h-3 text-black/60" />
                                            <span>
                                                {sale?.qty * sale?.rate}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                onOpen("editSale", { sale });
                                            }}
                                            size={"sm"}
                                            variant={"destructive"}
                                        >
                                            <Pen className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={6}>TOTAL</TableCell>
                                <TableCell colSpan={2}> {qty}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center text-xs lg:text-sm">
                                        <IndianRupee className="w-3 h-3" />
                                        {amount}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Suspense>
                        {data && data?.total > Number(view) && (
                            <Pagination
                                isLoading={isLoading}
                                total={data?.total || 0}
                            />
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
