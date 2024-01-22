import { authOptions } from "@/lib/auth-options";
import NextAuth from "next-auth/next";

const auth = NextAuth(authOptions);
export { auth as GET, auth as POST };
