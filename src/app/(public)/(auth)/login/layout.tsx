// import { authOptions } from "@/lib/auth-options";
import { Loader2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

async function Login({ children }: { children: ReactNode }) {
    // const session = await getServerSession(authOptions);
    const session = await getServerSession();
    if (session) {
        return redirect("/dashboard");
    }

    return <>{children}</>;
}

export default async function LoginLayoutRoot({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense
            fallback={
                <div className="h-[70vh] flex items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            }
        >
            <Login>{children}</Login>
        </Suspense>
    );
}
