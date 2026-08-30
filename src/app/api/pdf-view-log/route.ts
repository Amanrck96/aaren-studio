import { NextResponse } from "next/server";
import { logPdfViewStore, logInquiryStore } from "@/lib/store";
import { sendInquiryEmailNotification } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      pdfName,
      pdfUrl,
      userName,
      userEmail,
      userPhone,
      userRole,
      brandName,
      productTitle,
      source = "auto-logged-in",
    } = body;

    const effectiveName = (userName || "Logged-In User").trim();
    const effectiveEmail = (userEmail || "user@aarenstudio.com").trim();
    const effectivePhone = (userPhone || "+91 (Logged In User)").trim();
    const title = pdfName || productTitle || brandName || "Architectural Catalogue";

    // 1. Create Lead in Inquiries Store
    const lead = await logInquiryStore({
      name: effectiveName,
      email: effectiveEmail,
      phone: effectivePhone,
      type: "Catalog PDF View (Logged In)",
      subject: `Logged-In PDF View: ${title}`,
      productOrBrand: brandName ? `${brandName} - ${title}` : title,
      message: `User ${effectiveName} (${effectiveEmail}) was logged in and accessed PDF: ${title} (${pdfUrl || "direct view"}).`,
      source,
      isLoggedIn: true,
      userRole: userRole || "Client / User",
    });

    // 2. Log specific PDF View record linked to this lead
    const viewLog = await logPdfViewStore({
      pdfName: title,
      pdfUrl: pdfUrl || "",
      userName: effectiveName,
      userEmail: effectiveEmail,
      userPhone: effectivePhone,
      leadId: lead.id,
      source,
    });

    // 3. Email Alert Notification (Non-blocking)
    try {
      sendInquiryEmailNotification({
        name: effectiveName,
        email: effectiveEmail,
        phone: effectivePhone,
        type: "Catalog PDF View (Logged In)",
        subject: `[LOGGED-IN PDF ACCESS] ${title}`,
        productOrBrand: brandName ? `${brandName} - ${title}` : title,
        message: `Logged In User accessed ${title}. Email: ${effectiveEmail}, Phone: ${effectivePhone}`,
      }).catch(() => {});
    } catch {}

    return NextResponse.json({
      success: true,
      message: "PDF view logged and lead captured successfully",
      leadId: lead.id,
      viewId: viewLog.id,
    });
  } catch (err: any) {
    console.error("Error in /api/pdf-view-log:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
