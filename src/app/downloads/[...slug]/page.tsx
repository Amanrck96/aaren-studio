import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getBrandFolderBySlugStore,
  getBrandFoldersStore,
  getCategoriesStore,
  getCategoryFolderBySlugStore,
} from "@/lib/store";
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
    const category = await getCategoryFolderBySlugStore(slugStr);
    if (category) {
      return {
        title: `${category.name} | Official Catalogues & Specifications | Aaren Intpro`,
        description:
          category.tagline ||
          category.description ||
          `Official architectural catalogues, technical brochures, and specifications for ${category.name}. Curated by Aaren Intpro.`,
      };
    }
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
    const categories = await getCategoriesStore();
    return <QRCodeChimpShowroom mode="hub" brandFolders={allBrands} categories={categories} />;
  }

  const brand = await getBrandFolderBySlugStore(slugStr);

  if (!brand) {
    const category = await getCategoryFolderBySlugStore(slugStr);
    if (category) {
      redirect(`/category-downloads/${category.slug}`);
    }
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
