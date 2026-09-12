import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandFolderBySlugStore, getBrandFoldersStore } from "@/lib/store";
import QRCodeChimpShowroom from "@/components/QRCodeChimpShowroom";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string | string[] }>;
}

function resolveSlug(slug: string | string[] | undefined): string {
  if (!slug) return "";
  if (Array.isArray(slug)) return slug.join("/");
  return String(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = resolveSlug(slug);
  const lower = slugStr.trim().toLowerCase();

  if (lower === "aarenintpro" || lower === "all") {
    return {
      title: "Aaren Intpro | Official Catalogues & Showroom Hub",
      description:
        "i am Where Design Is. Official architectural catalogues and specifications across 20 European luxury surface brands.",
    };
  }

  const brand = await getBrandFolderBySlugStore(slugStr);

  if (!brand) {
    return {
      title: "Brand Showroom Not Found | Aaren Studio",
      description: "The requested brand showroom could not be found.",
    };
  }

  const title = `${brand.name} | Official Catalogues & Specifications | Aaren Studio`;
  const description =
    brand.tagline ||
    brand.description ||
    `Official architectural catalogues, finish specifications, and technical brochures for ${brand.name}. Curated by Aaren Studio.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: brand.bannerImageUrl ? [{ url: brand.bannerImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: brand.bannerImageUrl ? [brand.bannerImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BrandDownloadPage({ params }: Props) {
  const { slug } = await params;
  const slugStr = resolveSlug(slug);
  const lower = slugStr.trim().toLowerCase();
  const allBrands = await getBrandFoldersStore();

  if (lower === "aarenintpro" || lower === "all") {
    return <QRCodeChimpShowroom mode="hub" brandFolders={allBrands} />;
  }

  const brand = await getBrandFolderBySlugStore(slugStr);

  if (!brand) {
    notFound();
  }

  return (
    <QRCodeChimpShowroom
      mode="brand"
      brandFolders={allBrands}
      currentBrand={brand}
    />
  );
}
