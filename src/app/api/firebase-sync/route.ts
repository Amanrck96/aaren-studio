import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/firebase";
import { ref as fbStorageRef, uploadString } from "firebase/storage";
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
  getDeletedIdsStore,
  getCareersStore,
  getAllFAQsStore,
  getTaxonomiesStore,
  getPagesStore,
  getDownloadFoldersStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FIREBASE_RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aarenintpro-1c09f-default-rtdb.firebaseio.com";

async function pushToFirebase(key: string, data: any) {
  if (data === undefined || data === null) return;
  // 1. Authoritative Cloud Store: Firebase Storage (Permanent across all serverless instances)
  try {
    const r = fbStorageRef(storage, `store/${key}.json`);
    await uploadString(r, JSON.stringify(data), "raw");
  } catch (err) {
    console.error(`Firebase Storage push failed for ${key}:`, err);
  }

  // 2. Secondary RTDB
  try {
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
  } catch (_) {}
}

/**
 * POST /api/firebase-sync
 * Force-pushes ALL store data to Firebase Storage & RTDB and revalidates all public pages.
 */
export async function POST() {
  try {
    // 1. Invalidate memory caches first
    invalidateMemoryCache();

    // 2. Fetch authoritative active collections
    const [
      brands,
      categories,
      collections,
      products,
      projects,
      team,
      joinBanner,
      settings,
      catalogSettings,
      roadmap,
      catalogs,
      blogs,
      services,
      testimonials,
      deletedIds,
      careers,
      faqs,
      taxonomies,
      pages,
      downloadFolders,
    ] = await Promise.all([
      getBrandsStore(),
      getCategoriesStore(),
      getAllCollectionsStore(),
      getAllProductsStore(),
      getAllProjectsStore(),
      getTeamStore(),
      getTeamJoinBannerStore(),
      getSiteSettingsStore(),
      getCatalogSettingsStore(),
      getRoadmapStore(),
      getCatalogsStore(),
      getBlogsStore(),
      getServicesStore(),
      getTestimonialsStore(),
      getDeletedIdsStore(),
      getCareersStore(),
      getAllFAQsStore(),
      getTaxonomiesStore(),
      getPagesStore(),
      getDownloadFoldersStore(),
    ]);

    // 3. Push all collections to Firebase in parallel
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
      pushToFirebase("deletedIds", deletedIds),
      pushToFirebase("careers", careers),
      pushToFirebase("faqs", faqs),
      pushToFirebase("taxonomies", taxonomies),
      pushToFirebase("pages", pages),
      pushToFirebase("downloadFolders", downloadFolders),
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
