import Hustle from "@/components/hustle/Hustle";
import { type Latest, type Leaderboard, LatestModel, LeaderboardModel } from "@/lib/db/models/hustle";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/hustle",
  title: "PB Hustle",
  description:
    "PB Hustle is Point Blank's weekly coding challenge where student developers compete, sharpen their skills, and track their progress.",
});

export default async function HustlePage() {
  await connectDB();

  const latestDoc = await LatestModel.findOne({ name: "latest" }).lean();
  const leaderboardDoc = await LeaderboardModel.findOne({ name: "leaderboard" }).lean();

  const latest: Latest | null = latestDoc ? JSON.parse(JSON.stringify(latestDoc)) : null;
  const leaderboard: Leaderboard | null = leaderboardDoc ? JSON.parse(JSON.stringify(leaderboardDoc)) : null;

  return (
    <section className="w-full h-full" id="hustle">
      <Hustle latest={latest} leaderboard={leaderboard} />
    </section>
  );
}
