import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedWorkspaceClient } from "@/lib/workspaceAuth";
import { addWorkspaceDocumentStore, deleteWorkspaceDocumentStore, getWorkspaceProjectByIdStore } from "@/lib/store";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "aaren-studio",
  api_key: process.env.CLOUDINARY_API_KEY || "cloudinary-key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "cloudinary-secret",
  secure: true,
});

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB limit (209,715,200 bytes)

export async function GET(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    // QUERY-LAYER ISOLATION: verify project belongs to client
    let project = null;
    try {
      project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ...(clientUser.role === "admin" && clientUser.clientId === "admin-scope"
            ? {}
            : {
                OR: [
                  { clientId: clientUser.clientId },
                  { client: clientUser.name },
                ],
              }),
        },
      });
    } catch (e) {}

    let storeProject = null;
    if (!project) {
      storeProject = await getWorkspaceProjectByIdStore(projectId, clientUser.clientId);
    }

    if (!project && !storeProject) {
      return NextResponse.json({ success: false, error: "Access denied to project documents" }, { status: 403 });
    }

    let documents: any = null;
    if (project) {
      try {
        documents = await prisma.projectDocument.findMany({
          where: { projectId },
          orderBy: { createdAt: "desc" },
        });
      } catch (e) {
        console.warn("Prisma documents lookup failed (falling back to store):", e);
      }
    }

    if (!documents && storeProject) {
      documents = storeProject.documents || [];
    }

    return NextResponse.json({ success: true, data: documents || [] });
  } catch (error: any) {
    console.error("Error fetching project documents:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;
    const fileType = (formData.get("fileType") as string) || "Drawing";
    const customName = formData.get("name") as string | null;

    if (!file || !projectId) {
      return NextResponse.json({ success: false, error: "File and Project ID are required" }, { status: 400 });
    }

    // 1. Enforce 200MB Size Limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of 200MB.`,
        },
        { status: 400 }
      );
    }

    // 2. QUERY-LAYER ISOLATION: Confirm project ownership
    let project = null;
    try {
      project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ...(clientUser.role === "admin" && clientUser.clientId === "admin-scope"
            ? {}
            : {
                OR: [
                  { clientId: clientUser.clientId },
                  { client: clientUser.name },
                ],
              }),
        },
      });
    } catch (e) {}

    let storeProject = null;
    if (!project) {
      storeProject = await getWorkspaceProjectByIdStore(projectId, clientUser.clientId);
    }

    if (!project && !storeProject) {
      return NextResponse.json({ success: false, error: "Access denied to project" }, { status: 403 });
    }

    // 3. Upload to Cloudinary
    let secureUrl = "";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: `aaren_workspace/${project?.id || storeProject?.id || projectId}`,
              public_id: `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        secureUrl = uploadResult.secure_url;
      } catch (err: any) {
        console.warn("Cloudinary direct upload failed, fallback to data URI:", err.message);
        const base64 = buffer.toString("base64");
        secureUrl = `data:${file.type || "application/octet-stream"};base64,${base64}`;
      }
    } else {
      // Fallback data URI for local dev if Cloudinary keys are pending
      const base64 = buffer.toString("base64");
      secureUrl = `data:${file.type || "application/octet-stream"};base64,${base64}`;
    }

    // 4. Save to Database & Store
    let docRecord: any = null;
    try {
      docRecord = await prisma.projectDocument.create({
        data: {
          projectId,
          clientId: clientUser.clientId,
          name: customName || file.name,
          fileUrl: secureUrl,
          fileType,
          fileSize: file.size,
          uploadedBy: clientUser.name,
        },
      });
    } catch (e) {
      console.warn("Prisma document create failed (falling back to store):", e);
    }

    const newDoc = docRecord || {
      id: "doc-" + Date.now(),
      projectId,
      clientId: clientUser.clientId,
      name: customName || file.name,
      fileUrl: secureUrl,
      fileType,
      fileSize: file.size,
      uploadedBy: clientUser.name,
      createdAt: new Date().toISOString(),
    };

    await addWorkspaceDocumentStore(newDoc);

    return NextResponse.json({
      success: true,
      data: newDoc,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("docId");
    const projectId = searchParams.get("projectId");

    if (!docId) {
      return NextResponse.json({ success: false, error: "Document ID is required" }, { status: 400 });
    }

    // Try deleting from database
    try {
      await prisma.projectDocument.delete({
        where: { id: docId },
      });
    } catch (e) {
      console.warn("Prisma document delete skipped/failed:", e);
    }

    // Delete from store
    await deleteWorkspaceDocumentStore(docId, projectId || undefined);

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting project document:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
