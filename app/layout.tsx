import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexClientProvider } from "./convex-client-provider";
import ScrollButton from "@/components/scroll-button";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Frontend hub",
  description: "Frontend blogs website by ENG : Youssef Mohammed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <EdgeStoreProvider>
              <ThemeProvider
                enableSystem
                attribute="class"
                defaultTheme="system"
                disableTransitionOnChange
              >
                <TooltipProvider>{children}</TooltipProvider>
                <ScrollButton />
                <Toaster position="bottom-right" richColors />
              </ThemeProvider>
            </EdgeStoreProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
