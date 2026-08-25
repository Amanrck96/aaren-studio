import { getAllProductsStore } from "@/lib/store";
import { DEFAULT_PRODUCTS } from "@/lib/client_constants";
import { ProductItem } from "@/lib/types";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawProducts = await getAllProductsStore();

  const mergedMap = new Map<string, ProductItem>();
  DEFAULT_PRODUCTS.forEach((p) => mergedMap.set(p.id, p));
  (rawProducts || []).forEach((p: ProductItem) => mergedMap.set(p.id, p));
  const mergedList = Array.from(mergedMap.values());

  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const slugNorm = cleanSlug.replace(/[^a-z0-9]/g, "");

  const match = mergedList.find((p: ProductItem) => {
    const pId = (p.id || "").toLowerCase();
    const pName = (p.name || "").toLowerCase();
    const pSlug = (p as any).slug ? (p as any).slug.toLowerCase() : pName.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const pNameNorm = pName.replace(/[^a-z0-9]/g, "");
    const pIdNorm = pId.replace(/[^a-z0-9]/g, "");

    return (
      pId === cleanSlug ||
      pSlug === cleanSlug ||
      pNameNorm === slugNorm ||
      pIdNorm === slugNorm ||
      (slugNorm.length > 5 && pNameNorm.includes(slugNorm)) ||
      (slugNorm.length > 5 && slugNorm.includes(pNameNorm))
    );
  }) || null;

  return (
    <ProductDetailClient
      slug={slug}
      initialProduct={match}
      initialAllProducts={mergedList}
    />
  );
}
