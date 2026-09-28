import Members from "@/components/members/Members";
import { getAllMembers } from "@/lib/server/members";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/members",
  title: "Members",
  description:
    "Meet the members of Point Blank - the student developers, designers, and tech enthusiasts building our open source community from India.",
});

export default async function Events() {
  await connectDB();
  const allMembers = await getAllMembers();

  const members = JSON.parse(JSON.stringify(allMembers));

  return (
    <section className="w-full h-full" id="members">
      <Members members={members} />
    </section>
  );
}
