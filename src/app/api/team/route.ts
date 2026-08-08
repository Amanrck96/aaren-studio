import { NextResponse } from "next/server";
import { getTeamStore, saveTeamMemberStore, reorderTeamStore, deleteTeamMemberStore, getRoadmapStore, saveRoadmapStepStore, getTeamJoinBannerStore, saveTeamJoinBannerStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const team = await getTeamStore();
    const roadmap = await getRoadmapStore();
    const joinBanner = await getTeamJoinBannerStore();
    return NextResponse.json(
      { success: true, team, roadmap, joinBanner, data: { team, roadmap, joinBanner } },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const memberData = body.data || body;

    if (body.type === "reorder") {
      const teamList = body.team || memberData;
      const saved = await reorderTeamStore(teamList);
      return NextResponse.json({ success: true, data: saved });
    } else if (body.type === "roadmap") {
      const saved = await saveRoadmapStepStore(memberData);
      return NextResponse.json({ success: true, data: saved });
    } else if (body.type === "joinBanner") {
      const saved = await saveTeamJoinBannerStore(memberData);
      return NextResponse.json({ success: true, data: saved });
    } else {
      const saved = await saveTeamMemberStore(memberData);
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

    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    await deleteTeamMemberStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
