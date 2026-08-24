import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { logInquiryStore, getCatalogsStore } from "@/lib/store";
import { sendInquiryEmailNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { catalogId, slug, name, email, phone, company, profession, city } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Resolve catalog to verify it exists and retrieve canonical ID + slug
    let targetCatalogId = catalogId || "";
    let targetSlug = slug || "";
    let catalogTitle = "";

    try {
      if (targetSlug) {
        const found = await prisma.catalog.findUnique({ where: { slug: targetSlug } });
        if (found) {
          targetCatalogId = found.id;
          catalogTitle = found.title || found.name;
        }
      } else if (targetCatalogId) {
        const found = await prisma.catalog.findUnique({ where: { id: targetCatalogId } });
        if (found) {
          targetSlug = found.slug;
          catalogTitle = found.title || found.name;
        }
      }
    } catch (dbErr) {
      console.warn("Prisma catalog query fallback:", dbErr);
    }

    // Fallback store lookup if Prisma table hasn't been migrated or record is in memory/json
    if (!targetSlug || !targetCatalogId) {
      const catalogs = await getCatalogsStore();
      const match = catalogs.find(
        (c) =>
          (catalogId && (c.id === catalogId || (c as any).slug === catalogId)) ||
          (slug && ((c as any).slug === slug || c.id === slug || c.fileName.includes(slug)))
      );
      if (match) {
        targetCatalogId = targetCatalogId || match.id;
        targetSlug = targetSlug || (match as any).slug || match.id;
        catalogTitle = catalogTitle || match.title;
      }
    }

    if (!targetCatalogId) {
      targetCatalogId = "general-catalog";
    }
    if (!targetSlug) {
      targetSlug = targetCatalogId;
    }

    // Record Enquiry in DB (with graceful fallback)
    try {
      await prisma.enquiry.create({
        data: {
          catalogId: targetCatalogId,
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : null,
          company: company ? company.trim() : null,
          profession: profession ? profession.trim() : null,
          city: city ? city.trim() : null,
        },
      });
    } catch (enqErr) {
      console.warn("Prisma enquiry creation fallback to store:", enqErr);
    }

    // Also record in central inquiries store for admin notifications & lead logs
    try {
      await logInquiryStore({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : "",
        type: "Catalog PDF Gate",
        subject: `Catalog Enquiry: ${catalogTitle || targetSlug}`,
        message: `Catalog View Requested: ${catalogTitle || targetSlug}\nCatalog ID: ${targetCatalogId}\nCompany: ${company || "N/A"}\nProfession: ${profession || "N/A"}\nCity: ${city || "N/A"}`,
        productOrBrand: catalogTitle || targetSlug,
      });
    } catch (storeErr) {
      console.error("Store inquiry log error:", storeErr);
    }

    // Send instant email notification to info@aarenintpro.com and admin
    try {
      await sendInquiryEmailNotification({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : "N/A",
        type: "Catalog PDF Access Lead",
        subject: `📖 New Catalog Lead: ${name.trim()} (${catalogTitle || targetSlug})`,
        productOrBrand: catalogTitle || targetSlug,
        message: `Customer viewed/requested architectural catalog.\nCatalog: ${catalogTitle || targetSlug}\nCompany: ${company || "N/A"}\nProfession: ${profession || "N/A"}\nCity: ${city || "N/A"}`,
      });
    } catch (emailErr) {
      console.error("Catalog inquiry email notification error:", emailErr);
    }

    // Mint short-lived, single-purpose signed JWT (30 min validity)
    const secret =
      process.env.VIEW_TOKEN_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "aaren-studio-view-token-secret-key-2026";

    const token = jwt.sign(
      {
        catalogId: targetCatalogId,
        slug: targetSlug,
        email: email.trim(),
        name: name.trim(),
      },
      secret,
      { expiresIn: "30m" }
    );

    return NextResponse.json({
      success: true,
      token,
      slug: targetSlug,
      redirectUrl: `/catalogs/${targetSlug}/view?token=${encodeURIComponent(token)}`,
    });
  } catch (err: any) {
    console.error("POST /api/enquiry Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
