import { isAuth } from "@/lib/isAuth";
import Market, { MarketI } from "@/models/market";
import mongoose, { PipelineStage } from "mongoose";
import { FilterQuery } from "mongoose";

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

    // --- Build Date Filter ---
    let dateFilter = {};
    if (from && to) {
        dateFilter = { date: { $gte: from, $lte: to } };
    } else if (to) {
        dateFilter = { date: { $lte: to } };
    }

    // --- Build Initial Match Query ---
    // This is the main change: we create a query object.
    const initialMatch: FilterQuery<MarketI> = {
        // We now require the target to be greater than 0.
        target: { $gt: 0 },
    };

    // If a district is provided, add it to the query.
    if (district) {
        initialMatch.district = { $regex: district, $options: "i" };
    }

    const pipeline: PipelineStage[] = [
        // 1. First, filter markets.
        // This stage now filters for target > 0 AND optionally by district.
        {
            $match: initialMatch,
        },

        // 2. Link clients by market name AND district
        {
            $lookup: {
                from: "clients",
                let: {
                    marketName: "$name",
                    marketDistrict: "$district",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$market", "$$marketName"] },
                                    { $eq: ["$district", "$$marketDistrict"] },
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
                    { $match: { $expr: { $in: ["$client", "$$clientIds"] } } },
                    ...(Object.keys(dateFilter).length > 0
                        ? [{ $match: dateFilter }]
                        : []),
                    ...(productIds.length > 0
                        ? [{ $match: { product: { $in: productIds } } }]
                        : []),

                    // 👇 Group sales by client (to compute client total)
                    {
                        $group: {
                            _id: "$client",
                            totalQty: { $sum: "$qty" },
                        },
                    },

                    // 👇 Join back with client info (name, district, etc.)
                    {
                        $lookup: {
                            from: "clients",
                            localField: "_id",
                            foreignField: "_id",
                            as: "clientInfo",
                        },
                    },
                    { $unwind: "$clientInfo" },

                    // 👇 Shape client data
                    {
                        $project: {
                            _id: 0,
                            clientId: "$clientInfo._id",
                            clientName: "$clientInfo.name",
                            qty: "$totalQty",
                        },
                    },
                ],
                as: "marketSales",
            },
        },

        // 4. Add totalQty field for easier access
        {
            $addFields: {
                totalQty: {
                    $ifNull: [
                        {
                            $sum: "$marketSales.qty", // 👈 total from all clients
                        },
                        0,
                    ],
                },
            },
        },

        // 5. Group by district to aggregate totals
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
                        clients: "$marketSales", // 👈 include clients here
                    },
                },
            },
        },

        // 6. Sort markets within each district by quantity
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

        // 7. Project final fields
        {
            $project: {
                _id: 0,
                district: "$_id",
                totalTarget: 1,
                totalQty: 1,
                markets: 1,
            },
        },

        // 8. Sort final districts by quantity
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

        // Parse parameters with consistent timezone handling
        const productIdsParam = searchParams.get("productIds");
        const districtParam = searchParams.get("district");

        let from: Date | undefined;
        let to: Date;

        const fromParam = searchParams.get("from");
        const toParam = searchParams.get("to");

        if (fromParam) {
            from = new Date(fromParam);
            // Ensure we start from the beginning of the day in UTC
            from.setUTCHours(0, 0, 0, 0);
        }

        if (toParam) {
            to = new Date(toParam);
            // Ensure we end at the end of the day in UTC
            to.setUTCHours(23, 59, 59, 999);
        } else {
            to = new Date();
            to.setUTCHours(23, 59, 59, 999);
        }

        // Parse and validate product IDs
        let productIds: mongoose.Types.ObjectId[] = [];
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
                from,
                to,
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
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
};
