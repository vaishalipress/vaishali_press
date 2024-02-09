import { UserI } from "@/models/user";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name: string;
            email: string;
            id: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT extends UserI {}
}
