import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import localFont from "next/font/local";

const jost = localFont({
  src: "./fonts/Jost-VariableFont_wght.ttf",
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AAREN | Creative Studio & Material House",
  description:
    "A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling. Our work spans disciplines, unified by the singular drive of crafting unforgettable environments.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aarenstudio.vercel.app"),
  openGraph: {
    title: "AAREN | Creative Studio & Material House",
    description:
      "A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://aarenstudio.vercel.app",
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

import CustomCursor from "@/components/CustomCursor";

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
    <html lang="en" className={jost.variable} suppressHydrationWarning>
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
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
