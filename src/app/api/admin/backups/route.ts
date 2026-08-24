import { NextResponse } from "next/server";
import { listStoreBackups, createStoreBackup } from "@/lib/store";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const download = searchParams.get("download");
    const filename = searchParams.get("file");

    const backupsDir = path.join(process.cwd(), "data", "backups");
    const masterPath = path.join(process.cwd(), "data", "master_store.json");

    // 1. Download specific backup file or full master store
    if (download === "master") {
      if (fs.existsSync(masterPath)) {
        const content = fs.readFileSync(masterPath, "utf-8");
        return new NextResponse(content, {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="aaren_studio_full_database_${new Date().toISOString().slice(0, 10)}.json"`,
          },
        });
      }
    }

    if (filename) {
      const target = path.join(backupsDir, path.basename(filename));
      if (fs.existsSync(target)) {
        const content = fs.readFileSync(target, "utf-8");
        return new NextResponse(content, {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="${path.basename(filename)}"`,
          },
        });
      }
    }

    // 2. List all available backup files
    const backups = await listStoreBackups();
    return NextResponse.json({
      success: true,
      count: backups.length,
      backups,
      latestMasterExists: fs.existsSync(masterPath),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const masterPath = path.join(process.cwd(), "data", "master_store.json");
    if (!fs.existsSync(masterPath)) {
      return NextResponse.json({ success: false, error: "Master store not found" }, { status: 404 });
    }
    const data = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
    const filename = await createStoreBackup("full_master", data);

    return NextResponse.json({
      success: true,
      message: "Full database backup created successfully",
      filename,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
