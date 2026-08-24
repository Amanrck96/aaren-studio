import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Aaren Creative Studio",
  description:
    "Explore our curated catalog of premium architectural materials — plywood, veneers, laminates, flooring, tiles, doors, bathroom systems, lighting, and more for luxury interior design.",
  openGraph: {
    title: "Products — Aaren Creative Studio",
    description:
      "Premium architectural materials, surfaces, hardware, and wellness solutions for luxury interiors.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aarenstudio.vercel.app"}/products`,
    siteName: "Aaren Creative Studio",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
