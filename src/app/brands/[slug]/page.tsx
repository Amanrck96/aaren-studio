import { getBrandsStore, getAllProductsStore, getAllCollectionsStore, getAllFAQsStore } from "@/lib/store";
import BrandDetailClient from "./BrandDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

  // Pre-fetch all necessary dynamic data on the server
  const [brands, products, collections, allFaqs] = await Promise.all([
    getBrandsStore().catch(() => []),
    getAllProductsStore().catch(() => []),
    getAllCollectionsStore().catch(() => []),
    getAllFAQsStore().catch(() => []),
  ]);

  const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const slugNorm = norm(cleanSlug);

  // 1. Resolve matching dynamic brand
  const foundBrand = (brands || []).find((b: any) => {
    const bIdNorm = norm(b.id);
    const bNameNorm = norm(b.name);
    return (
      b.id === cleanSlug ||
      bIdNorm === slugNorm ||
      bNameNorm === slugNorm ||
      (slugNorm.length > 3 && bNameNorm.includes(slugNorm)) ||
      (slugNorm.length > 3 && slugNorm.includes(bNameNorm))
    );
  }) || null;

  const brandName = foundBrand?.name || cleanSlug.replace(/[-_]/g, " ");
  const brandNameNorm = norm(brandName);

  // 2. Resolve matching products for this brand
  const matchingProducts = (products || []).filter((p: any) => {
    const pBrand = norm(p.brand || "");
    const pBrandId = norm(p.brandId || "");
    return (
      pBrand === slugNorm ||
      pBrandId === slugNorm ||
      pBrand === brandNameNorm ||
      pBrandId === brandNameNorm ||
      (slugNorm.length > 3 && pBrand.includes(slugNorm)) ||
      (brandNameNorm.length > 3 && pBrand.includes(brandNameNorm))
    );
  });

  // 3. Resolve matching collections for this brand
  const matchingCollections = (collections || []).filter((c: any) => {
    const cBrand = norm(c.brandId || "");
    const cBrandName = norm(c.brandName || "");
    return (
      cBrand === slugNorm ||
      cBrandName === slugNorm ||
      cBrand === brandNameNorm ||
      cBrandName === brandNameNorm ||
      (slugNorm.length > 3 && slugNorm.includes(cBrand)) ||
      (brandNameNorm.length > 3 && brandNameNorm.includes(cBrand))
    );
  });

  // 4. Resolve matching brandwise FAQs
  const matchingFaqs = (allFaqs || []).filter((f: any) => {
    const fBrand = norm(f.brand || "");
    const fBrandId = norm(f.brandId || "");
    const fCat = norm(f.category || "");
    return (
      fBrand === slugNorm ||
      fBrandId === slugNorm ||
      fCat === slugNorm ||
      fBrand === brandNameNorm ||
      fBrandId === brandNameNorm ||
      fCat === brandNameNorm ||
      (slugNorm.length > 3 && (fBrand.includes(slugNorm) || fCat.includes(slugNorm))) ||
      (brandNameNorm.length > 3 && (fBrand.includes(brandNameNorm) || fCat.includes(brandNameNorm)))
    );
  });

  return (
    <BrandDetailClient
      slug={cleanSlug}
      initialBrand={foundBrand}
      initialProducts={matchingProducts}
      initialCollections={matchingCollections}
      initialFaqs={matchingFaqs}
    />
  );
}

