import { NextResponse } from "next/server";
import { getAllProjectsStore, createProjectStore } from "@/lib/store";

export async function GET() {
  try {
    const projects = await getAllProjectsStore();
    return NextResponse.json({ success: true, count: projects.length, data: projects });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.client || !body.category) {
      return NextResponse.json(
        { success: false, error: "Title, Client, and Category are required" },
        { status: 400 }
      );
    }

    const newProject = await createProjectStore({
      title: body.title,
      client: body.client,
      category: body.category,
      description: body.description || "",
      imageUrl: body.imageUrl,
      selectedProducts: body.selectedProducts || [],
    });

    return NextResponse.json({ success: true, data: newProject });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
