import { MetadataRoute } from "next";
import connectDB from "@/lib/db/connection";
import Lore from "@/lib/db/models/lores";
import EventModel from "@/lib/db/models/events";
import MembersModel from "@/lib/db/models/members";
import AchievementsModel from "@/lib/db/models/achievements";
import TalkSchema from "@/lib/db/models/talks";
import { LatestModel, LeaderboardModel } from "@/lib/db/models/hustle";
import ContributionV2 from "@/lib/db/models/contributionsV2";
import type { Model } from "mongoose";
import { SITE_URL } from "@/lib/seo/constants";

export const revalidate = 86400;

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/events", priority: 0.8 },
  { path: "/lore", priority: 0.8 },
  { path: "/members", priority: 0.8 },
  { path: "/achievements", priority: 0.8 },
  { path: "/talks", priority: 0.8 },
  { path: "/hustle", priority: 0.8 },
  { path: "/oss", priority: 0.8 },
  { path: "/placements", priority: 0.8 },
  { path: "/brochure.pdf", priority: 0.5 },
];

/**
 * Returns the most recent `updatedAt` across a Mongoose collection,
 * or `fallback` if the collection is empty / errors out.
 */
async function latestUpdatedAt<T extends { updatedAt?: Date }>(
  model: Model<T>,
  fallback: Date
): Promise<Date> {
  try {
    const doc = await model
      .findOne()
      .sort({ updatedAt: -1 })
      .select("updatedAt")
      .lean<{ updatedAt?: Date } | null>();
    return doc?.updatedAt ?? fallback;
  } catch (error) {
    console.error("[sitemap] Error fetching latest updatedAt:", error);
    return fallback;
  }
}

async function safeFindOne<T>(queryFn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await queryFn();
  } catch (error) {
    console.error("[sitemap] Error running guarded hustle query:", error);
    return null;
  }
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const PLACEMENTS_LAST_MODIFIED = new Date("2026-04-16");
  const BROCHURE_LAST_MODIFIED = new Date("2026-04-16");
  try {
    await connectDB();

    const [
      loreDate,
      eventsDate,
      membersDate,
      achievementsDate,
      talksDate,
      latestDoc,
      leaderboardDoc,
      ossDate,
    ] = await Promise.all([
      latestUpdatedAt(Lore, now),
      latestUpdatedAt(EventModel, now),
      latestUpdatedAt(MembersModel, now),
      latestUpdatedAt(AchievementsModel, now),
      latestUpdatedAt(TalkSchema, now),
      safeFindOne(() =>
        LatestModel.findOne({ name: "latest" })
          .select("updateTime")
          .lean<{ updateTime?: Date } | null>()
      ),
      safeFindOne(() =>
        LeaderboardModel.findOne({ name: "leaderboard" })
          .select("updatedAt")
          .lean<{ updatedAt?: Date } | null>()
      ),
      latestUpdatedAt(ContributionV2, now),
    ]);

    const hustleDate = new Date(
      Math.max(
        latestDoc?.updateTime?.getTime() ?? 0,
        leaderboardDoc?.updatedAt?.getTime() ?? 0
      ) || now.getTime()
    );

    const lastModifiedByPath: Record<string, Date> = {
      "/": now,
      "/events": eventsDate,
      "/lore": loreDate,
      "/members": membersDate,
      "/achievements": achievementsDate,
      "/talks": talksDate,
      "/hustle": hustleDate,
      "/oss": ossDate,
      "/placements": PLACEMENTS_LAST_MODIFIED,
      "/brochure.pdf": BROCHURE_LAST_MODIFIED,
    };

    return ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: lastModifiedByPath[path] ?? now,
      priority,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to generate dynamic sitemap:", error);
    return ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      priority,
    }));
  }
}