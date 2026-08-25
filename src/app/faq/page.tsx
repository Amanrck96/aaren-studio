import { getAllFAQsStore } from "@/lib/store";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getAllFAQsStore();
  return <FaqClient initialFaqs={faqs} />;
}
