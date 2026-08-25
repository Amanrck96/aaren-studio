import { getTeamStore, getTeamJoinBannerStore } from "@/lib/store";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const [team, joinBanner] = await Promise.all([
    getTeamStore(),
    getTeamJoinBannerStore(),
  ]);

  return <TeamClient initialTeam={team} initialJoinBanner={joinBanner} />;
}
