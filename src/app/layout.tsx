import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import QueryProvider from "@/components/providers/react-query-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Vaishali press",
    description: "a visiting card ecommerce.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <QueryProvider>
                    <AuthProvider>{children}</AuthProvider>
                    <Analytics />
                </QueryProvider>
            </body>
        </html>
    );
}
