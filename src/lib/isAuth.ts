import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export const isAuth = async () => {
    const session = await getServerSession(authOptions);
    if (session) return true;
    return false;
};
