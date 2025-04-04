import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import HeaderDock from "@/components/header-dock";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
const poppins = Poppins({
  weight: ["400", "900", "800", "700", "600", "500", "300", "200", "100"],
  variable: "--font-poppins",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "AyoSnap",
  description: "AyoSnap - The Ultimate PhotoBooth App"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed bottom-5 md:bottom-5 right-5 md:right-0 md:w-full md:grid md:place-items-center z-30">
            <HeaderDock />
          </header>
          <main className="container mx-auto">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
