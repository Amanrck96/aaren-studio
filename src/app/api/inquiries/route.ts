import { NextResponse } from "next/server";
import { getInquiriesStore, logInquiryStore, generateInquiriesCSV } from "@/lib/store";

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
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ success: false, error: "Name, Email, and Phone are required" }, { status: 400 });
    }

    const inquiry = await logInquiryStore(body);
    return NextResponse.json({ success: true, message: "Lead captured successfully", data: inquiry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
