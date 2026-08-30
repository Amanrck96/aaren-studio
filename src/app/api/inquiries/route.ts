import { NextResponse } from "next/server";
import { getInquiriesStore, logInquiryStore, deleteInquiryStore, generateInquiriesCSV } from "@/lib/store";
import { sendInquiryEmailNotification } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    const inquiries = await getInquiriesStore();

    if (format === "csv") {
      const csv = generateInquiriesCSV(inquiries);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="aaren_leads_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isAutoLoggedIn = body.source === "auto-logged-in";

    const name = (body.name || (isAutoLoggedIn ? "Logged-In User" : "")).trim();
    const email = (body.email || (isAutoLoggedIn ? "client@aarenstudio.com" : "")).trim();
    const phone = (body.phone || (isAutoLoggedIn ? "+91 (Logged In Profile)" : "")).trim();

    if (!name || !email || (!phone && !isAutoLoggedIn)) {
      return NextResponse.json({ success: false, error: "Name, Email, and Phone are required" }, { status: 400 });
    }

    const inquiry = await logInquiryStore({
      ...body,
      name,
      email,
      phone,
      type: body.type || (isAutoLoggedIn ? "Catalog PDF View (Logged In)" : "Catalog Enquiry"),
      source: body.source || "form",
    });

    // Await instant email notification to info@aarenintpro.com via Gmail SMTP
    try {
      await sendInquiryEmailNotification(body);
    } catch (emailErr) {
      console.error("Email notification error:", emailErr);
    }

    return NextResponse.json({ success: true, message: "Lead captured successfully", data: inquiry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    await deleteInquiryStore(id);
    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
