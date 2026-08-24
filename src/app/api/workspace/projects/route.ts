import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedWorkspaceClient } from "@/lib/workspaceAuth";
import {
  getWorkspaceProjectsByClientIdStore,
  getWorkspaceProjectByIdStore,
  saveWorkspaceProjectStore,
} from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (projectId) {
      // 1. Try Prisma
      try {
        const clientFilter = clientUser.role === "admin" && clientUser.clientId === "admin-scope"
          ? {}
          : {
              OR: [
                { clientId: clientUser.clientId },
                { client: clientUser.name },
              ],
            };

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
        if (project) return NextResponse.json({ success: true, data: project });
      } catch (e) {}

      // 2. Try Store
      const storeProject = await getWorkspaceProjectByIdStore(projectId, clientUser.clientId);
      if (storeProject) {
        return NextResponse.json({ success: true, data: storeProject });
      }

      return NextResponse.json({ success: false, error: "Project not found or access denied" }, { status: 404 });
    }

    // List all projects for this specific client
    let projects: any[] = [];
    try {
      const clientFilter = clientUser.role === "admin" && clientUser.clientId === "admin-scope"
        ? {}
        : {
            OR: [
              { clientId: clientUser.clientId },
              { client: clientUser.name },
            ],
          };

      projects = await prisma.project.findMany({
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
    } catch (e) {}

    // Fallback to Store
    if (!projects || projects.length === 0) {
      projects = await getWorkspaceProjectsByClientIdStore(clientUser.clientId);
    }

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

    const projectId = "proj-" + Date.now().toString(36);
    const codeNum = Math.floor(10 + Math.random() * 90);
    const slug = (title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6));

    const projectData = {
      id: projectId,
      title: title.trim(),
      slug,
      description: description || "Bespoke architectural design and spatial project workspace.",
      category: category || "Residential Architecture",
      client: clientUser.name,
      clientId: clientUser.clientId,
      projectCode: "PR " + codeNum,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      gallery: ["/brands/brand_1_1.png", "/brands/brand_2_1.png"],
      budget: budget ? parseFloat(budget) : 5000000,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
      scheduleItems: [
        {
          id: "item-init-" + Date.now(),
          projectId,
          name: "Architectural Concept & Spatial Layout Drawing",
          room: "Whole Space",
          category: "Drawings & Approvals",
          supplier: "Aaren Design Studio",
          price: budget ? Math.round(parseFloat(budget) * 0.1) : 500000,
          status: "PENDING",
          imageUrl: "/brands/brand_1_1.png",
          specs: "Initial 2D Spatial Plan and Material Palette Board",
          dimensions: "Full Project Scope",
          quantity: 1,
          unit: "Set",
          comments: [
            {
              id: "com-init-" + Date.now(),
              scheduleItemId: "item-init-" + Date.now(),
              authorName: "Aaren Studio Architect",
              authorRole: "ARCHITECT",
              content: "Welcome to your project workspace! Our design team is preparing your preliminary specifications.",
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
      documents: [],
      invoices: [],
    };

    // Save to Prisma
    try {
      await prisma.project.create({
        data: {
          id: projectId,
          title: projectData.title,
          slug: projectData.slug,
          description: projectData.description,
          category: projectData.category,
          client: projectData.client,
          clientId: projectData.clientId,
          projectCode: projectData.projectCode,
          imageUrl: projectData.imageUrl,
          gallery: projectData.gallery,
          budget: projectData.budget,
          status: projectData.status,
        },
      });
    } catch (e) {}

    // Save to Store / Firebase
    await saveWorkspaceProjectStore(projectData);

    return NextResponse.json({ success: true, data: projectData });
  } catch (error: any) {
    console.error("Error creating workspace project:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

