import { Metadata } from "next";
import { getBrandFoldersStore, getCategoriesStore } from "@/lib/store";
import QRCodeChimpShowroom from "@/components/QRCodeChimpShowroom";
import DownloadsClient from "./DownloadsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Aaren Intpro | Official Catalogues & Showroom Hub",
  description:
    "i am Where Design Is. Official architectural catalogues, technical specifications, and digital brochures across 20 European luxury brands.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams?: Promise<{ view?: string; tab?: string }>;
}

export default async function DownloadsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [brandFolders, categories] = await Promise.all([
    getBrandFoldersStore(),
    getCategoriesStore(),
  ]);

  if (resolvedSearchParams?.view === "explorer" || resolvedSearchParams?.view === "table") {
    return <DownloadsClient />;
  }

  return (
    <QRCodeChimpShowroom
      mode="hub"
      brandFolders={brandFolders}
      categories={categories}
      initialTab={resolvedSearchParams?.tab === "categories" ? "categories" : "brands"}
    />
  );
}
