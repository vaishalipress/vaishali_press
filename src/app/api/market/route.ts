import CONNECT_TO_DB from "@/lib/connectToDb";
import { districtsAndBlocks } from "@/lib/contants";
import { marketSchema } from "@/lib/schema";
import Market from "@/models/market";
import { z } from "zod";

CONNECT_TO_DB();

const isDistrictAndBlockValid = (district: string, block: string) => {
    block = block.charAt(0).toUpperCase() + block.substring(1);

    let isValid = false;
    for (let i = 0; i < districtsAndBlocks.length; i++) {
        if (isValid) break;
        if (i === districtsAndBlocks.length - 1) break;
        if (districtsAndBlocks[i].name.toLowerCase() === district) {
            if (districtsAndBlocks[i].block.includes(block)) {
                isValid = true;
            }
        }
    }
    return isValid;
};
export const POST = async (request: Request) => {
    try {
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

        const isValidDistrictAndBlock = isDistrictAndBlockValid(
            data.district,
            data.block
        );
        if (!isValidDistrictAndBlock) {
            return Response.json(
                {
                    message: "Invalid district or block",
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
            ...data,
            name: data.name.toLowerCase(),
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
        const { searchParams } = new URL(request.url);
        const district = searchParams.get("district");
        const block = searchParams.get("block");

        if (!district || !block) {
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

        const markets = await Market.find({ district, block });

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
