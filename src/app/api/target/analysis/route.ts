import { isAuth } from "@/lib/isAuth";
import Target from "@/models/target";
import mongoose, { PipelineStage } from "mongoose";

// groupType: (year > market > month)";
export async function getTargetAchievementByYearMarketMonth(query: {
    year?: number;
    month?: number;
    marketIds?: mongoose.Types.ObjectId[];
    productIds?: mongoose.Types.ObjectId[];
    district?: string;
}) {
    const { year, month, marketIds, productIds, district } = query;

    const pipeline: PipelineStage[] = [];

    // Match targets by year if provided
    if (year !== undefined) {
        pipeline.push({ $match: { year } });
    }

    // Filter by specific month if provided
    if (month !== undefined) {
        pipeline.push({ $match: { month } });
    }

    // Filter by market IDs if provided
    if (marketIds && marketIds.length > 0) {
        pipeline.push({ $match: { market: { $in: marketIds } } });
    }

    // Lookup market details
    pipeline.push({
        $lookup: {
            from: "markets",
            localField: "market",
            foreignField: "_id",
            as: "marketData",
        },
    });

    pipeline.push({ $unwind: "$marketData" });

    // Filter by district if provided
    if (district) {
        pipeline.push({ $match: { "marketData.district": district } });
    }

    // Lookup clients for these markets
    pipeline.push({
        $lookup: {
            from: "clients",
            localField: "marketData.name",
            foreignField: "market",
            as: "clients",
        },
    });

    // Lookup sales data with product filtering
    pipeline.push({
        $lookup: {
            from: "sales",
            let: {
                targetMonth: "$month",
                targetYear: "$year",
                clientIds: "$clients._id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $in: ["$client", "$$clientIds"] },
                                {
                                    $eq: [
                                        { $month: "$date" },
                                        { $add: ["$$targetMonth", 1] },
                                    ],
                                },
                                { $eq: [{ $year: "$date" }, "$$targetYear"] },
                                ...(productIds && productIds.length > 0
                                    ? [{ $in: ["$product", productIds] }]
                                    : []),
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: { $multiply: ["$qty", "$rate"] } },
                        totalQty: { $sum: "$qty" },
                    },
                },
            ],
            as: "salesData",
        },
    });

    pipeline.push({
        $unwind: { path: "$salesData", preserveNullAndEmptyArrays: true },
    });

    // First group by market and month
    pipeline.push({
        $group: {
            _id: {
                marketId: "$market",
                marketName: "$marketData.name",
                month: "$month",
            },
            targetValue: { $sum: "$targetValue" },
            actualSales: { $sum: { $ifNull: ["$salesData.totalSales", 0] } },
            actualQty: { $sum: { $ifNull: ["$salesData.totalQty", 0] } },
        },
    });

    // Calculate achievement percentage
    pipeline.push({
        $addFields: {
            achievementPercentage: {
                $cond: [
                    { $eq: ["$targetValue", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$actualSales", "$targetValue"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Then group by market
    pipeline.push({
        $group: {
            _id: {
                marketId: "$_id.marketId",
                marketName: "$_id.marketName",
            },
            months: {
                $push: {
                    month: "$_id.month",
                    targetValue: "$targetValue",
                    actualSales: "$actualSales",
                    actualQty: "$actualQty",
                    achievementPercentage: "$achievementPercentage",
                },
            },
            yearlyTarget: { $sum: "$targetValue" },
            yearlySales: { $sum: "$actualSales" },
            yearlyQty: { $sum: "$actualQty" },
        },
    });

    // Calculate yearly achievement
    pipeline.push({
        $addFields: {
            yearlyAchievement: {
                $cond: [
                    { $eq: ["$yearlyTarget", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$yearlySales", "$yearlyTarget"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Final group by year
    pipeline.push({
        $group: {
            _id: null,
            markets: {
                $push: {
                    marketId: "$_id.marketId",
                    marketName: "$_id.marketName",
                    months: "$months",
                    yearlyTarget: "$yearlyTarget",
                    yearlySales: "$yearlySales",
                    yearlyQty: "$yearlySales",
                    yearlyAchievement: "$yearlyAchievement",
                },
            },
            overallYearlyTarget: { $sum: "$yearlyTarget" },
            overallYearlySales: { $sum: "$yearlySales" },
            overallYearlyQty: { $sum: "$yearlyQty" },
        },
    });

    // Calculate overall yearly achievement
    pipeline.push({
        $addFields: {
            overallYearlyAchievement: {
                $cond: [
                    { $eq: ["$overallYearlyTarget", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$overallYearlySales",
                                    "$overallYearlyTarget",
                                ],
                            },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Project final results
    pipeline.push({
        $project: {
            _id: 0,
            markets: 1,
            overallYearlyTarget: 1,
            overallYearlySales: 1,
            overallYearlyQty: 1,
            overallYearlyAchievement: 1,
        },
    });

    return Target.aggregate(pipeline);
}

// groupType:  (year > month > market);
export async function getTargetAchievementYearMonthMarket(query: {
    startYear?: number;
    endYear?: number;
    month?: number;
    groupBy?: "market" | "district";
    marketIds?: mongoose.Types.ObjectId[]; // Array of market IDs
    productIds?: mongoose.Types.ObjectId[]; // Array of product IDs
    district?: string;
}) {
    const {
        startYear,
        endYear,
        month,
        groupBy = "market",
        marketIds,
        productIds,
        district,
    } = query;

    const pipeline: PipelineStage[] = [];

    // Match targets by year range if provided
    if (startYear !== undefined || endYear !== undefined) {
        const yearMatch: Record<string, any> = {};
        if (startYear !== undefined) yearMatch.$gte = startYear;
        if (endYear !== undefined) yearMatch.$lte = endYear;
        pipeline.push({ $match: { year: yearMatch } });
    }

    // Filter by specific month if provided
    if (month !== undefined) {
        pipeline.push({ $match: { month } });
    }

    // Filter by market IDs if provided
    if (marketIds && marketIds.length > 0) {
        pipeline.push({ $match: { market: { $in: marketIds } } });
    }

    // Lookup market details
    pipeline.push({
        $lookup: {
            from: "markets",
            localField: "market",
            foreignField: "_id",
            as: "marketData",
        },
    });

    pipeline.push({ $unwind: "$marketData" });

    // Filter by district if provided
    if (district) {
        pipeline.push({ $match: { "marketData.district": district } });
    }

    // Lookup clients for these markets
    pipeline.push({
        $lookup: {
            from: "clients",
            localField: "marketData.name",
            foreignField: "market",
            as: "clients",
        },
    });

    // Lookup sales data with product filtering
    pipeline.push({
        $lookup: {
            from: "sales",
            let: {
                targetMonth: "$month",
                targetYear: "$year",
                clientIds: "$clients._id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $in: ["$client", "$$clientIds"] },
                                {
                                    $eq: [
                                        { $month: "$date" },
                                        { $add: ["$$targetMonth", 1] },
                                    ],
                                },
                                { $eq: [{ $year: "$date" }, "$$targetYear"] },
                                // Add product filter if productIds provided
                                ...(productIds && productIds.length > 0
                                    ? [{ $in: ["$product", productIds] }]
                                    : []),
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: { $multiply: ["$qty", "$rate"] } },
                        totalQty: { $sum: "$qty" },
                    },
                },
            ],
            as: "salesData",
        },
    });

    pipeline.push({
        $unwind: { path: "$salesData", preserveNullAndEmptyArrays: true },
    });

    // First group by market/district, year and month
    pipeline.push({
        $group: {
            _id: {
                groupField:
                    groupBy === "market" ? "$market" : "$marketData.district",
                year: "$year",
                month: "$month",
            },
            targetValue: { $sum: "$targetValue" },
            actualSales: { $sum: { $ifNull: ["$salesData.totalSales", 0] } },
            actualQty: { $sum: { $ifNull: ["$salesData.totalQty", 0] } },
            ...(groupBy === "market" && {
                marketName: { $first: "$marketData.name" },
            }),
            ...(groupBy === "district" && {
                district: { $first: "$marketData.district" },
            }),
        },
    });

    // Calculate achievement percentage
    pipeline.push({
        $addFields: {
            achievementPercentage: {
                $cond: [
                    { $eq: ["$targetValue", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$actualSales", "$targetValue"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Then group by year and month
    pipeline.push({
        $group: {
            _id: {
                year: "$_id.year",
                month: "$_id.month",
            },
            year: { $first: "$_id.year" },
            month: { $first: "$_id.month" },
            monthlyTarget: { $sum: "$targetValue" },
            monthlySales: { $sum: "$actualSales" },
            monthlyQty: { $sum: "$actualQty" },
            groups: {
                $push: {
                    [groupBy === "market" ? "marketId" : "district"]:
                        "$_id.groupField",
                    ...(groupBy === "market" && { marketName: "$marketName" }),
                    targetValue: "$targetValue",
                    actualSales: "$actualSales",
                    actualQty: "$actualQty",
                    achievementPercentage: "$achievementPercentage",
                },
            },
        },
    });

    // Calculate monthly achievement
    pipeline.push({
        $addFields: {
            monthlyAchievement: {
                $cond: [
                    { $eq: ["$monthlyTarget", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$monthlySales", "$monthlyTarget"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Final group by year for structured output
    pipeline.push({
        $group: {
            _id: "$year",
            year: { $first: "$year" },
            months: {
                $push: {
                    month: "$month",
                    monthlyTarget: "$monthlyTarget",
                    monthlySales: "$monthlySales",
                    monthlyQty: "$monthlyQty",
                    monthlyAchievement: "$monthlyAchievement",
                    groups: "$groups",
                },
            },
            yearlyTarget: { $sum: "$monthlyTarget" },
            yearlySales: { $sum: "$monthlySales" },
            yearlyQty: { $sum: "$monthlyQty" },
        },
    });

    // Calculate yearly achievement
    pipeline.push({
        $addFields: {
            yearlyAchievement: {
                $cond: [
                    { $eq: ["$yearlyTarget", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$yearlySales", "$yearlyTarget"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Project final results
    pipeline.push({
        $project: {
            _id: 0,
            year: 1,
            months: {
                $map: {
                    input: "$months",
                    as: "monthData",
                    in: {
                        month: "$$monthData.month",
                        monthlyTarget: "$$monthData.monthlyTarget",
                        monthlySales: "$$monthData.monthlySales",
                        monthlyQty: "$$monthData.monthlyQty",
                        monthlyAchievement: "$$monthData.monthlyAchievement",
                        groups: "$$monthData.groups",
                    },
                },
            },
            yearlyTarget: 1,
            yearlySales: 1,
            yearlyQty: 1,
            yearlyAchievement: 1,
        },
    });

    // Sort by year and month
    pipeline.push({
        $sort: {
            year: 1,
            "months.month": 1,
        },
    });

    return Target.aggregate(pipeline);
}

// groupType:  Combined-> Market / District;
export async function getTargetAchievementCombined(query: {
    month?: number;
    year?: number;
    groupBy?: "market" | "district";
    marketIds?: mongoose.Types.ObjectId[];
    productIds?: mongoose.Types.ObjectId[];
    district?: string;
}) {
    const {
        month,
        year,
        groupBy = "market",
        marketIds,
        productIds,
        district,
    } = query;

    const pipeline: PipelineStage[] = [];

    // Match targets by month/year if provided
    if (month !== undefined || year !== undefined) {
        pipeline.push({
            $match: {
                ...(month !== undefined && { month }),
                ...(year !== undefined && { year }),
            },
        });
    }

    // Filter by market IDs if provided
    if (marketIds && marketIds.length > 0) {
        pipeline.push({ $match: { market: { $in: marketIds } } });
    }

    // Lookup market details
    pipeline.push({
        $lookup: {
            from: "markets",
            localField: "market",
            foreignField: "_id",
            as: "marketData",
        },
    });

    pipeline.push({ $unwind: "$marketData" });

    // Filter by district if provided
    if (district) {
        pipeline.push({ $match: { "marketData.district": district } });
    }

    // Lookup clients for these markets
    pipeline.push({
        $lookup: {
            from: "clients",
            localField: "marketData.name",
            foreignField: "market",
            as: "clients",
        },
    });

    // Lookup sales data with product filtering
    pipeline.push({
        $lookup: {
            from: "sales",
            let: {
                targetMonth: "$month",
                targetYear: "$year",
                clientIds: "$clients._id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $in: ["$client", "$$clientIds"] },
                                {
                                    $eq: [
                                        { $month: "$date" },
                                        { $add: ["$$targetMonth", 1] },
                                    ],
                                },
                                { $eq: [{ $year: "$date" }, "$$targetYear"] },
                                ...(productIds && productIds.length > 0
                                    ? [{ $in: ["$product", productIds] }]
                                    : []),
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: { $multiply: ["$qty", "$rate"] } },
                        totalQty: { $sum: "$qty" },
                    },
                },
            ],
            as: "salesData",
        },
    });

    pipeline.push({
        $unwind: { path: "$salesData", preserveNullAndEmptyArrays: true },
    });

    // Calculate achievement
    pipeline.push({
        $addFields: {
            actualSales: { $ifNull: ["$salesData.totalSales", 0] },
            actualQty: { $ifNull: ["$salesData.totalQty", 0] },
            achievementPercentage: {
                $cond: [
                    { $eq: ["$targetValue", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$salesData.totalSales",
                                    "$targetValue",
                                ],
                            },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Group by selected field (market or district)
    pipeline.push({
        $group: {
            _id: groupBy === "market" ? "$market" : "$marketData.district",
            targetValue: { $sum: "$targetValue" },
            actualSales: { $sum: "$actualSales" },
            actualQty: { $sum: "$actualQty" },
            achievementPercentage: { $avg: "$achievementPercentage" },
            count: { $sum: 1 },
            ...(groupBy === "market" && {
                marketName: { $first: "$marketData.name" },
            }),
            ...(groupBy === "district" && {
                district: { $first: "$marketData.district" },
            }),
        },
    });

    // Project final results
    pipeline.push({
        $project: {
            _id: 0,
            [groupBy === "market" ? "marketId" : "district"]: "$_id",
            ...(groupBy === "market" && { marketName: 1 }),
            targetValue: 1,
            actualSales: 1,
            actualQty: 1,
            achievementPercentage: 1,
            count: 1,
        },
    });

    // Sort by year and month
    pipeline.push({
        $sort: {
            actualQty: -1,
            actualSales: -1,
        },
    });
    return Target.aggregate(pipeline);
}

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
        const districtParam = searchParams.get("district");

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

        const allYears = await Target.distinct("year");
        const years = allYears.sort((a, b) => b - a);

        if (type === "year-month-market") {
            const results = await getTargetAchievementYearMonthMarket({
                startYear,
                endYear,
                month,
                marketIds,
                productIds,
                district: districtParam || undefined,
                groupBy,
            });

            return Response.json(
                {
                    results,
                    success: true,
                    type: "year > month > market",
                    years,
                },
                { status: 200 }
            );
        }

        if (type === "year-market-month") {
            const results = await getTargetAchievementByYearMarketMonth({
                year,
                marketIds,
                month,
                productIds,
                district: districtParam || undefined,
            });

            return Response.json(
                {
                    results,
                    success: true,
                    years,
                    type: "year > market > month",
                },
                { status: 200 }
            );
        }

        const results = await getTargetAchievementCombined({
            month,
            year,
            groupBy,
            marketIds,
            productIds,
            district: districtParam || undefined,
        });

        return Response.json(
            { results, success: true, type: "Combined", years },
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
