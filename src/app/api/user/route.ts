import CONNECT_TO_DB from "@/lib/connectToDb";
import User from "@/models/user";
import bcrypt from "bcrypt";

CONNECT_TO_DB();

export const POST = async (req: Request) => {
    try {
        const { userId, password } = await req.json();
        if (!userId || !password) {
            return Response.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        const isUserExist = await User.findOne({
            userId,
        });

        if (isUserExist) {
            return Response.json(
                { message: "UserId already exist." },
                { status: 400 }
            );
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ userId, password: hashPassword });
        if (!user) {
            return Response.json(
                { message: "something went wrong." },
                { status: 500 }
            );
        }

        return Response.json(
            { user, message: "user created." },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return Response.json("Internal error.", { status: 500 });
    }
};
