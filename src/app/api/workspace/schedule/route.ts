import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedWorkspaceClient } from "@/lib/workspaceAuth";
import { updateWorkspaceScheduleStatusStore, addWorkspaceCommentStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    // QUERY-LAYER ISOLATION: Confirm project belongs to this client
    const project = await prisma.project.findFirst({
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

    if (!project) {
      return NextResponse.json({ success: false, error: "Access denied to project schedule" }, { status: 403 });
    }

    const scheduleItems = await prisma.scheduleItem.findMany({
      where: {
        projectId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: scheduleItems });
  } catch (error: any) {
    console.error("Error fetching schedule items:", error);
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
    const { action, scheduleItemId, projectId, status, comment, name, room, category, price, specs, imageUrl, dimensions } = body;

    // 1. ADD THREADED COMMENT
    if (action === "comment") {
      if (!scheduleItemId || !comment) {
        return NextResponse.json({ success: false, error: "Schedule item ID and comment text are required" }, { status: 400 });
      }

      // Verify item belongs to a project owned by client
      const item = await prisma.scheduleItem.findUnique({
        where: { id: scheduleItemId },
        include: { project: true },
      });

      if (!item || (clientUser.role !== "admin" && item.project.clientId !== clientUser.clientId && item.project.client !== clientUser.name)) {
        return NextResponse.json({ success: false, error: "Access denied to comment on this item" }, { status: 403 });
      }

      const authorRole = clientUser.role === "admin" ? "ADMIN" : "CLIENT";
      let newComment: any = null;
      try {
        newComment = await prisma.scheduleComment.create({
          data: {
            scheduleItemId,
            authorName: clientUser.name,
            authorEmail: clientUser.email,
            authorRole,
            content: comment.trim(),
          },
        });
      } catch (e) {
        console.warn("Prisma schedule operation failed (falling back to store):", e);
      }

      // Store sync
      const syncedComment = await addWorkspaceCommentStore(scheduleItemId, comment, clientUser.name, authorRole);
      return NextResponse.json({ success: true, data: newComment || syncedComment });
    }

    // 2. APPROVE / REJECT / NEEDS_REVIEW STATUS UPDATE
    if (action === "update_status") {
      if (!scheduleItemId || !status) {
        return NextResponse.json({ success: false, error: "Schedule item ID and status are required" }, { status: 400 });
      }

      const validStatuses = ["PENDING", "APPROVED", "NEEDS_REVIEW", "REJECTED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
      }

      let updated: any = null;
      try {
        updated = await prisma.scheduleItem.update({
          where: { id: scheduleItemId },
          data: {
            status: status as any,
            approvedAt: status === "APPROVED" ? new Date() : null,
            approvedBy: status === "APPROVED" ? clientUser.name : null,
          },
          include: {
            comments: {
              orderBy: { createdAt: "asc" },
            },
          },
        });

        if (comment && comment.trim()) {
          await prisma.scheduleComment.create({
            data: {
              scheduleItemId,
              authorName: clientUser.name,
              authorEmail: clientUser.email,
              authorRole: clientUser.role === "admin" ? "ADMIN" : "CLIENT",
              content: `Status updated to ${status}: ${comment.trim()}`,
            },
          });
        }
      } catch (e) {
        console.warn("Prisma schedule operation failed (falling back to store):", e);
      }

      // Store / Firebase sync
      const syncedItem = await updateWorkspaceScheduleStatusStore(
        scheduleItemId,
        status,
        comment,
        clientUser.name,
        clientUser.role === "admin" ? "ADMIN" : "CLIENT"
      );

      return NextResponse.json({ success: true, data: updated || syncedItem });
    }

    // 3. CREATE NEW SPECIFICATION / SCHEDULE ITEM
    if (action === "create_item") {
      if (!projectId || !name) {
        return NextResponse.json({ success: false, error: "Project ID and Item Name are required" }, { status: 400 });
      }

      const project = await prisma.project.findFirst({
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

      if (!project) {
        return NextResponse.json({ success: false, error: "Access denied to project" }, { status: 403 });
      }

      const newItem = await prisma.scheduleItem.create({
        data: {
          projectId,
          name,
          room: room || "General",
          category: category || "Surfaces",
          price: price ? parseFloat(price) : 0,
          specs: specs || "",
          dimensions: dimensions || "",
          imageUrl: imageUrl || "/brands/brand_1_1.jpg",
          status: "PENDING",
        },
        include: {
          comments: true,
        },
      });

      return NextResponse.json({ success: true, data: newItem });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating schedule item:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
