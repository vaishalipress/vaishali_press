import { authOptions } from "@/lib/auth-options";
import { changePasswordSchema } from "@/lib/schema";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
    try {
        /**
         * CHECK SESSION EXIST OR NOT
         */

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                message: "Unauthenticated",
                success: false,
            });
        }

        /**
         * GET DATA AND VALIDATE
         */
        const data: z.infer<typeof changePasswordSchema> = await req.json();

        const { success } = changePasswordSchema.safeParse(data);
        if (!success) {
            return NextResponse.json({
                message: "invalid fields",
                success: false,
            });
        }

        /**
         * VALIDATE CHECK CURRENT PASSWORD
         */

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({
                message: "Incorrect Password.",
                success: false,
            });
        }

        /**
         * UPDATE PASSWORD
         */
        const hashPassword = await bcrypt.hash(data.password, 8);
        const changedPassword = await User.updateOne(
            { email: session.user.email },
            {
                password: hashPassword,
            }
        );

        if (!changedPassword) {
            return NextResponse.json({
                message: "Something went wrong.",
                success: false,
            });
        }

        return NextResponse.json({
            message: "Password updated.",
            success: true,
        });
    } catch (error) {
        console.log("[Password]", error);
        return NextResponse.json({ message: "Internal error", success: false });
    }
};
