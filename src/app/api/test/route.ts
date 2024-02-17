import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import Sale from "@/models/sale";

export const dynamic = "force-dynamic";

CONNECT_TO_DB();

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

        const sales = await Sale.aggregate([
            {
                $match: {
                    date: from
                        ? {
                              $lte: to,
                              $gte: from,
                          }
                        : {
                              $lte: to,
                          },
                },
            },
            {
                $lookup: {
                    from: "clients",
                    foreignField: "_id",
                    localField: "client",
                    as: "client",
                },
            },
            {
                $group: {
                    _id: {
                        product: "$name",
                        district: "$client.district",
                        market: "$client.market",
                    },

                    totalSales: {
                        $sum: "$qty",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    district: "$_id.district",
                    market: "$_id.market",
                    totalSales: 1,
                },
            },
        ]);
        return Response.json(sales);
    } catch (error) {
        console.log("Dashboard", error);
        return Response.json(error, { status: 500 });
    }
};
