import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt";
import CONNECT_TO_DB from "./connectToDb";

CONNECT_TO_DB();
export const authOptions: AuthOptions = {
    pages: {
        signIn: "/login",
        error: "/login",
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        Credentials({
            credentials: {
                email: {
                    type: "text",
                },
                password: {
                    type: "text",
                },
            },
            async authorize(credentials, request) {
                try {
                    if (!credentials?.password || !credentials?.email) {
                        throw new Error("Invalid Credentials");
                    }

                    const user = await User.findOne({
                        email: credentials?.email,
                    });

                    /**
                     * compare password
                     */

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!user || !isPasswordCorrect) {
                        throw new Error("Wrong credentials");
                    }
                    return {
                        id: user?._id,
                        email: user?.email,
                    };
                } catch (error) {
                    throw new Error("Wrong credentials");
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 3600 * 5, // 5 hour
    },
    jwt: {
        maxAge: 3600 * 5, // 1 hour
    },
    callbacks: {
        async signIn({ user, account, profile, credentials, email }) {
            if (user.email === process.env.ADMIN_EMAIL) return true;
            return false;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.email = user?.email;
                // @ts-ignore
                token.id = user?.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.email = token?.email as string;
                session.user.id = token?.id as string;
            }
            return session;
        },

        redirect({ baseUrl, url }) {
            return `${baseUrl}/dashboard`;
        },
    },
};
