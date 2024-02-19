import { authOptions } from "@/lib/auth-options";
import CONNECT_TO_DB from "@/lib/connectToDb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

CONNECT_TO_DB();

export const POST = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return Response.json({
                message: "Unauthenticated",
                success: false,
            });
        }
        const { email, password } = await req.json();
        if (!email || !password) {
            return Response.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        const isUserExist = await User.findOne({
            email,
        });

        if (isUserExist) {
            return Response.json(
                { message: "User already exist." },
                { status: 400 }
            );
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ email, password: hashPassword });
        if (!user) {
            return Response.json(
                { message: "something went wrong." },
                { status: 500 }
            );
        }

        return Response.json(
            { user, message: "user created.", success: true },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return Response.json("Internal error.", { status: 500 });
    }
};

export const GET = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return Response.json({
                message: "Unauthenticated",
                success: false,
            });
        }
        const users = await User.find();

        return Response.json(users, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json("Internal error.", { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return Response.json({
                message: "Unauthenticated",
                success: false,
            });
        }
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return Response.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return Response.json({ message: "invalid id" }, { status: 400 });
        }
        return Response.json(
            { user, message: "User deleted.", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(error.name, { status: error.name ? 400 : 500 });
    }
};
