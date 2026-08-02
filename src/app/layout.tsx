import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

import localFont from "next/font/local";

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

const jost = localFont({
  src: [
    { path: "./fonts/Jost-Thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Jost-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./fonts/Jost-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/Jost-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "./fonts/Jost-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Jost-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/Jost-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Jost-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Jost-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Jost-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/Jost-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Jost-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./fonts/Jost-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Jost-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Jost-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Jost-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "./fonts/Jost-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Jost-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-jost",
  display: "swap",
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
      <body className={jost.className} suppressHydrationWarning>
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
