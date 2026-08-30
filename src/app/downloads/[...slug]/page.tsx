import { Metadata } from "next";
import BrandDownloadClient from "./BrandDownloadClient";
import { getDownloadFoldersStore } from "@/lib/store";

interface Props {
  params: Promise<{ slug: string[] }>;
}

function parseSegments(rawSlug: string | string[]) {
  const parts = (Array.isArray(rawSlug) ? rawSlug : [rawSlug])
    .map((s) => {
      try {
        return decodeURIComponent(s).trim();
      } catch {
        return s.trim();
      }
    })
    .filter(Boolean);

  let brandQuery = "";
  let subQuery = "";

  if (parts.length === 0) {
    brandQuery = "";
  } else if (parts[0].toLowerCase() === "brands" && parts[1]) {
    brandQuery = parts[1];
    subQuery = parts.slice(2).join(" / ");
  } else {
    brandQuery = parts[0];
    subQuery = parts.slice(1).join(" / ");
  }

  return { parts, brandQuery, subQuery };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { brandQuery, subQuery } = parseSegments(slug);

  const folders = await getDownloadFoldersStore();
  const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const folder = folders.find(
    (f) =>
      f.id.toLowerCase() === brandQuery.toLowerCase() ||
      f.brandName.toLowerCase() === brandQuery.toLowerCase() ||
      norm(f.id) === norm(brandQuery) ||
      norm(f.brandName) === norm(brandQuery)
  );

  const brandTitle = folder ? folder.brandName : brandQuery.toUpperCase();
  const suffix = subQuery ? ` - ${subQuery}` : "";

  return {
    title: `${brandTitle}${suffix} | PDF Catalogs & Specifications | Aaren Studio`,
    description: `Download official architectural catalogues and technical specifications for ${brandTitle}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BrandDownloadCatchAllPage({ params }: Props) {
  const { slug } = await params;
  return <BrandDownloadClient slug={slug} />;
}
