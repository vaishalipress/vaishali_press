import { DistinctValues } from "@/lib/types";
import Target from "@/models/target";
import mongoose, { PipelineStage } from "mongoose";

// groupType: (year > market > month)";
export async function getTargetAchievementByYearMarketMonth(query: {
    year?: number;
    month?: number;
    marketIds?: mongoose.Types.ObjectId[];
    productIds?: mongoose.Types.ObjectId[];
    groupBy?: "market" | "district";
    districts?: string[];
}) {
    const { year, month, marketIds, productIds, districts, groupBy } = query;
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
    if (districts) {
        pipeline.push({
            $match: { "marketData.district": { $in: districts } },
        });
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

    // First group by market/district and month
    pipeline.push({
        $group: {
            _id: {
                groupField:
                    groupBy === "market" ? "$market" : "$marketData.district",
                month: "$month",
                ...(groupBy === "market" && { marketName: "$marketData.name" }),
                ...(groupBy === "district" && {
                    district: "$marketData.district",
                }),
            },
            targetQty: { $sum: "$targetQty" },
            targetSale: { $sum: "$targetSale" },
            actualSales: { $sum: { $ifNull: ["$salesData.totalSales", 0] } },
            actualQty: { $sum: { $ifNull: ["$salesData.totalQty", 0] } },
        },
    });

    // Calculate achievement percentage
    pipeline.push({
        $addFields: {
            salesAchievementPercentage: {
                $cond: [
                    { $eq: ["$targetSale", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$actualSales", "$targetSale"] },
                            100,
                        ],
                    },
                ],
            },
            qtyAchievementPercentage: {
                $cond: [
                    { $eq: ["$targetQty", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$actualQty", "$targetQty"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Then group by market/district
    pipeline.push({
        $group: {
            _id: {
                groupField: "$_id.groupField",
                ...(groupBy === "market" && { marketName: "$_id.marketName" }),
                ...(groupBy === "district" && { district: "$_id.district" }),
            },
            months: {
                $push: {
                    month: "$_id.month",
                    targetQty: "$targetQty",
                    targetSale: "$targetSale",
                    actualSales: "$actualSales",
                    actualQty: "$actualQty",
                    salesAchievementPercentage: "$salesAchievementPercentage",
                    qtyAchievementPercentage: "$qtyAchievementPercentage",
                },
            },
            yearlyTargetQty: { $sum: "$targetQty" },
            yearlyTargetSale: { $sum: "$targetSale" },
            yearlySales: { $sum: "$actualSales" },
            yearlyQty: { $sum: "$actualQty" },
        },
    });

    // Calculate yearly achievement
    pipeline.push({
        $addFields: {
            yearlySalesAchievement: {
                $cond: [
                    { $eq: ["$yearlyTargetSale", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$yearlySales", "$yearlyTargetSale"] },
                            100,
                        ],
                    },
                ],
            },
            yearlyQtyAchievement: {
                $cond: [
                    { $eq: ["$yearlyTargetQty", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$yearlyQty", "$yearlyTargetQty"] },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Final group for structured output
    pipeline.push({
        $group: {
            _id: null,
            markets: {
                $push: {
                    ...(groupBy === "market"
                        ? {
                              marketId: "$_id.groupField",
                              marketName: "$_id.marketName",
                          }
                        : {
                              district: "$_id.district",
                          }),
                    months: "$months",
                    yearlyTargetQty: "$yearlyTargetQty",
                    yearlyTargetSale: "$yearlyTargetSale",
                    yearlySales: "$yearlySales",
                    yearlyQty: "$yearlyQty",
                    yearlySalesAchievement: "$yearlySalesAchievement",
                    yearlyQtyAchievement: "$yearlyQtyAchievement",
                },
            },
            overallYearlyTargetQty: { $sum: "$yearlyTargetQty" },
            overallYearlyTargetSale: { $sum: "$yearlyTargetSale" },
            overallYearlySales: { $sum: "$yearlySales" },
            overallYearlyQty: { $sum: "$yearlyQty" },
        },
    });

    // Calculate overall yearly achievement
    pipeline.push({
        $addFields: {
            overallYearlySalesAchievement: {
                $cond: [
                    { $eq: ["$overallYearlyTargetSale", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$overallYearlySales",
                                    "$overallYearlyTargetSale",
                                ],
                            },
                            100,
                        ],
                    },
                ],
            },
            overallYearlyQtyAchievement: {
                $cond: [
                    { $eq: ["$overallYearlyTargetQty", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$overallYearlyQty",
                                    "$overallYearlyTargetQty",
                                ],
                            },
                            100,
                        ],
                    },
                ],
            },
        },
    });

    // Sort markets array by yearlyQty and yearlySales (descending)
    pipeline.push({
        $addFields: {
            markets: {
                $sortArray: {
                    input: "$markets",
                    sortBy: {
                        yearlyQty: -1, // Sort by yearlyQty in descending order
                        yearlySales: -1, // Then by yearlySales in descending order
                    },
                },
            },
        },
    });

    // Project final results
    pipeline.push({
        $project: {
            _id: 0,
            markets: 1,
            overallYearlyTargetQty: 1,
            overallYearlyTargetSale: 1,
            overallYearlySales: 1,
            overallYearlyQty: 1,
            overallYearlySalesAchievement: 1,
            overallYearlyQtyAchievement: 1,
        },
    });

    pipeline.push({
        $sort: {
            overallYearlyQty: 1,
            overallYearlySales: 1,
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
    districts?: string[];
}) {
    const {
        startYear,
        endYear,
        month,
        groupBy = "market",
        marketIds,
        productIds,
        districts,
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
    if (districts) {
        pipeline.push({
            $match: { "marketData.district": { $in: districts } },
        });
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
            targetQty: { $sum: "$targetQty" },
            targetSale: { $sum: "$targetSale" },
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
            salesAchievementPercentage: {
                $cond: [
                    { $eq: ["$targetSale", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$actualSales", "$targetSale"] },
                            100,
                        ],
                    },
                ],
            },
            qtyAchievementPercentage: {
                $cond: [
                    { $eq: ["$targetQty", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$actualQty", "$targetQty"] },
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
            monthlyTargetQty: { $sum: "$targetQty" },
            monthlyTargetSale: { $sum: "$targetSale" },
            monthlySales: { $sum: "$actualSales" },
            monthlyQty: { $sum: "$actualQty" },
            groups: {
                $push: {
                    [groupBy === "market" ? "marketId" : "district"]:
                        "$_id.groupField",
                    ...(groupBy === "market" && { marketName: "$marketName" }),
                    targetQty: "$targetQty",
                    targetSale: "$targetSale",
                    actualSales: "$actualSales",
                    actualQty: "$actualQty",
                    salesAchievementPercentage: "$salesAchievementPercentage",
                    qtyAchievementPercentage: "$qtyAchievementPercentage",
                },
            },
        },
    });

    // Calculate monthly achievement
    pipeline.push({
        $addFields: {
            monthlySalesAchievement: {
                $cond: [
                    { $eq: ["$monthlyTargetSale", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$monthlySales",
                                    "$monthlyTargetSale",
                                ],
                            },
                            100,
                        ],
                    },
                ],
            },
            monthlyQtyAchievement: {
                $cond: [
                    { $eq: ["$monthlyTargetQty", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$monthlyQty", "$monthlyTargetQty"] },
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
                    monthlyTargetQty: "$monthlyTargetQty",
                    monthlyTargetSale: "$monthlyTargetSale",
                    monthlySales: "$monthlySales",
                    monthlyQty: "$monthlyQty",
                    monthlySalesAchievement: "$monthlySalesAchievement",
                    monthlyQtyAchievement: "$monthlyQtyAchievement",
                    groups: "$groups",
                },
            },
            yearlyTargetQty: { $sum: "$monthlyTargetQty" },
            monthlyTargetSale: { $sum: "$monthlyTargetSale" },
            yearlySales: { $sum: "$monthlySales" },
            yearlyQty: { $sum: "$monthlyQty" },
        },
    });

    // Calculate yearly achievement
    pipeline.push({
        $addFields: {
            yearlySalesAchievement: {
                $cond: [
                    { $eq: ["$monthlyTargetSale", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$yearlySales", "$monthlyTargetSale"] },
                            100,
                        ],
                    },
                ],
            },
            yearlyQtyAchievement: {
                $cond: [
                    { $eq: ["$yearlyTargetQty", 0] },
                    0,
                    {
                        $multiply: [
                            { $divide: ["$yearlyQty", "$yearlyTargetQty"] },
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
                        monthlyTargetQty: "$$monthData.monthlyTargetQty",
                        monthlyTargetSale: "$$monthData.monthlyTargetSale",
                        monthlySales: "$$monthData.monthlySales",
                        monthlyQty: "$$monthData.monthlyQty",
                        monthlySalesAchievement:
                            "$$monthData.monthlySalesAchievement",
                        monthlyQtyAchievement:
                            "$$monthData.monthlyQtyAchievement",
                        groups: "$$monthData.groups",
                    },
                },
            },
            yearlyTargetQty: 1,
            yearlyTargetSale: 1,
            yearlySales: 1,
            yearlyQty: 1,
            yearlySalesAchievement: 1,
            yearlyQtyAchievement: 1,
        },
    });

    // First, sort the groups within each month by quantity and sales (descending)
    pipeline.push({
        $addFields: {
            months: {
                $map: {
                    input: "$months",
                    as: "monthData",
                    in: {
                        $mergeObjects: [
                            "$$monthData",
                            {
                                groups: {
                                    $sortArray: {
                                        input: "$$monthData.groups",
                                        sortBy: {
                                            actualQty: -1, // Highest quantity first
                                            actualSales: -1, // Then highest sales first
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        },
    });

    // Then sort the months array within each year document
    pipeline.push({
        $addFields: {
            months: {
                $sortArray: {
                    input: "$months",
                    sortBy: {
                        month: 1, // Sort months in chronological order (0=Jan to 11=Dec)
                    },
                },
            },
        },
    });

    // Finally, sort the years in ascending order
    pipeline.push({
        $sort: {
            year: -1, // Sort years in ascending order
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
    districts?: string[];
}) {
    const {
        month,
        year,
        groupBy = "market",
        marketIds,
        productIds,
        districts,
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
    if (districts) {
        pipeline.push({
            $match: { "marketData.district": { $in: districts } },
        });
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
            salesAchievementPercentage: {
                $cond: [
                    { $eq: ["$targetSale", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$salesData.totalSales",
                                    "$targetSale",
                                ],
                            },
                            100,
                        ],
                    },
                ],
            },
            qtyAchievementPercentage: {
                $cond: [
                    { $eq: ["$targetQty", 0] },
                    0,
                    {
                        $multiply: [
                            {
                                $divide: ["$salesData.totalQty", "$targetQty"],
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
            targetQty: { $sum: "$targetQty" },
            targetSale: { $sum: "$targetSale" },
            actualSales: { $sum: "$actualSales" },
            actualQty: { $sum: "$actualQty" },
            salesAchievementPercentage: { $avg: "$salesAchievementPercentage" },
            qtyAchievementPercentage: { $avg: "$qtyAchievementPercentage" },
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
            targetQty: 1,
            targetSale: 1,
            actualSales: 1,
            actualQty: 1,
            salesAchievementPercentage: 1,
            qtyAchievementPercentage: 1,
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

export const getDistinctFilterValues = async (): Promise<DistinctValues> => {
    try {
        const result = await Target.aggregate([
            // Lookup market details
            {
                $lookup: {
                    from: "markets",
                    localField: "market",
                    foreignField: "_id",
                    as: "market",
                },
            },
            { $unwind: "$market" },
            // Group to collect unique years, markets, and districts
            {
                $group: {
                    _id: null,
                    years: { $addToSet: "$year" },
                    markets: {
                        $addToSet: {
                            id: "$market._id",
                            name: "$market.name",
                            district: "$market.district",
                        },
                    },
                    districts: { $addToSet: "$market.district" },
                },
            },
            // Sort years and districts in final projection
            {
                $project: {
                    _id: 0,
                    years: { $sortArray: { input: "$years", sortBy: 1 } },
                    markets: 1,
                    districts: {
                        $sortArray: { input: "$districts", sortBy: 1 },
                    },
                },
            },
        ]);

        if (!result.length) {
            return { years: [], markets: [], districts: [] };
        }

        const { years, markets, districts } = result[0];

        return {
            years,
            markets,
            districts,
        };
    } catch (error) {
        console.error("Failed to fetch distinct filter values:", error);
        throw new Error("Could not load filter options");
    }
};
