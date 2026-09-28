import Talks from "@/components/talks/Talks";
import { getAllTalks } from "@/lib/server/talks";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/talks",
  title: "Talks",
  description:
    "Explore tech talks by Point Blank - sessions on software development, open source, and emerging technologies delivered by our community.",
});

export default async function TalksPage() {
  await connectDB();
  const allTalks = await getAllTalks();

  const talks = JSON.parse(JSON.stringify(allTalks));

  return (
    <section className="w-full h-full" id="talks">
      <Talks talks={talks} />
    </section>
  );
}
