import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import Sale from "@/models/sale";
import mongoose, { PipelineStage } from "mongoose";

export const dynamic = "force-dynamic";

CONNECT_TO_DB();

const getDistrictMonthlySalesReport = async (
    district: string,
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
        // Stage 1: Lookup client information to get district
        {
            $lookup: {
                from: "clients",
                localField: "client",
                foreignField: "_id",
                as: "clientInfo",
            },
        },

        // Stage 2: Unwind client info (assuming each sale has one client)
        {
            $unwind: "$clientInfo",
        },

        // Stage 3: Filter sales by district, date range and optional product filter
        {
            $match: {
                "clientInfo.district": district,
                date: dateMatch,
                ...(productIds?.length && { product: { $in: productIds } }),
            },
        },

        // Stage 4: Add year and month fields
        {
            $addFields: {
                year: { $year: "$date" },
                month: { $month: "$date" },
            },
        },

        // Stage 5: Group by year and month, sum quantities
        {
            $group: {
                _id: {
                    year: "$year",
                    month: "$month",
                },
                totalQty: { $sum: "$qty" },
            },
        },

        // Stage 6: Project and format results
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalQty: 1,
            },
        },

        // Stage 7: Sort by year and month
        {
            $sort: {
                year: 1,
                month: 1,
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

        // Get district - required parameter
        const district = searchParams.get("district");
        if (!district) {
            return Response.json(
                { message: "district is required" },
                { status: 400 }
            );
        }

        // Get date range
        let from: Date | undefined = !!searchParams.get("from")
            ? new Date(searchParams.get("from")!)
            : undefined;
        let to: Date = !!searchParams.get("to")
            ? new Date(searchParams.get("to")!)
            : new Date();

        // Get product IDs filter
        const productIdsParam = searchParams.get("productIds");
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

        const monthlySales = await getDistrictMonthlySalesReport(
            district,
            from,
            to,
            productIds
        );

        return Response.json(monthlySales);
    } catch (error) {
        console.log("Error in District monthly sales", error);
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
