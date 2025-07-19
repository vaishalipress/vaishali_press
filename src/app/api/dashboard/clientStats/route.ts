import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import Sale from "@/models/sale";
import mongoose, { PipelineStage } from "mongoose";

export const dynamic = "force-dynamic";

CONNECT_TO_DB();

const getClientSalesReport = async (
    from: Date | undefined = undefined,
    to: Date,
    productIds?: mongoose.Types.ObjectId[]
) => {
    // Base match stage for date filtering
    const dateMatch: Record<string, any> = { $lte: to };
    if (from) {
        dateMatch.$gte = from;
    }

    const pipeline: PipelineStage[] = [
        // Stage 1: Filter sales by date range and optional product filter
        {
            $match: {
                date: dateMatch,
                ...(productIds?.length && { product: { $in: productIds } }),
            },
        },

        // Stage 2: Join with clients collection
        {
            $lookup: {
                from: "clients",
                foreignField: "_id",
                localField: "client",
                as: "client",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            district: 1,
                            market: 1,
                            mobile: 1,
                        },
                    },
                ],
            },
        },

        // Stage 3: Unwind the client array (since lookup returns an array)
        {
            $unwind: "$client",
        },

        // Stage 4: Calculate sale amount
        {
            $addFields: {
                amount: { $multiply: ["$rate", "$qty"] },
            },
        },

        // Stage 5: First grouping by client and product
        {
            $group: {
                _id: {
                    client: "$client",
                    product: "$name",
                },
                qty: { $sum: "$qty" },
                amount: { $sum: "$amount" },
            },
        },

        // Stage 6: Second grouping by client only
        {
            $group: {
                _id: "$_id.client",
                totalQty: { $sum: "$qty" },
                totalAmount: { $sum: "$amount" },
                sales: {
                    $push: {
                        product: "$_id.product",
                        qty: "$qty",
                        amount: "$amount",
                    },
                },
            },
        },

        // Stage 7: Project and format results
        {
            $project: {
                _id: 0,
                client: "$_id",
                sales: {
                    $sortArray: {
                        input: "$sales",
                        sortBy: { qty: -1 },
                    },
                },
                totalQty: 1,
                totalAmount: 1,
            },
        },

        // Stage 8: Final sorting
        {
            $sort: {
                totalAmount: -1,
                "client.name": 1,
            },
        },
    ];

    return await Sale.aggregate(pipeline).exec();
};

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const { searchParams } = new URL(req.url);

        let from: Date | undefined = !!searchParams.get("from")
            ? new Date(searchParams.get("from")!)
            : undefined;
        let to: Date | undefined = !!searchParams.get("to")
            ? new Date(searchParams?.get("to")!)
            : new Date();
        const productIdsParam = searchParams.get("productIds"); // Comma-separated product IDs
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

        const clients = await getClientSalesReport(from, to, productIds);
        return Response.json(clients);
    } catch (error) {
        console.log("Error in Client stats", error);
        return Response.json(error, { status: 500 });
    }
};
