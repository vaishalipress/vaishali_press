import { isAuth } from "@/lib/isAuth";
import Market from "@/models/market";
import mongoose, { PipelineStage } from "mongoose";

export const dynamic = "force-dynamic";

async function getDistrictMarketTargetsWithSales(
    filterOptions: {
        from?: Date;
        to?: Date;
        district?: string;
    } = {},
    productIds: mongoose.Types.ObjectId[] = []
) {
    const { district, from, to } = filterOptions;

    let dateFilter = {};
    if (from !== undefined && to !== undefined) {
        // Create dates directly in UTC

        dateFilter = {
            date: {
                $lte: to,
                $gte: from,
            },
        };
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

        const productIdsParam = searchParams.get("productIds"); // Comma-separated product IDs
        const districtParam = searchParams.get("district");
        let from: Date | undefined = !!searchParams.get("from")
            ? new Date(searchParams.get("from")!)
            : undefined;
        let to: Date | undefined = !!searchParams.get("to")
            ? new Date(searchParams?.get("to")!)
            : new Date();
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

        const filteredData = await getDistrictMarketTargetsWithSales(
            {
                to,
                from,
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
