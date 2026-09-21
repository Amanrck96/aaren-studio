import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryFolderBySlugStore, getCategoryFoldersStore } from "@/lib/store";
import CategoryShowroom from "@/components/CategoryShowroom";

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
  const category = await getCategoryFolderBySlugStore(slugStr);

  if (!category) {
    return {
      title: "Category Catalogues Not Found | Aaren Intpro",
      description: "The requested category download showroom could not be found.",
    };
  }

  const title = `${category.name} | Official Catalogues & Specifications | Aaren Intpro`;
  const description =
    category.tagline ||
    category.description ||
    `Official architectural catalogues, technical brochures, and specifications for ${category.name}. Curated by Aaren Intpro.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.bannerImageUrl ? [{ url: category.bannerImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.bannerImageUrl ? [category.bannerImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryDownloadSinglePage({ params }: Props) {
  const { slug } = await params;
  const slugStr = resolveSlug(slug);
  const allCategories = await getCategoryFoldersStore();
  const category = await getCategoryFolderBySlugStore(slugStr);

  if (!category) {
    notFound();
  }

  return (
    <CategoryShowroom
      mode="category"
      categoryFolders={allCategories}
      currentCategory={category}
    />
  );
}
