import { NextResponse } from "next/server";
import { getTeamStore, saveTeamMemberStore, deleteTeamMemberStore, getRoadmapStore, saveRoadmapStepStore } from "@/lib/store";

export async function GET() {
  try {
    const team = await getTeamStore();
    const roadmap = await getRoadmapStore();
    return NextResponse.json({ success: true, team, roadmap });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === "roadmap") {
      const saved = await saveRoadmapStepStore(body.data);
      return NextResponse.json({ success: true, data: saved });
    } else {
      const saved = await saveTeamMemberStore(body.data);
      return NextResponse.json({ success: true, data: saved });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    if (type === "team") {
      await deleteTeamMemberStore(id);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
