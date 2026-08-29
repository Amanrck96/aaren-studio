import { Metadata } from "next";
import DownloadsClient from "./DownloadsClient";

export const metadata: Metadata = {
  title: "Downloads & Specifications Repository | Aaren Studio",
  description: "Official architectural catalogues, technical specifications, and digital brochures across 20 European luxury brands.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DownloadsPage() {
  return <DownloadsClient />;
}
