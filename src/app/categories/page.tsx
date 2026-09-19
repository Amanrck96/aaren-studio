import { Metadata } from "next";
import { getCategoriesStore } from "@/lib/store";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Browse by Category | Aaren Intpro",
  description:
    "Explore premium architectural product categories curated by Aaren Intpro — luxury interior design collections from European brands.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesStore();

  return <CategoriesClient initialCategories={categories} />;
}
