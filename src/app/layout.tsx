import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

/* ── Fonts — Geist as FK Grotesk Neue substitute ── */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AAREN | Creative Studio & Material House",
  description:
    "A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling. Our work spans disciplines, unified by the singular drive of crafting unforgettable environments.",
  metadataBase: new URL("https://aarenstudio.com"),
  openGraph: {
    title: "AAREN | Creative Studio & Material House",
    description:
      "A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling.",
    url: "https://aarenstudio.com",
    siteName: "Aaren Creative Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AAREN | Creative Studio & Material House",
    description:
      "A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${jost.variable}`} suppressHydrationWarning>
      <body>
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
