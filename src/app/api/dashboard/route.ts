import CONNECT_TO_DB from "@/lib/connectToDb";

CONNECT_TO_DB();
export const GET = async (req: Request) => {
    try {
        // const sales = await Prisma?.sale.findMany({
        //     where: {
        //         createdAt: {
        //             lte: new Date("2024-01-19"),
        //         },
        //     },
        // });

        const sales = {};
        console.log(sales);
        return Response.json(sales);
    } catch (error) {
        return Response.json(error, { status: 500 });
    }
};
