import { Metadata } from "next";
import { getCategoryFoldersStore } from "@/lib/store";
import CategoryShowroom from "@/components/CategoryShowroom";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Aaren Intpro | Category Catalogues & Digital Specifications Hub",
  description:
    "Official architectural catalogues, technical specifications, and digital brochures across European luxury categories curated by Aaren Intpro.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CategoryDownloadsHubPage() {
  const categoryFolders = await getCategoryFoldersStore();

  return (
    <CategoryShowroom
      mode="hub"
      categoryFolders={categoryFolders}
    />
  );
}
