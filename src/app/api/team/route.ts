import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getTeamStore,
  saveTeamMemberStore,
  reorderTeamStore,
  deleteTeamMemberStore,
  getRoadmapStore,
  saveRoadmapStepStore,
  deleteRoadmapStepStore,
  reorderRoadmapStore,
  getTeamJoinBannerStore,
  saveTeamJoinBannerStore
} from "@/lib/store";

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

    let saved;
    if (body.type === "reorder") {
      const teamList = body.team || memberData;
      saved = await reorderTeamStore(teamList);
    } else if (body.type === "reorder_roadmap") {
      const steps = body.roadmap || memberData;
      saved = await reorderRoadmapStore(steps);
    } else if (body.type === "roadmap") {
      saved = await saveRoadmapStepStore(memberData);
    } else if (body.type === "joinBanner") {
      saved = await saveTeamJoinBannerStore(memberData);
    } else {
      saved = await saveTeamMemberStore(memberData);
    }

    try {
      revalidatePath("/team");
      revalidatePath("/about");
      revalidatePath("/admin/team");
      revalidatePath("/admin/about");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, data: saved }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400, headers: NO_CACHE_HEADERS });

    if (type === "roadmap") {
      await deleteRoadmapStepStore(id);
      try {
        revalidatePath("/about");
        revalidatePath("/admin/about");
        revalidatePath("/");
      } catch (_) {}
      return NextResponse.json({ success: true, message: `Roadmap step ${id} deleted.` }, { headers: NO_CACHE_HEADERS });
    }

    await deleteTeamMemberStore(id);
    try {
      revalidatePath("/team");
      revalidatePath("/admin/team");
      revalidatePath("/");
    } catch (_) {}
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
