import { MetadataRoute } from "next";
import { getBrandsStore, getAllProjectsStore, getAllProductsStore, getBlogsStore } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aarenstudio.com";
  const now = new Date();

  // Static core routes
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/projects",
    "/products",
    "/brands",
    "/catalogs",
    "/team",
    "/services",
    "/blog",
    "/faq",
    "/contact",
    "/shop",
    "/careers",
    "/privacy-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic brand routes
  try {
    const brands = await getBrandsStore();
    brands.forEach((b) => {
      const slug = (b as any).slug || b.id;
      if (slug) {
        routes.push({
          url: `${baseUrl}/brands/${slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    });
  } catch (e) {}

  // Dynamic project routes
  try {
    const projects = await getAllProjectsStore();
    projects.forEach((p) => {
      if (p.slug) {
        routes.push({
          url: `${baseUrl}/work/${p.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    });
  } catch (e) {}

  // Dynamic blog routes
  try {
    const blogs = await getBlogsStore();
    blogs.forEach((b) => {
      if (b.slug) {
        routes.push({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    });
  } catch (e) {}

  return routes;
}
