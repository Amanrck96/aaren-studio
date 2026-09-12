import { Metadata } from "next";
import { getBrandFoldersStore } from "@/lib/store";
import QRCodeChimpShowroom from "@/components/QRCodeChimpShowroom";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Aaren Intpro | Official Catalogues & Showroom Hub",
  description:
    "i am Where Design Is. Official architectural catalogues, technical specifications, and digital brochures across 20 European luxury brands.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AarenIntproPage() {
  const brandFolders = await getBrandFoldersStore();

  return (
    <QRCodeChimpShowroom
      mode="hub"
      brandFolders={brandFolders}
    />
  );
}
