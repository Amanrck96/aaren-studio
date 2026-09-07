import { getSiteSettingsStore, getCategoriesStore, getBrandsStore, getAllProjectsStore } from "@/lib/store";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const [siteSettings, categories, brands, projects] = await Promise.all([
    getSiteSettingsStore().catch(() => null),
    getCategoriesStore().catch(() => []),
    getBrandsStore().catch(() => []),
    getAllProjectsStore().catch(() => []),
  ]);

  return (
    <HomeClient
      initialSettings={siteSettings}
      initialCategories={categories}
      initialBrands={brands}
      initialProjects={projects}
    />
  );
}
