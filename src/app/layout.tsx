import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import {cn} from "@/lib/utils";
import {SessionProvider} from "next-auth/react";
import {TanstackQueryProvider} from "@/components/tanstack-query-provider";
import {Navbar} from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";
import {ThemeProvider} from "next-themes";

const inter = Inter({
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "AAM",
    description: "Gestionale Azienda Agricola Maggini",
};

export const viewport: Viewport = {
    maximumScale: 1,
    viewportFit: "cover",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.svg" sizes="any" />
        </head>
        <body
            className={cn(
                "bg-background font-sans antialiased",
                inter.className
            )}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >

        <SessionProvider>
            <TanstackQueryProvider>
                <Toaster richColors={true} position={'top-center'} theme={'light'}/>
                <div className="xs:pb-[45px] relative flex min-h-screen flex-col">
                    <div className="main bg-white overflow-y-auto" vaul-drawer-wrapper="" style={{height: 'calc(100dvh - 4rem - 20px)'}}>
                        {children}
                    </div>
                    <Navbar/>
                </div>
            </TanstackQueryProvider>
        </SessionProvider>
        </ThemeProvider>
        </body>
        </html>
);
}
