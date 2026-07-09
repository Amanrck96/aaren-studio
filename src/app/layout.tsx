import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Aaren Creative Studio | Premium Design & Brand Experiences",
  description: "Inspired by STURDY.CO. Aaren is a global creative powerhouse specializing in next-generation branding, motion design, 3D animations, and immersive WebGL experiences.",
  openGraph: {
    title: "Aaren Creative Studio",
    description: "Premium Design & Brand Experiences.",
    url: "https://aaren.com",
    siteName: "Aaren Studio",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaren Creative Studio",
    description: "Premium Design & Brand Experiences.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} antialiased`}>
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main className="min-h-screen relative">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
