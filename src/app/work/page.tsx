import { getAllProjectsStore } from "@/lib/store";
import WorkClient from "./WorkClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkPage() {
  const projects = await getAllProjectsStore();
  return <WorkClient initialProjects={projects} />;
}
