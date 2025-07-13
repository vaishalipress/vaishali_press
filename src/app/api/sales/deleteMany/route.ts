/**
 * DELETE MANY SALE
 */

import { isAuth } from "@/lib/isAuth";
import Sale from "@/models/sale";
import mongoose from "mongoose";

export const
    POST = async (req: Request) => {
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
            const data = await req.json()

            if (!data?.sales) {
                return Response.json(
                    { message: "sales id required.", success: false },
                    { status: 400 }
                );
            }

            const sales = await Sale.deleteMany({
                _id: { $in: data?.sales.map((id: string) => new mongoose.Types.ObjectId(id)) },
            });

            if (!sales) {
                return Response.json(
                    { message: "invalid id", success: false },
                    { status: 400 }
                );
            }
            return Response.json(
                { sales, message: "sales deleted.", success: true },
                { status: 200 }
            );
        } catch (error: any) {
            return Response.json(error.name, { status: error.name ? 400 : 500 });
        }
    };
