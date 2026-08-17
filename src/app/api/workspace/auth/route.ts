import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedWorkspaceClient } from "@/lib/workspaceAuth";

export async function GET(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, authenticated: false, message: "Unauthorized" }, { status: 401 });
    }

    const clientRecord = await prisma.client.findUnique({
      where: { id: clientUser.clientId },
      include: {
        projects: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: clientUser,
      client: clientRecord,
    });
  } catch (error: any) {
    console.error("Workspace auth error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrCode, password } = body;

    if (!emailOrCode) {
      return NextResponse.json({ success: false, error: "Email or Access Code is required" }, { status: 400 });
    }

    const input = emailOrCode.trim();
    const client = await prisma.client.findFirst({
      where: {
        OR: [
          { email: input },
          { accessCode: input },
          { name: input },
        ],
      },
    });

    if (!client) {
      return NextResponse.json({ success: false, error: "No matching client account found" }, { status: 404 });
    }

    // Verify code or password if provided
    if (client.accessCode && password && client.accessCode !== password && client.passwordHash !== password) {
      return NextResponse.json({ success: false, error: "Invalid password or access code" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      token: client.accessCode || client.id,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        logoUrl: client.logoUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
