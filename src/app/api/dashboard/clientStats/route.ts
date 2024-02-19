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
            {
                $addFields: {
                    amount: {
                        $multiply: ["$rate", "$qty"],
                    },
                },
            },
            {
                $group: {
                    // grouping by client and product
                    _id: {
                        client: "$client",
                        product: "$name",
                    },

                    qty: {
                        $sum: "$qty",
                    },
                    amount: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $group: {
                    // grounp by client
                    _id: "$_id.client",
                    totalQty: {
                        $sum: "$qty",
                    },
                    totalAmount: {
                        $sum: "$amount",
                    },
                    sales: {
                        // set of product and total qty bought
                        $push: {
                            product: "$_id.product",
                            qty: "$qty",
                            amount: "$amount",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    client: {
                        $first: "$_id",
                    },
                    sales: {
                        // sorting sales
                        $sortArray: {
                            input: "$sales",
                            sortBy: {
                                qty: -1,
                            },
                        },
                    },
                    totalQty: 1,
                    totalAmount: 1,
                },
            },
        ]).sort({
            totalAmount: -1,
            "client.name": 1,
        });

        return Response.json(sales);
    } catch (error) {
        console.log("Error in Client stats", error);
        return Response.json(error, { status: 500 });
    }
};
