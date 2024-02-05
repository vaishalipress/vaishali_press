import CONNECT_TO_DB from "@/lib/connectToDb";
import { DISTRICTS, districtsAndBlocks } from "@/lib/contants";
import { isAuth } from "@/lib/isAuth";
import { marketSchema } from "@/lib/schema";
import Market from "@/models/market";
import { z } from "zod";

CONNECT_TO_DB();

export const POST = async (request: Request) => {
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
        const data: z.infer<typeof marketSchema> = await request.json();
        const { success } = marketSchema.safeParse(data);

        if (!success) {
            return Response.json(
                {
                    message: "All fields are required.",
                    success: false,
                },
                { status: 401 }
            );
        }

        if (!DISTRICTS.includes(data.district.toLowerCase())) {
            return Response.json(
                {
                    message: "Invalid district",
                    success: false,
                },
                { status: 401 }
            );
        }

        const isExist = await Market.findOne({
            name: data.name.toLowerCase(),
        });

        if (isExist) {
            return Response.json(
                { message: "Market already exists", success: false },
                { status: 401 }
            );
        }

        const market = await Market.create({
            name: data.name.toLowerCase(),
            district: data.district.toLowerCase(),
        });

        if (!market) {
            return Response.json(
                {
                    message: "Something went wrong while creating market",
                    success: false,
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                market,
                message: "Market created",
                success: true,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log("MARKET CREATE ERROR", error);
        return Response.json("Internal Error", { status: 500 });
    }
};

export const GET = async (request: Request) => {
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
        const { searchParams } = new URL(request.url);
        const district = searchParams.get("district");

        if (!district) {
            return Response.json(
                {
                    message: "district and block are required.",
                    success: false,
                },
                {
                    status: 400,
                }
            );
        }

        const markets = await Market.find({ district });

        if (!markets) {
            return Response.json(
                {
                    message: "something went wrong or markets doesn't exist",
                    success: false,
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                markets,
                message: "markest fetched",
                success: true,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("MARKET GET ERROR", error);
        return Response.json("Internal Error", { status: 500 });
    }
};

export const DELETE = async (request: Request) => {
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
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return Response.json(
                {
                    message: "id id required.",
                    success: false,
                },
                {
                    status: 400,
                }
            );
        }

        const market = await Market.findByIdAndDelete(id);
        return Response.json(
            {
                market,
                message: "Market deleted",
                success: true,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log("MARKET DELETE ERROR", error);
        return Response.json("Internal Error", { status: 500 });
    }
};
