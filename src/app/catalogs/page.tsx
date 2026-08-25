import { getCatalogsStore } from "@/lib/store";
import CatalogsClient from "./CatalogsClient";

export const dynamic = "force-dynamic";

export default async function CatalogsPage() {
  const catalogs = await getCatalogsStore();
  return <CatalogsClient initialCatalogs={catalogs} />;
}
