import { isAuth } from "@/lib/isAuth";
// import {
//     getDistinctFilterValues,
//     getTargetAchievementByYearMarketMonth,
//     getTargetAchievementCombined,
//     getTargetAchievementYearMonthMarket,
// } from "@/lib/target-analysis";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

type GroupBy = "market" | "district";

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const type = searchParams.get("type") || "hierarchical";
        const groupBy: GroupBy =
            (searchParams.get("groupBy") as GroupBy) === "district"
                ? "district"
                : "market";

        const startYearParam = searchParams.get("startYear");
        const endYearParam = searchParams.get("endYear");
        const monthParam = searchParams.get("month");
        const marketIdsParam = searchParams.get("marketIds"); // Comma-separated market IDs
        const productIdsParam = searchParams.get("productIds"); // Comma-separated product IDs
        const districtParam = searchParams.get("districts");

        // Parse and validate market IDs
        let districts: string[] | undefined = undefined;
        if (districtParam) {
            districts = districtParam.split(",");
        }

        // Parse and validate market IDs
        let marketIds: mongoose.Types.ObjectId[] | undefined;
        if (marketIdsParam) {
            const ids = marketIdsParam.split(",");
            marketIds = ids.map((id) => {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid market ID format: ${id}`);
                }
                return new mongoose.Types.ObjectId(id);
            });
        }

        // Parse and validate product IDs
        let productIds: mongoose.Types.ObjectId[] | undefined;
        if (productIdsParam) {
            const ids = productIdsParam.split(",");
            productIds = ids.map((id) => {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid product ID format: ${id}`);
                }
                return new mongoose.Types.ObjectId(id);
            });
        }

        // Validate and parse query parameters
        let year: number | undefined;
        if (startYearParam) {
            year = parseInt(startYearParam);
            if (isNaN(year)) {
                return Response.json(
                    { message: "Invalid year parameter" },
                    { status: 400 }
                );
            }
        }

        let month: number | undefined;
        if (monthParam) {
            month = parseInt(monthParam);
            if (isNaN(month) || month < 0 || month > 11) {
                return Response.json(
                    { message: "Invalid month parameter (must be 0-11)" },
                    { status: 400 }
                );
            }
        }

        let startYear: number | undefined;
        if (startYearParam) {
            startYear = parseInt(startYearParam);
            if (isNaN(startYear)) {
                return Response.json(
                    { message: "Invalid startYear parameter" },
                    { status: 400 }
                );
            }
        }

        let endYear: number | undefined;
        if (endYearParam) {
            endYear = parseInt(endYearParam);
            if (isNaN(endYear)) {
                return Response.json(
                    { message: "Invalid endYear parameter" },
                    { status: 400 }
                );
            }
        }

        if (startYear && endYear && endYear < startYear) {
            return Response.json(
                { message: "endYear cannot be before startYear" },
                { status: 400 }
            );
        }

        // Usage example:
        // const {
        //     years,
        //     markets,
        //     districts: districtsData,
        // } = await getDistinctFilterValues();

        // if (type === "year-month-market") {
        //     const results = await getTargetAchievementYearMonthMarket({
        //         startYear,
        //         endYear,
        //         month,
        //         marketIds,
        //         productIds,
        //         districts: districts || undefined,
        //         groupBy,
        //     });

        //     return Response.json(
        //         {
        //             results,
        //             success: true,
        //             type: "year > month > market",
        //             years,
        //             markets,
        //             districts: districtsData,
        //         },
        //         { status: 200 }
        //     );
        // }

        // if (type === "year-market-month") {
        //     const results = await getTargetAchievementByYearMarketMonth({
        //         year,
        //         marketIds,
        //         month,
        //         productIds,
        //         districts: districts || undefined,
        //         groupBy,
        //     });

        //     return Response.json(
        //         {
        //             results,
        //             success: true,
        //             years,
        //             markets,
        //             districts: districtsData,
        //             type: "year > market > month",
        //         },
        //         { status: 200 }
        //     );
        // }

        // const results = await getTargetAchievementCombined({
        //     month,
        //     year,
        //     groupBy,
        //     marketIds,
        //     productIds,
        //     districts: districts || undefined,
        // });

        return Response.json(
            {
                // results,
                success: true,
                // type: "Combined",
                // years,
                // markets,
                // districts: districtsData,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Target Analysis API Error:", err);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
