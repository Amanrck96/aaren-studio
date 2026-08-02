import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

export async function GET() {
  try {
    const templateData = [
      {
        "Product Name": "UltraShield Naturale Decking",
        "Brand": "Newtech Wood",
        "Category": "Decking",
        "Collection": "Naturale Series",
        "Width": "138 mm",
        "Height": "22.5 mm",
        "Thickness": "22.5 mm",
        "Finish": "Teak Composite",
        "Description": "Capped WPC composite decking profile with 360-degree protective shield.",
        "Price": 6400,
        "Price Unit": "per SQM",
        "Image URL": "https://aarenstudio.com/images/decking-01.jpg",
        "PDF URL": "https://aarenstudio.com/pdf/newtech-wood-catalog.pdf",
        "Application Tags": "Exterior Decking, Commercial, Pool Side",
      },
      {
        "Product Name": "FENIX NTM Nano Surface",
        "Brand": "Formica",
        "Category": "Flooring",
        "Collection": "FENIX NTM",
        "Width": "1300 mm",
        "Height": "3050 mm",
        "Thickness": "0.9 mm",
        "Finish": "Super Matte",
        "Description": "Anti-fingerprint smart surface with thermal healing properties.",
        "Price": 4200,
        "Price Unit": "per SQM",
        "Image URL": "https://aarenstudio.com/images/fenix-01.jpg",
        "PDF URL": "https://aarenstudio.com/pdf/formica-catalog.pdf",
        "Application Tags": "Interior Walls, Kitchen Tops, Countertops",
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Products Template");

    const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="AAREN_Products_Upload_Template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Excel Template Error:", error);
    return NextResponse.json({ error: "Failed to generate Excel template" }, { status: 500 });
  }
}
