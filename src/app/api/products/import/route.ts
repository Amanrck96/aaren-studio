import { NextResponse } from "next/server";
import { parseAndImportExcelProducts } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No Excel file provided in request" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imported = await parseAndImportExcelProducts(buffer);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${imported.length} products`,
      importedCount: imported.length,
      data: imported,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process Excel upload" },
      { status: 500 }
    );
  }
}
