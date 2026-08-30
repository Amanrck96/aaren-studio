import { Metadata } from "next";
import BrandDownloadClient from "../brands/[slug]/BrandDownloadClient";
import { getDownloadFoldersStore } from "@/lib/store";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const folders = await getDownloadFoldersStore();
  const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const folder = folders.find((f) => f.id.toLowerCase() === slug.toLowerCase() || norm(f.id) === norm(slug) || norm(f.brandName) === norm(slug));

  const brandTitle = folder ? folder.brandName : slug.toUpperCase();

  return {
    title: `${brandTitle} PDF Catalogs & Specifications | Aaren Studio`,
    description: `Download official architectural catalogues and technical specifications for ${brandTitle}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DownloadAliasPage({ params }: Props) {
  const { slug } = await params;
  return <BrandDownloadClient slug={slug} />;
}
