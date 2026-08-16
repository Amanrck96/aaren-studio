import { NextResponse } from "next/server";
import { getCatalogsStore, logInquiryStore, incrementCatalogDownloadCount } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const catalogs = await getCatalogsStore();
    return NextResponse.json({ success: true, count: catalogs.length, data: catalogs }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("GET /api/catalogs Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to load catalogs" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, profession, city, catalogId, catalogTitle, fileName, fileUrl } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Name, Email, and Phone are required" }, { status: 400 });
    }

    // Increment catalog download count safely
    try {
      if (catalogId) {
        await incrementCatalogDownloadCount(catalogId);
      }
    } catch (countErr) {
      console.error("Increment catalog download error:", countErr);
    }

    // Save lead details into Inquiries Store
    const leadMessage = `Catalog PDF Downloaded: ${catalogTitle || fileName || "Architectural Catalog"}\nProfession: ${profession || "N/A"}\nCity: ${city || "N/A"}`;
    
    const leadData = {
      name,
      email,
      phone,
      type: "Catalog PDF Gate",
      subject: `PDF Downloaded: ${catalogTitle || fileName}`,
      message: leadMessage,
      productOrBrand: `${catalogTitle || fileName} (${fileName})`,
      downloadedFileName: fileName,
      catalogId,
      profession,
      city,
    };

    let inquiry = null;
    try {
      inquiry = await logInquiryStore(leadData);
    } catch (inqErr) {
      console.error("Log inquiry error:", inqErr);
    }

    return NextResponse.json({
      success: true,
      message: "Lead recorded & catalog unlocked",
      fileUrl: fileUrl || `/catalogs/${fileName}`,
      downloadUrl: fileUrl || `/catalogs/${fileName}`,
      fileName,
      data: inquiry,
    });
  } catch (err: any) {
    console.error("POST /api/catalogs Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to log download lead" }, { status: 500 });
  }
}
