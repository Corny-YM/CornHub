import "@/app/globals.css";
import "@/assets/scss/index.scss";
import "@/assets/scss/editor.scss";

import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { Inter, Kodchasan, Baloo_Bhaijaan_2 } from "next/font/google";

import { cn } from "@/lib/utils";
import { AppProvider } from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type Props = Readonly<{
  children: React.ReactNode;
}>;

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

export default function RootLayout({ children }: Props) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            font.className
          )}
        >
          <ClerkLoaded>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <AppProvider>{children}</AppProvider>
            </ThemeProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
