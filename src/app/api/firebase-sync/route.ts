import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  readJsonStore,
  invalidateMemoryCache,
  getBrandsStore,
  getCategoriesStore,
  getAllProductsStore,
  getAllProjectsStore,
  getAllCollectionsStore,
  getTeamStore,
  getTeamJoinBannerStore,
  getSiteSettingsStore,
  getCatalogSettingsStore,
  getRoadmapStore,
  getCatalogsStore,
  getBlogsStore,
  getServicesStore,
  getTestimonialsStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FIREBASE_RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aarenintpro-1c09f-default-rtdb.firebaseio.com";

async function pushToFirebase(key: string, data: any) {
  if (data === undefined || data === null) return;
  await Promise.allSettled([
    fetch(`${FIREBASE_RTDB_URL}/store/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    fetch(`${FIREBASE_RTDB_URL}/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  ]);
}

/**
 * POST /api/firebase-sync
 * Force-pushes ALL store data to Firebase RTDB and revalidates all public pages.
 */
export async function POST() {
  try {
    // 1. Invalidate memory caches first
    invalidateMemoryCache();

    // 2. Read latest master JSON store
    const localStore = readJsonStore();

    // 3. Fetch any missing collections with fallback getters
    const brands = (localStore.brands && localStore.brands.length > 0) ? localStore.brands : await getBrandsStore();
    const categories = (localStore.categories && localStore.categories.length > 0) ? localStore.categories : await getCategoriesStore();
    const collections = (localStore.collections && localStore.collections.length > 0) ? localStore.collections : await getAllCollectionsStore();
    const products = (localStore.products && localStore.products.length > 0) ? localStore.products : await getAllProductsStore();
    const projects = (localStore.projects && localStore.projects.length > 0) ? localStore.projects : await getAllProjectsStore();
    const team = (localStore.team && localStore.team.length > 0) ? localStore.team : await getTeamStore();
    const joinBanner = localStore.joinBanner || await getTeamJoinBannerStore();
    const settings = localStore.settings || await getSiteSettingsStore();
    const catalogSettings = localStore.catalogSettings || await getCatalogSettingsStore();
    const roadmap = (localStore.roadmap && localStore.roadmap.length > 0) ? localStore.roadmap : await getRoadmapStore();
    const catalogs = (localStore.catalogs && localStore.catalogs.length > 0) ? localStore.catalogs : ((localStore.pdfCatalogs && localStore.pdfCatalogs.length > 0) ? localStore.pdfCatalogs : await getCatalogsStore());
    const blogs = (localStore.blogs && localStore.blogs.length > 0) ? localStore.blogs : await getBlogsStore();
    const services = (localStore.services && localStore.services.length > 0) ? localStore.services : await getServicesStore();
    const testimonials = (localStore.testimonials && localStore.testimonials.length > 0) ? localStore.testimonials : await getTestimonialsStore();

    // 4. Push all collections to Firebase in parallel
    await Promise.all([
      pushToFirebase("brands", brands),
      pushToFirebase("categories", categories),
      pushToFirebase("collections", collections),
      pushToFirebase("products", products),
      pushToFirebase("projects", projects),
      pushToFirebase("team", team),
      pushToFirebase("joinBanner", joinBanner),
      pushToFirebase("settings", settings),
      pushToFirebase("catalogSettings", catalogSettings),
      pushToFirebase("roadmap", roadmap),
      pushToFirebase("catalogs", catalogs),
      pushToFirebase("pdfCatalogs", catalogs),
      pushToFirebase("blogs", blogs),
      pushToFirebase("services", services),
      pushToFirebase("testimonials", testimonials),
    ]);

    // 5. Invalidate memory cache again to ensure fresh reads
    invalidateMemoryCache();

    // 6. Comprehensive revalidation across all site routes
    const routesToRevalidate = [
      "/",
      "/about",
      "/brands",
      "/brands/[slug]",
      "/categories",
      "/products",
      "/products/[slug]",
      "/projects",
      "/all-projects",
      "/work",
      "/work/[slug]",
      "/services",
      "/catalogs",
      "/catalogs/[slug]/view",
      "/faq",
      "/blog",
      "/blog/[slug]",
      "/team",
      "/contact",
      "/shop",
      "/admin/dashboard",
      "/admin/categories",
      "/admin/brands",
      "/admin/products",
      "/admin/services",
    ];

    for (const r of routesToRevalidate) {
      try {
        revalidatePath(r);
      } catch (_) {}
    }

    try {
      revalidatePath("/", "layout");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "All collections synced to Firebase successfully and live routes refreshed.",
      synced: {
        brands: Array.isArray(brands) ? brands.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        collections: Array.isArray(collections) ? collections.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        team: Array.isArray(team) ? team.length : 0,
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        catalogs: Array.isArray(catalogs) ? catalogs.length : 0,
        settings: "✅",
        catalogSettings: "✅",
        roadmap: Array.isArray(roadmap) ? roadmap.length : 0,
        joinBanner: "✅",
      },
    });
  } catch (err: any) {
    console.error("Firebase force-sync error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
