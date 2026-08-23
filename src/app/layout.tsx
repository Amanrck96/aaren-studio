import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  src: "./fonts/Jost-VariableFont_wght.ttf",
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

import { getSiteSettingsStore } from "@/lib/store";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await getSiteSettingsStore();
  } catch (e) {}

  const bg = settings?.websiteBgColor || "#E6E2D8";
  const heading = settings?.headingColor || "#81663F";
  const text = settings?.textColor || "#1E1E1E";
  const accent = settings?.accentColor || "#81663F";

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <style
          id="aaren-dynamic-theme"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-bg: ${bg};
                --color-heading: ${heading};
                --color-text: ${text};
                --color-aaren-gold: ${accent};
                --color-aaren-sand: ${bg};
              }
              body {
                background-color: ${bg};
                color: ${text};
              }
              h1, h2, h3, .main-heading {
                color: ${heading};
              }
            `,
          }}
        />
      </head>
      <body className={jost.className} suppressHydrationWarning>
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
