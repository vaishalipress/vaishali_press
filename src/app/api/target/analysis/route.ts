import { isAuth } from "@/lib/isAuth";
import Market from "@/models/market";
import mongoose, { PipelineStage } from "mongoose";

export const dynamic = "force-dynamic";

async function getDistrictMarketTargetsWithSales(
    filterOptions: { month?: number; year?: number; district?: string } = {},
    productIds: mongoose.Types.ObjectId[] = []
) {
    const { month, year, district } = filterOptions;

    // 1. Create date range (UTC to avoid timezone issues)
    let dateFilter = {};
    if (month !== undefined && year !== undefined) {
        // First day of month at 00:00:00
        const startDate = new Date(year, month, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

        dateFilter = { date: { $gte: startDate, $lte: endDate } };
    }

    const pipeline: PipelineStage[] = [
        // 1. First filter markets by district (partial word match)
        {
            $match: district
                ? { district: { $regex: district, $options: "i" } }
                : {},
        },

        // 2. Link clients by market name AND district
        {
            $lookup: {
                from: "clients",
                let: {
                    marketName: "$name",
                    marketDistrict: "$district", // Capture market's district
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$market", "$$marketName"] },
                                    { $eq: ["$district", "$$marketDistrict"] }, // Match district too
                                ],
                            },
                        },
                    },
                ],
                as: "marketClients",
            },
        },

        // 3. Get sales with ALL filters (date + products)
        {
            $lookup: {
                from: "sales",
                let: { clientIds: "$marketClients._id" },
                pipeline: [
                    // Base client match
                    { $match: { $expr: { $in: ["$client", "$$clientIds"] } } },

                    // Date filter (if month/year provided)
                    ...(Object.keys(dateFilter).length > 0
                        ? [{ $match: dateFilter }]
                        : []),

                    // Product filter (if productIds provided)
                    ...(productIds.length > 0
                        ? [{ $match: { product: { $in: productIds } } }]
                        : []),

                    // Group quantities
                    { $group: { _id: null, totalQty: { $sum: "$qty" } } },
                ],
                as: "marketSales",
            },
        },

        // Rest of the pipeline remains the same...
        {
            $addFields: {
                totalQty: {
                    $ifNull: [
                        { $arrayElemAt: ["$marketSales.totalQty", 0] },
                        0,
                    ],
                },
            },
        },
        {
            $group: {
                _id: "$district",
                totalTarget: { $sum: "$target" },
                totalQty: { $sum: "$totalQty" },
                markets: {
                    $push: {
                        name: "$name",
                        target: "$target",
                        qty: "$totalQty",
                    },
                },
            },
        },
        {
            $addFields: {
                markets: {
                    $sortArray: {
                        input: "$markets",
                        sortBy: { qty: -1 },
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                district: "$_id",
                totalTarget: 1,
                totalQty: 1,
                markets: 1,
            },
        },
        { $sort: { totalQty: -1 } },
    ];

    return await Market.aggregate(pipeline).exec();
}

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const yearParam = searchParams.get("year");
        const monthParam = searchParams.get("month");
        const productIdsParam = searchParams.get("productIds"); // Comma-separated product IDs
        const districtParam = searchParams.get("district");
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

        let month: number | undefined = undefined;
        if (monthParam) {
            month = parseInt(monthParam);
            if (isNaN(month) || month < 0 || month > 11) {
                return Response.json(
                    { message: "Invalid month parameter (must be 0-11)" },
                    { status: 400 }
                );
            }
        }

        // Validate and parse query parameters
        let year: number | undefined = undefined;
        if (yearParam) {
            year = parseInt(yearParam);
            if (isNaN(year) || year < 2020 || year > 2100) {
                return Response.json(
                    { message: "Invalid year parameter" },
                    { status: 400 }
                );
            }
        }

        const filteredData = await getDistrictMarketTargetsWithSales(
            {
                month,
                year,
                district: districtParam || undefined,
            },
            productIds
        );

        return Response.json(
            {
                results: filteredData,
                success: true,
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
