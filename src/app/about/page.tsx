import { getRoadmapStore, getSiteSettingsStore } from "@/lib/store";
import AboutClient from "./AboutClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [roadmap, siteSettings] = await Promise.all([
    getRoadmapStore(),
    getSiteSettingsStore(),
  ]);

  return <AboutClient initialRoadmap={roadmap} initialSiteSettings={siteSettings} />;
}
