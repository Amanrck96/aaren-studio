import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Aaren Creative Studio",
  description:
    "A creative studio and material house dedicated to designing and producing immersive spatial experiences, premium architectural surfaces, and environments — meant to evoke feeling.",
  metadataBase: new URL("https://aarenstudio.com"),
  openGraph: {
    title: "Aaren Creative Studio",
    description: "Immersive spatial experiences and premium architectural surfaces.",
    url: "https://aarenstudio.com",
    siteName: "Aaren Creative Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaren Creative Studio",
    description: "Immersive spatial experiences and premium architectural surfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
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
