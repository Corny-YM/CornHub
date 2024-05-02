import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter, Kodchasan, Baloo_Bhaijaan_2 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";

// const font = Inter({
//   subsets: ["vietnamese"],
//   variable: "--font-sans",
// });
// const font = Baloo_Bhaijaan_2({
//   subsets: ["latin"],
// });
const font = Kodchasan({
  weight: "500",
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: "CornHub",
  description: "Mini Social Media",
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
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            font.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
