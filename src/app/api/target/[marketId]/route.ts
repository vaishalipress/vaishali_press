import CONNECT_TO_DB from "@/lib/connectToDb";
import Target from "@/models/target";
import { isAuth } from "@/lib/isAuth";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

CONNECT_TO_DB();

export const GET = async (
    req: NextRequest,
    { params }: { params: { marketId: string } }
) => {
    try {
        // 🔐 Authentication
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { marketId } = params;

        // 🧾 Validate marketId
        if (!Types.ObjectId.isValid(marketId)) {
            return Response.json({ message: "Invalid market ID" }, { status: 400 });
        }

        // 🌐 Extract filters from query params
        const searchParams = req.nextUrl.searchParams;
        const monthParam = searchParams.get("month");
        const yearParam = searchParams.get("year");

        // 🧠 Build filter object
        const filter: Record<string, any> = { market: marketId };

        if (monthParam) {
            const month = parseInt(monthParam);
            if (month >= 1 && month <= 12) {
                filter.month = month;
            } else {
                return Response.json({ message: "Invalid month" }, { status: 400 });
            }
        }

        if (yearParam) {
            const year = parseInt(yearParam);
            if (year >= 2000 && year <= 2100) {
                filter.year = year;
            } else {
                return Response.json({ message: "Invalid year" }, { status: 400 });
            }
        }

        // 📦 Fetch filtered targets
        const targets = await Target.find(filter)
            .sort({ year: -1, month: -1 })
            .lean();

        return Response.json({ targets, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error fetching targets:", error);
        return Response.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
};
