import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedWorkspaceClient } from "@/lib/workspaceAuth";

export async function GET(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    // STRICT QUERY-LAYER ISOLATION:
    // If admin-scope, allow fetching all or by client; if client, strictly filter by clientId
    const clientFilter = clientUser.role === "admin" && clientUser.clientId === "admin-scope"
      ? {}
      : {
          OR: [
            { clientId: clientUser.clientId },
            { client: clientUser.name },
          ],
        };

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ...clientFilter,
        },
        include: {
          scheduleItems: {
            include: {
              comments: {
                orderBy: { createdAt: "asc" },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          documents: {
            orderBy: { createdAt: "desc" },
          },
          invoices: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!project) {
        return NextResponse.json({ success: false, error: "Project not found or access denied" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: project });
    }

    // List all projects for this client
    const projects = await prisma.project.findMany({
      where: clientFilter,
      include: {
        scheduleItems: {
          include: {
            comments: true,
          },
        },
        documents: true,
        invoices: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
      client: {
        id: clientUser.clientId,
        name: clientUser.name,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/workspace/projects:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, budget } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Project title is required" }, { status: 400 });
    }

    const slug = (title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6));

    const newProject = await prisma.project.create({
      data: {
        title,
        slug,
        description: description || "Bespoke architectural project workspace.",
        category: category || "Residential Architecture",
        client: clientUser.name,
        clientId: clientUser.clientId,
        projectCode: "PR " + Math.floor(10 + Math.random() * 90),
        imageUrl: "/brands/brand_1_1.png",
        gallery: [],
        budget: budget ? parseFloat(budget) : null,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({ success: true, data: newProject });
  } catch (error: any) {
    console.error("Error creating workspace project:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
