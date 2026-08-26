import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
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
 * Force-pushes ALL local store data to Firebase RTDB.
 * Use this to bootstrap Firebase after a fresh Vercel deployment
 * or after editing master_store.json directly.
 */
export async function POST() {
  try {
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
    ]);

    // Push all collections to Firebase in parallel
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

    try {
      revalidatePath("/", "layout");
      revalidatePath("/brands");
      revalidatePath("/brands/[slug]", "page");
      revalidatePath("/products");
      revalidatePath("/admin/dashboard");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "All collections synced to Firebase successfully.",
      synced: {
        brands: brands.length,
        categories: categories.length,
        collections: collections.length,
        products: products.length,
        projects: projects.length,
        team: team.length,
        blogs: blogs.length,
        services: services.length,
        testimonials: testimonials.length,
        catalogs: catalogs.length,
        settings: "✅",
        catalogSettings: "✅",
        roadmap: roadmap.length,
        joinBanner: "✅",
      },
    });
  } catch (err: any) {
    console.error("Firebase force-sync error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
