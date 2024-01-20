import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    pages: {
        signIn: "/login",
        error: "/login",
    },

    providers: [
        Credentials({
            credentials: {
                userId: {
                    type: "text",
                },
                password: {
                    type: "text",
                },
            },
            async authorize(credentials, request) {
                try {
                    if (!credentials?.password || !credentials?.userId) {
                        throw new Error("Invalid Credentials");
                    }

                    const user = await User.findOne({
                        userId: credentials?.userId,
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
                        id: user._id,
                        name: user.name,
                        userId: user.userId,
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
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.userId = user?.userId;
                // @ts-ignore
                token.name = user?.name;
                // @ts-ignore
                token.id = user?.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.userId = token?.userId;
                session.user.id = token?.id as string;
                session.user.name = token?.name as string;
            }
            return session;
        },

        redirect({ baseUrl, url }) {
            return `${baseUrl}/dashboard`;
        },
    },
};
