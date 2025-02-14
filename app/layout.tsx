import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { EdgeStoreProvider } from "@/lib/edgestore";
import ScrollButton from "@/components/scroll-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexClientProvider } from "./convex-client-provider";

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
  description:
    "Frontend Hub empowers aspiring frontend developers with immersive, project-based learning and a modern tech stack. Founded by Youssef Mohammed, we bridge academic theory and real-world application through a supportive community and interactive curriculum.",
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
