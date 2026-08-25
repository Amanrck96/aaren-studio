import { getCareersStore } from "@/lib/store";
import CareersClient from "./CareersClient";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const careers = await getCareersStore();
  return <CareersClient initialPositions={careers} />;
}
