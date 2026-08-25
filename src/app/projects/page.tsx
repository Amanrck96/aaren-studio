import { getAllProjectsStore } from "@/lib/store";
import AllProjectsClient, { Project } from "./AllProjectsClient";

export const dynamic = "force-dynamic";

export default async function AllProjectsPage() {
  const rawProjects = await getAllProjectsStore();

  const projectsList: Project[] = (rawProjects || []).map((p: any, idx: number) => ({
    id: p.id || `proj-${idx}`,
    slug: p.slug || p.id || `proj-${idx}`,
    client: p.client || p.name || "Client Project",
    code: p.code || "AP",
    num: String(idx + 1).padStart(2, "0"),
    title: p.title || p.name || "Architectural Project",
    year: p.year || "2025",
    category: p.category || "Commercial",
    location: p.location || "Bengaluru",
    image: p.imageUrl || p.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description: p.description || "Architectural space by Aaren Studio.",
    tags: p.tags || ["Architecture", "Design"],
  }));

  return <AllProjectsClient initialProjects={projectsList} />;
}
