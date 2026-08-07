import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { PromoBar } from "@/components/PromoBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GLAM — Discover. Connect. Trade.",
    template: "%s · GLAM",
  },
  description:
    "Millions of styles, fresh drops daily, and unbeatable wholesale prices. From the runway to your wardrobe — without the markup.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans text-fg antialiased">
        <PromoBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Cart drawer lives at the root so it's available on every page. */}
        <CartDrawer />
      </body>
    </html>
  );
}