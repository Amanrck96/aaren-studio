import { getAllProductsStore } from "@/lib/store";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAllProductsStore();
  return <ProductsClient initialProducts={products} />;
}
