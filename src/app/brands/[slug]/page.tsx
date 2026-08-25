import { getBrandByIdStore, getAllProductsStore, getAllCollectionsStore, getBrandsStore } from "@/lib/store";
import BrandDetailClient from "./BrandDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const [brand, allProducts, allCollections, allBrands] = await Promise.all([
    getBrandByIdStore(slug),
    getAllProductsStore(),
    getAllCollectionsStore(),
    getBrandsStore(),
  ]);

  const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = norm(slug);
  const resolvedBrand = brand || allBrands.find((b) => norm(b.id) === target || norm(b.name) === target) || null;
  const brandNameNorm = norm(resolvedBrand?.name || slug.replace(/[-_]/g, " "));

  // Matching collections
  const matchingCollections = allCollections.filter((c: any) => {
    const cBrand = norm(c.brandId || "");
    const cBrandName = norm(c.brandName || "");
    return (
      cBrand === target ||
      cBrandName === target ||
      cBrand === brandNameNorm ||
      cBrandName === brandNameNorm ||
      target.includes(cBrand) ||
      brandNameNorm.includes(cBrand)
    );
  });

  // Matching products
  const matchingProducts = allProducts.filter((p: any) => {
    const pBrand = norm(p.brand || "");
    return pBrand === target || pBrand === brandNameNorm || target.includes(pBrand) || brandNameNorm.includes(pBrand);
  });

  return (
    <BrandDetailClient
      slug={slug}
      initialBrand={resolvedBrand}
      initialProducts={matchingProducts}
      initialCollections={matchingCollections}
    />
  );
}
