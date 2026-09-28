import Achievements from "@/components/achievements/Achievements";
import { getAllAchievements } from "@/lib/server/achievements";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/achievements",
  title: "Achievements",
  description:
    "See the milestones and achievements of Point Blank - recognitions, wins, and accomplishments from our community.",
});
export default async function AchievementsPage() {
  await connectDB();
  const achievements = await getAllAchievements();

  const docs = JSON.parse(JSON.stringify(achievements));

  return <Achievements initialDocs={docs} />;
}
